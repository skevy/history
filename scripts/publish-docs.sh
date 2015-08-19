#!/bin/bash -e

printf "Which tag do you want to build the docs for? "
read tag

sha=`git rev-list -1 $tag`

rm -rf docs
git checkout $sha -- docs
git reset docs

mv docs/README.md SUMMARY.md
mv docs/* .

gitbook build

rm -rf $tag
mv _book $tag

git add $tag
git commit -m "Update $tag docs"

git push git@github.com:rackt/history gh-pages

git clean -f .
