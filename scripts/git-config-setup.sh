#!/bin/sh
set -eu

# リポジトリルートへ移動
repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "Not a git repository" >&2; exit 1; }
cd "$repo_root"

ADD_SCRIPT="./scripts/git-add-remotes.sh"
SUBTREE_SCRIPT="./scripts/git-subtree-setup.sh"

[ -x "$ADD_SCRIPT" ] || { echo "missing or not executable: $ADD_SCRIPT" >&2; exit 1; }
[ -x "$SUBTREE_SCRIPT" ] || { echo "missing or not executable: $SUBTREE_SCRIPT" >&2; exit 1; }

# --- ハードコードする remotes ---
# 形式: name=url (1行ごと)
while read -r pair; do
  [ -z "$pair" ] && continue
  echo "adding remote: $pair"
  sh "$ADD_SCRIPT" "$pair"
done <<'REMS'
x=https://github.com/112KA/x.git
x-src=https://github.com/112KA/x_src.git
x3=https://github.com/112KA/x3.git
x3-src=https://github.com/112KA/x3_src.git
REMS

# --- ハードコードする subtrees ---
# 形式: remote prefix [branch] (スペース区切り、branch が無ければ main を使う)
while read -r remote prefix branch; do
  [ -z "$remote" ] && continue
  [ -z "$prefix" ] && { echo "subtree spec invalid: $remote $prefix $branch" >&2; exit 1; }
  branch=${branch:-main}
  echo "setting up subtree: remote=$remote prefix=$prefix branch=$branch"
  sh "$SUBTREE_SCRIPT" "$remote" "$prefix" "$branch"
done <<'SUBS'
x packages/x main
x-src packages/x/src main
x3 packages/x3 main
x3-src packages/x3/src main
SUBS

echo "git config setup completed"