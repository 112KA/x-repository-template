import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const git = (args) =>
  spawnSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const mustGit = (args, message) => {
  const result = git(args);
  if (result.status !== 0) {
    fail(`${message}\n${result.stderr.trim()}`);
  }
  return result.stdout.trim();
};

const rootResult = git(['rev-parse', '--show-toplevel']);
if (rootResult.status !== 0) {
  fail('Not a git repository');
}
process.chdir(rootResult.stdout.trim());

const [name, prefix, branch = 'main'] = process.argv.slice(2);
if (!name || !prefix) {
  fail('usage: _git-subtree-setup.mjs remote-name prefix [branch]');
}

const squashFlag = '--squash';

const remoteNames = mustGit(['remote'], 'failed to list remotes').split(/\r?\n/);
if (!remoteNames.includes(name)) {
  fail(`remote not found: ${name}\nadd the remote first (git remote add ${name} <url>)`);
}

mustGit(['fetch', name], `fetch failed for ${name}`);

const markerFound = mustGit(
  ['log', `--grep=^git-subtree-dir: ${prefix}$`, '--pretty=format:%h %s'],
  'failed to read git log',
);

if (markerFound) {
  console.log(`subtree already added: ${prefix} (skipping git subtree add)`);
} else {
  const dirty = mustGit(['status', '--porcelain'], 'failed to read git status');
  if (dirty) {
    fail('working tree is dirty. commit or stash changes first');
  }

  const upstreamTree = mustGit(
    ['rev-parse', `${name}/${branch}^{tree}`],
    `failed to resolve ${name}/${branch}^{tree}`,
  );
  const localTree = git(['rev-parse', '-q', '--verify', `HEAD:${prefix}`]).stdout.trim();

  if (localTree === upstreamTree) {
    // 内容が upstream と一致する場合は、同期済みの印となる空コミットのみを作成する
    const split = mustGit(['rev-parse', `${name}/${branch}`], `failed to resolve ${name}/${branch}`);
    const msg = `Add '${prefix}/' from commit '${split}'\n\ngit-subtree-dir: ${prefix}\ngit-subtree-split: ${split}\n`;
    mustGit(['commit', '-q', '--allow-empty', '-m', msg], 'failed to create marker commit');
    console.log(`marked as synced: ${prefix} at ${name}/${branch} (no subtree add)`);
  } else {
    // 履歴を書き換えず、既存の prefix を通常コミットで削除してから upstream を正として add する
    if (mustGit(['ls-files', '--', prefix], `failed to list files under ${prefix}`)) {
      mustGit(['rm', '-r', '-q', '--', prefix], `failed to remove ${prefix}`);
      mustGit(
        ['commit', '-q', '-m', `chore: remove ${prefix} before adding ${name}/${branch} as subtree`],
        'failed to commit removal',
      );
    }
    if (existsSync(prefix)) {
      fail(`prefix still exists (untracked files?): ${prefix}`);
    }
    mustGit(
      ['subtree', 'add', `--prefix=${prefix}`, name, branch, squashFlag],
      'git subtree add failed',
    );
    console.log(`subtree added: ${prefix} from ${name}/${branch} (with squash)`);
  }
}

const pushAlias = `!sh -c 'git subtree push --prefix=${prefix} ${name} ${branch}'`;
const pullAlias = `!sh -c 'git subtree pull --prefix=${prefix} ${name} ${branch} ${squashFlag}'`;

mustGit(['config', `alias.${name}-push`, pushAlias], `failed to set alias.${name}-push`);
mustGit(['config', `alias.${name}-pull`, pullAlias], `failed to set alias.${name}-pull`);

console.log(`aliases created: git ${name}-push, git ${name}-pull`);
