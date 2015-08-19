#!/bin/bash -e

current_version=$(node -p "require('./package').version")
current_tag="v$current_version"

npm run build-docs

git checkout gh-pages

mv _book $current_tag

git add $current_tag
git commit -m "Update $current_version docs"

#git push -f git@github.com:rackt/history gh-pages
