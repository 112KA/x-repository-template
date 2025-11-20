#!/bin/sh
set -eu

# リポジトリルートへ移動
repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "Not a git repository" >&2; exit 1; }
cd "$repo_root"

if [ $# -lt 2 ]; then
  echo "usage: $0 remote-name prefix [branch]" >&2
  exit 1
fi

name=$1
prefix=$2
branch=${3:-main}

# squash_flag は常に存在する前提
squash_flag="--squash"

# remote が存在するか確認（存在しなければエラー）
if ! git remote | grep -qx "$name"; then
  echo "remote not found: $name" >&2
  echo "add the remote first (git remote add $name <url>)" >&2
  exit 1
fi

# remote をフェッチ
git fetch "$name" || { echo "fetch failed for $name" >&2; exit 1; }

# subtree add（git-subtree-dir コミットメッセージで既に追加済みの場合はスキップ）
if git log --grep="^git-subtree-dir: $prefix$" --pretty=format:"%h %s" | grep -q .; then
  echo "subtree already added: $prefix (skipping git subtree add)"
else
  # prefixディレクトリが存在する場合は削除
  if [ -d "$prefix" ]; then
    git filter-branch --tree-filter "rm -rf '$prefix'" -- --all
  fi
  git subtree add --prefix="$prefix" "$name" "$branch" $squash_flag || { echo "git subtree add failed" >&2; exit 1; }
  echo "subtree added: $prefix from $name/$branch (with squash)"
fi

# git alias 作成
push_alias="!sh -c 'git subtree push --prefix=$prefix $name $branch'"
pull_alias="!sh -c 'git subtree pull --prefix=$prefix $name $branch $squash_flag'"

git config "alias.$name-push" "$push_alias"
git config "alias.$name-pull" "$pull_alias"

echo "aliases created: git $name-push, git subtree-pull-$name"

exit 0