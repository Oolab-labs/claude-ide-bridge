import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export interface IdeEnvironment {
  editorBinary: string | null;
  hasExtension: boolean;
  isHeadless: boolean;
  isRemote: boolean;
  isContainer: boolean;
  isWsl: boolean;
}

export interface IdeRecommendation {
  mode: "slim" | "full";
  flag: string;
  reason: string;
}

const EXTENSION_DIRS = [
  path.join(homedir(), ".vscode", "extensions"),
  path.join(homedir(), ".vscode-server", "extensions"),
  path.join(homedir(), ".cursor", "extensions"),
  path.join(homedir(), ".windsurf", "extensions"),
];

function detectExtension(): boolean {
  for (const dir of EXTENSION_DIRS) {
    try {
      if (!existsSync(dir)) continue;
      const entries = readdirSync(dir);
      if (entries.some((e) => e.toLowerCase().includes("claude-ide-bridge"))) {
        return true;
      }
    } catch {}
  }
  return false;
}

function detectContainer(): boolean {
  try {
    const cg = readFileSync("/proc/1/cgroup", "utf-8");
    return /docker|containerd|kubepods/.test(cg);
  } catch {
    return false;
  }
}

function detectWsl(): boolean {
  if (process.platform !== "linux") return false;
  if (process.env.WSL_DISTRO_NAME || process.env.WSLENV) return true;
  try {
    return readFileSync("/proc/version", "utf-8")
      .toLowerCase()
      .includes("microsoft");
  } catch {
    return false;
  }
}

export function probeIdeEnvironment(
  editorBinary: string | null,
): IdeEnvironment {
  const isRemote = Boolean(
    process.env.SSH_CONNECTION || process.env.SSH_CLIENT,
  );
  const noDisplay =
    process.platform === "linux" &&
    !process.env.DISPLAY &&
    !process.env.WAYLAND_DISPLAY;
  const isContainer = detectContainer();
  const isWsl = detectWsl();
  return {
    editorBinary,
    hasExtension: detectExtension(),
    isHeadless: noDisplay || isContainer || Boolean(process.env.CI),
    isRemote,
    isContainer,
    isWsl,
  };
}

export function recommendMode(env: IdeEnvironment): IdeRecommendation {
  if (
    env.editorBinary &&
    env.hasExtension &&
    !env.isHeadless &&
    !env.isContainer
  ) {
    return {
      mode: "slim",
      flag: "--slim",
      reason: `detected ${env.editorBinary} + bridge extension — slim mode is faster and LSP-focused`,
    };
  }
  const why: string[] = [];
  if (!env.editorBinary) why.push("no VS Code CLI on PATH");
  if (!env.hasExtension) why.push("bridge extension not installed");
  if (env.isContainer) why.push("container environment");
  if (env.isHeadless) why.push("headless/no display");
  if (env.isRemote) why.push("remote/SSH session");
  return {
    mode: "full",
    flag: "--full",
    reason: `${why.join(", ")} — full mode exposes headless tool set (git, terminal, GitHub, tsserver LSP fallback)`,
  };
}

export function formatRecommendation(rec: IdeRecommendation): string {
  return (
    `\nRecommendation: start the bridge with \`${rec.flag}\`\n` +
    `  ${rec.reason}\n`
  );
}
