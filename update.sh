#!/usr/bin/env bash
set -o errexit 

main() {
    echo "Start update..."

    # Source directory & target branch.
	deploy_branch=${GIT_UPDATE_BRANCH:-update}
    
    #if no user identity is already set in the current git environment, use this:
	default_username=${GIT_DEPLOY_USERNAME:-update.sh}
	default_email=${GIT_DEPLOY_EMAIL:-}
    
    #repository to deploy to. must be readable and writable.
	repo=${GIT_DEPLOY_REPO:-origin}

	#append commit hash to the end of message by default
	append_hash=${GIT_DEPLOY_APPEND_HASH:-true}
    
    if ! git diff --exit-code --quiet --cached; then
		echo Aborting due to uncommitted changes in the index >&2
		return 1
	fi

	commit_title=`git log -n 1 --format="%s" HEAD`
	commit_hash=` git log -n 1 --format="%H" HEAD`
	
	#default commit message uses last title if a custom one is not supplied
	if [[ -z $commit_message ]]; then
		commit_message="publish: $commit_title"
	fi
	
	#append hash to commit message unless no hash flag was found
	if [ $append_hash = true ]; then
		commit_message="$commit_message"$'\n\n'"generated from commit $commit_hash"
	fi
		
	previous_branch=`git rev-parse --abbrev-ref HEAD`

    echo "Update previous branch: ${previous_branch}"
    if git ls-remote --exit-code $repo "refs/heads/$deploy_branch" ; then
		# deploy_branch exists in $repo; make sure we have the latest version
		
		disable_expanded_output
		git fetch --force $repo $deploy_branch:$deploy_branch
		enable_expanded_output
	fi

    # check if deploy_branch exists locally
	if git show-ref --verify --quiet "refs/heads/$deploy_branch"
	then incremental_deploy
	else initial_deploy
	fi

	update_repos
}

remove_files(){
    git rm -r --cached comparison-configuration
    git rm -r --cached comparison-elements
    git rm --cached README.md
    git rm --cached README-THING.template.md
    git rm --cached .travis.yml
    git rm --cached id_rsa.enc
    git rm --cached github_deploy_key.enc
    git rm --cached LICENSE
    git rm --cached citation/acm-siggraph.csl
    git rm --cached citation/default.bib
}

initial_deploy() {
	git checkout --orphan $deploy_branch
    git add --all
	commit+push
}

incremental_deploy() {
	#make deploy_branch the current branch
	git symbolic-ref HEAD refs/heads/$deploy_branch
	#put the previously committed contents of deploy_branch into the index
	git reset --mixed --quiet
    git add --all
	set +o errexit
	diff=$(git diff --exit-code --quiet HEAD --)$?
	set -o errexit
	case $diff in
		0) echo No changes to files. Skipping commit.;;
		1) commit+push;;
		*)
			echo git diff exited with code $diff. Aborting. Staying on branch $deploy_branch so you can debug. To switch back to master, use: git symbolic-ref HEAD refs/heads/master && git reset --mixed >&2
			return $diff
			;;
	esac
}

commit+push() {
	set_user_id
    remove_files
    
	git commit -m "$commit_message"

	disable_expanded_output
	#--quiet is important here to avoid outputting the repo URL, which may contain a secret token
	git push --quiet $repo $deploy_branch
	enable_expanded_output
}

set_user_id() {
	if [[ -z `git config user.name` ]]; then
		git config user.name "$default_username"
	fi
	if [[ -z `git config user.email` ]]; then
		git config user.email "$default_email"
	fi
}

#echo expanded commands as they are executed (for debugging)
enable_expanded_output() {
	if [ $verbose ]; then
		set -o xtrace
		set +o verbose
	fi
}

#this is used to avoid outputting the repo URL, which may contain a secret token
disable_expanded_output() {
	if [ $verbose ]; then
		set +o xtrace
		set -o verbose
	fi
}

# run script to update repos
update_repos () {
  echo "Start to update repos"
  npm install --only=dev
  node update-repos.js ${GITHUB_TOKEN}
}

main
