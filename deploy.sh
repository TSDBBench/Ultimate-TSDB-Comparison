#! /bin/bash

# build a branch different from master
build_branch () {
  BRANCH=$1

  if [[ ! -d prs ]]; then
    mkdir prs
  fi

  mkdir prs/${BRANCH}

# copy build result to final directory
  cp -r www/* prs/${BRANCH}
  git add prs

# add prs/${BRANCH} to gh-pages
  git commit -m "Travis commit for ${BRANCH}"
  git checkout -b ${BRANCH}
  git checkout -f gh-pages
  git checkout -f ${BRANCH} prs/${BRANCH}
  git add prs

# add index.md
  echo "Create index.md"
  echo '<a href="https://github.com/ultimate-comparisons/ultimate-comparison-BASE"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"></a>' > index.md
  tail -n +2 README.md >> index.md

# add docs to index.md
  echo "Create Docs Section"
  echo "# Docs" >> index.md
  echo "- [Travis_Build_Deploy](docs/Travis_Build_Deploy.md)" >> index.md
  echo "- [Update_YOUR_Comparison.md](docs/Update_YOUR_Comparison.md)" >> index.md
  echo "- [ADR Index](docs/adr)" >> index.md

# insert linebreak in index.md
  echo "" >> index.md

# add PRs to index.md
  echo "Create PRs Section"
  git checkout -f gh-pages prs
  echo "# PRs" >> index.md
  find prs -mindepth 1 -maxdepth 1 -type d -exec bash -c 'f=$(basename $1 .ts);d=$(dirname $1);echo "- [${f}](${d}/${f})"' bash {} >> index.md \;

# add link to current demo to index.md
  echo "Create link to demo"
  echo "" >> index.md
  echo "# Current Master" >> index.md
  echo "- [Demo](https://ultimate-comparisons.github.io/ultimate-comparison-BASE/demo/)" >> index.md

# add index.md to gh-pages
  git add index.md
  git commit -m "Travis commit for prs"
  git push SSH gh-pages
  git commit -m "Travis commit for ${BRANCH}"
  git push SSH gh-pages
}

# build master
build_master () {  
# add docs to gh-pages
  git checkout -f gh-pages
  git checkout -f master docs
  git add docs
  git commit -m "Travis commit for docs on master"
  git checkout -f master

  if [[ ! -d demo ]]; then
    mkdir demo
  fi

  cp -r www/* demo

# add demo to gh-pages
  git add demo
  git commit -m "Travis commit for master"
  git checkout -f gh-pages
  git pull SSH
  git checkout -f master demo
  git add demo
  git commit -m "Travis commit for demo on master"
  git push SSH gh-pages
  git pull

  git checkout -f master README.md

# add index.md
  echo "Create index.md"
  echo '<a href="https://github.com/ultimate-comparisons/ultimate-comparison-BASE"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"></a>' > index.md
  tail -n +2 README.md >> index.md

# add docs to index.md
  echo "Create Docs Section"
  echo "# Docs" >> index.md
  echo "- [Travis_Build_Deploy](docs/Travis_Build_Deploy.md)" >> index.md
  echo "- [Update_YOUR_Comparison.md](docs/Update_YOUR_Comparison.md)" >> index.md
  echo "- [ADR Index](docs/adr)" >> index.md

# insert linebreak in index.md
  echo "" >> index.md

# add PRs to index.md
  echo "Create PRs Section"
  git checkout -f gh-pages prs
  echo "# PRs" >> index.md
  find prs -mindepth 1 -maxdepth 1 -type d -exec bash -c 'f=$(basename $1 .ts);d=$(dirname $1);echo "- [${f}](${d}/${f})"' bash {} >> index.md \;

# add link to current demo to index.md
  echo "Create link to demo"
  echo "" >> index.md
  echo "# Current Master" >> index.md
  echo "- [Demo](https://ultimate-comparisons.github.io/ultimate-comparison-BASE/demo/)" >> index.md

# add index.md to gh-pages
  echo "Push index.md"
  git add index.md
  git commit -m "Travis commit for prs"
  git push SSH gh-pages
}

git remote add SSH git@github.com:ultimate-comparisons/ultimate-comparison-BASE.git
git fetch --all
# decide which functions should be called
if [[ ${TRAVIS_PULL_REQUEST} != false ]]; then
  CURRENT_BRANCH=${TRAVIS_PULL_REQUEST_BRANCH}
  build_branch ${TRAVIS_PULL_REQUEST_BRANCH}
else
  if [[ ${TRAVIS_BRANCH} != "master" ]]; then
    echo "or not..."
    exit 0;
  fi
  CURRENT_BRANCH="master"
  build_master
fi
