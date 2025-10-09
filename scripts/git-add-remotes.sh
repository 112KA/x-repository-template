#!/bin/sh
set -eu

# リポジトリルートに移動
repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "Not a git repository" >&2; exit 1; }
cd "$repo_root"

if [ $# -eq 0 ]; then
  echo "usage: $0 name=url [name=url ...]" >&2
  exit 1
fi

for pair in "$@"; do
  case "$pair" in
    *=*) ;;
    *)
      echo "skip invalid: $pair" >&2
      continue
      ;;
  esac

  name=${pair%%=*}
  url=${pair#*=}

  if [ -z "$name" ] || [ -z "$url" ]; then
    echo "skip invalid: $pair" >&2
    continue
  fi

  if git remote | grep -qx "$name"; then
    echo "remote exists, skipping: $name -> $(git remote get-url "$name")"
    continue
  fi

  git remote add "$name" "$url" && echo "added: $name -> $url"
done

exit 0