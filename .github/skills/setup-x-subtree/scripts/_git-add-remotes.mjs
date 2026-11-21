import { spawnSync } from "node:child_process";

const git = (args) =>
  spawnSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const rootResult = git(["rev-parse", "--show-toplevel"]);
if (rootResult.status !== 0) {
  fail("Not a git repository");
}
process.chdir(rootResult.stdout.trim());

const pairs = process.argv.slice(2);
if (pairs.length === 0) {
  fail("usage: _git-add-remotes.mjs name=url [name=url ...]");
}

const existingRemotes = git(["remote"]).stdout.split(/\r?\n/);

for (const pair of pairs) {
  const sep = pair.indexOf("=");
  const name = sep < 0 ? "" : pair.slice(0, sep);
  const url = sep < 0 ? "" : pair.slice(sep + 1);

  if (!name || !url) {
    console.error(`skip invalid: ${pair}`);
    continue;
  }

  if (existingRemotes.includes(name)) {
    const currentUrl = git(["remote", "get-url", name]).stdout.trim();
    console.log(`remote exists, skipping: ${name} -> ${currentUrl}`);
    continue;
  }

  const added = git(["remote", "add", name, url]);
  if (added.status !== 0) {
    fail(`failed to add remote: ${name}\n${added.stderr.trim()}`);
  }
  console.log(`added: ${name} -> ${url}`);
}
