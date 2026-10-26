// Heavily inspired by the skills manager CLI that Anthony Fu wrote for antfu/skills (MIT):
// https://github.com/antfu/skills/blob/main/scripts/cli.ts

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";

const root = join(import.meta.dirname, "..");

const usage = `Usage: pnpm sources <command>

Commands:
  status                            Fetch every source and show what changed since each generated skill
  update                            Check out the latest commit of every source's tracked branch
  add <url> [name] --branch <name>  Add a documentation repo as a submodule in sources/`;

interface Source {
  name: string;
  path: string;
  upstream: string;
}

interface Generation {
  skill: string;
  sha: string | undefined;
  date: string;
  // Source name -> doc paths inside that source. "." is the whole repo.
  paths: Map<string, string[]>;
}

const SOURCE_MENTION = /sources\/([\w.-]+)((?:\/[\w.-]+)*)/g;
const SHA_LINE = /\*\*Git SHA:\*\*\s*`([0-9a-f]{7,40})`/;
const DATE_LINE = /\*\*Generated:\*\*\s*(\S+)/;

function git(args: string[], cwd = root): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function tryGit(args: string[], cwd = root): string | undefined {
  try {
    return git(args, cwd);
  } catch {
    return undefined;
  }
}

function runGit(args: string[]): void {
  execFileSync("git", args, { cwd: root, stdio: "inherit" });
}

function readSources(): Source[] {
  const lines = tryGit(["config", "-f", ".gitmodules", "--get-regexp", String.raw`^submodule\..*\.path$`]);
  if (!lines) return [];

  return lines
    .split("\n")
    .map((line) => {
      const [key, path] = line.split(" ");
      const id = key.slice("submodule.".length, -".path".length);
      const branch = tryGit(["config", "-f", ".gitmodules", `submodule.${id}.branch`]) ?? "HEAD";
      return { name: path.slice("sources/".length), path, upstream: `origin/${branch}` };
    })
    .filter((source) => source.path.startsWith("sources/"));
}

function readGenerations(): Generation[] {
  const skillsDir = join(root, "skills");
  const generations: Generation[] = [];

  for (const skill of readdirSync(skillsDir)) {
    const file = join(skillsDir, skill, "GENERATION.md");
    if (!existsSync(file)) continue;

    const text = readFileSync(file, "utf8");
    const paths = new Map<string, string[]>();
    for (const [, name, subpath] of text.matchAll(SOURCE_MENTION)) {
      paths.set(name, [...(paths.get(name) ?? []), subpath ? subpath.slice(1) : "."]);
    }

    generations.push({
      skill,
      sha: text.match(SHA_LINE)?.[1],
      date: text.match(DATE_LINE)?.[1] ?? "unknown date",
      paths,
    });
  }

  return generations;
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function isCheckedOut(source: Source): boolean {
  return existsSync(join(root, source.path, ".git"));
}

function reportSources(sources: Source[]): void {
  console.log("Sources");
  for (const source of sources) {
    const cwd = join(root, source.path);
    if (!isCheckedOut(source)) {
      console.log(`  ${source.name}: not checked out. Run \`git submodule update --init\`.`);
      continue;
    }

    const head = git(["rev-parse", "--short", "HEAD"], cwd);
    const behind = tryGit(["rev-list", "--count", `HEAD..${source.upstream}`], cwd);
    const state =
      behind === undefined
        ? `${source.upstream} does not exist`
        : behind === "0"
          ? "up to date"
          : `${behind} commits behind ${source.upstream}`;
    console.log(`  ${source.name} at ${head}: ${state}`);
  }
}

function reportSkills(sources: Source[]): void {
  console.log("\nGenerated skills");
  for (const generation of readGenerations()) {
    const label = `  ${generation.skill} (generated ${generation.date})`;
    const { sha } = generation;
    if (!sha) {
      console.log(`${label}: GENERATION.md has no Git SHA.`);
      continue;
    }

    const owner = sources.find(
      (source) =>
        generation.paths.has(source.name) &&
        isCheckedOut(source) &&
        tryGit(["cat-file", "-e", `${sha}^{commit}`], join(root, source.path)) !== undefined,
    );
    if (!owner) {
      console.log(`${label}: commit ${sha.slice(0, 7)} is not in any source it references.`);
      continue;
    }

    const cwd = join(root, owner.path);
    const range = `${sha.slice(0, 7)}..${owner.upstream}`;
    const pathspec = ["--", ...(generation.paths.get(owner.name) ?? ["."])];
    const commits = git(["rev-list", "--count", range, ...pathspec], cwd);
    const files = git(["diff", "--name-only", range, ...pathspec], cwd).split("\n").filter(Boolean);

    if (commits === "0") {
      console.log(`${label}: no doc changes in ${owner.path}.`);
    } else {
      console.log(
        `${label}: ${plural(files.length, "doc file")} changed in ${plural(Number(commits), "commit")} in ${owner.path}.`,
      );
      console.log(`    git -C ${owner.path} diff ${range} ${pathspec.join(" ")}`);
    }

    for (const name of generation.paths.keys()) {
      if (name !== owner.name) console.log(`    sources/${name} has no recorded SHA.`);
    }
  }
}

function status(): void {
  const sources = readSources();
  for (const source of sources) {
    if (isCheckedOut(source)) git(["fetch", "--quiet", "origin"], join(root, source.path));
  }
  reportSources(sources);
  reportSkills(sources);
}

function update(): void {
  const sources = readSources();
  runGit(["submodule", "update", "--init", "--remote", "--", ...sources.map((source) => source.path)]);
  reportSkills(sources);
}

function add(args: string[], branch: string | undefined): void {
  const [url, name = basename(url ?? "", ".git")] = args;
  if (!url || !branch) {
    console.error(`${usage}\n\nThe add command needs a URL and --branch.`);
    process.exit(1);
  }

  const path = `sources/${name}`;
  if (existsSync(join(root, path))) {
    console.error(`${path} already exists.`);
    process.exit(1);
  }

  runGit(["submodule", "add", "--branch", branch, url, path]);
}

function main(): void {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { branch: { type: "string", short: "b" } },
  });
  const [command, ...args] = positionals;

  if (command === "status") status();
  else if (command === "update") update();
  else if (command === "add") add(args, values.branch);
  else {
    console.error(usage);
    process.exit(command ? 1 : 0);
  }
}

main();
