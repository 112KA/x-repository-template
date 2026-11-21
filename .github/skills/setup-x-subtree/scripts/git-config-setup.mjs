import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const addScript = join(scriptDir, '_git-add-remotes.mjs');
const subtreeScript = join(scriptDir, '_git-subtree-setup.mjs');

// --- ハードコードする remotes ---
// 形式: name=url
const remotes = [
  'x-src=https://github.com/112KA/x_src.git',
  'x3-src=https://github.com/112KA/x3_src.git',
];

// --- ハードコードする subtrees ---
const subtrees = [
  { remote: 'x-src', prefix: 'packages/x/src', branch: 'main' },
  { remote: 'x3-src', prefix: 'packages/x3/src', branch: 'main' },
];

const runNode = (script, args) => {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const rootResult = spawnSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
});
if (rootResult.status !== 0) {
  console.error('Not a git repository');
  process.exit(1);
}
process.chdir(rootResult.stdout.trim());

for (const script of [addScript, subtreeScript]) {
  if (!existsSync(script)) {
    console.error(`missing: ${script}`);
    process.exit(1);
  }
}

for (const pair of remotes) {
  console.log(`adding remote: ${pair}`);
  runNode(addScript, [pair]);
}

for (const { remote, prefix, branch } of subtrees) {
  console.log(`setting up subtree: remote=${remote} prefix=${prefix} branch=${branch}`);
  runNode(subtreeScript, [remote, prefix, branch]);
}

console.log('git config setup completed');
