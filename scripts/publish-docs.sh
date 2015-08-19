#!/bin/bash -e

printf "Which tag do you want to build the docs for? "
read tag

git checkout $tag -- docs
git reset docs

cp docs/README.md SUMMARY.md
cp -r docs/* .

gitbook build

rm -rf $tag
mv _book $tag

git add $tag
git commit -m "Update $tag docs"

#git push git@github.com:rackt/history gh-pages
