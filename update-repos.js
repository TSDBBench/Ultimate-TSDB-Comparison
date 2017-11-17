const Github = require('github-api');
const Git = require('simple-git');
const async = require('async');
const fs = require('file-system');
const travisBranch = 'travis-update';

/****************************************************
 *                 DEFINITIONS                      *
 ****************************************************/

/**
 * Deletes a directory recursively, meaning it first deletes all content and afterwards the directory itself.
 * Works also on pure files.
 * @param path Path to the directory to be deleted.
 */
function deleteRecursive(path) {
    if (fs.existsSync(path)) {
        const parentStat = fs.statSync(path);
        if (parentStat.isDirectory()) {
            const files = fs.readdirSync(path);
            files.forEach(function (file) {
                const curPath = path + "/" + file;
                const childStat = fs.statSync(curPath);
                if (childStat.isDirectory()) { // recurse
                    deleteRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }
}

/**
 * Copy the content of a directory into another directory.
 * It only replaces files in {@code targetRoot} and does not delete any other files.
 * Preferred way to be called via {@see mergeDirs}.
 * @param sourceDir Directory whose content should be copied
 * @param targetRoot Directory that should contain the content of {@code sourceDir}
 */
function copyDir(sourceDir, targetRoot) {
    const sourceFiles = fs.readdirSync(sourceDir);
    for (const file of sourceFiles) {
        const sourceStat = fs.statSync(`${sourceDir}/${file}`);
        if (sourceStat.isDirectory()) {
            if (!fs.existsSync(`${targetRoot}/${file}`) || !fs.statSync(`${targetRoot}/${file}`).isDirectory()) {
                fs.mkdirSync(`${targetRoot}/${sourceDir}/${file}`);
            }
            copyDir(`${sourceDir}/${file}`, `${targetRoot}`)
        } else {
            fs.copyFileSync(`${sourceDir}/${file}`, `${targetRoot}/${sourceDir}/${file}`);
        }
    }
}

/**
 * Wrapper for {@link copyDir} to check if both parameters are directories.
 * @param source Source of the content
 * @param target Should contain the content afterwards
 */
function mergeDirs(source, target) {
    if (!fs.statSync(source).isDirectory() || !fs.statSync(target).isDirectory()) {
        return;
    }
    copyDir(source, target);
}

/**
 * Method for creating a PR.
 * @param repoName name of the repository in the format owner/repo
 * @param cb callback
 */
function makePr(repoName, cb) {
    const repo = gh.getRepo(repoName);
    repo.listPullRequests({state:'open'}).then(function (prs) {
        if (prs.data.filter(pr => pr.title === 'Update of Ultimate-Comparison-BASE' &&
                pr.user.login === 'ultimate-comparison-genie').length === 0) {
            repo.createPullRequest({
                title: 'Update of Ultimate-Comparison-BASE',
                head: travisBranch,
                base: 'master',
                body: 'This is PR was automatically created because Ultimate-Comparisons-BASE was updated.\n' +
                'Pease incorporate this PR into this comparison.',
                maintainer_can_modify: true
            }).then(function () {
                console.log(`Made PR for ${repoName}`);
                cb();
            }).catch(function (error) {
                console.error(error);
            });
        } else {
            console.log('PR already open and thus no creation needed')
        }
    });
}

/**
 * Reform current branch to update branch
 * @param gt reference to git repo with simple-git.Git
 * @param repoName full name of the repo, meaning 'owner/repo'
 * @param cb callback
 */
function makeUpdate(gt, repoName, cb) {
    const path = gt._baseDir;
    const ignores = [
        'comparison-configuration',
        'comparison-elements',
        'README.md',
        'README-THING.template.md',
        '.travis.yml',
        'id_rsa.enc',
        'id_rsa',
        'LICENSE',
        'citation/acm-siggraph.csl',
        'citation/default.bib',
        '.git',
        'node_modules',
        'typings',
        'www',
        'github_deploy_key',
        'github_deploy_key.enc'
    ];

    async.eachOf(fs.readdirSync('.').filter(f => ignores.indexOf(f) === -1), (file, index, cb) => {
        console.log(`merge ${file}`);
        try {
            if (fs.statSync(file).isDirectory()) {
                mergeDirs(file, path);
            } else {
                fs.createReadStream(file).pipe(fs.createWriteStream(`${path}/${file}`));
            }
        } catch (error) {
            console.error(error);
        } finally {
            cb();
        }
    }, () => {
        gt.add(fs.readdirSync(gt._baseDir).filter(f => ignores.indexOf(f) === -1)).exec(function () {
            gt.commit('Travis commit for travis-update').exec(function () {
                gt.push(['-f', 'origin', travisBranch]).exec(function () {
                    console.log(`Pushed to ${gt._baseDir}`);
                    makePr(repoName, cb);
                    deleteRecursive(path);
                });
            });
        });
    });
}

/****************************************************
 *                 SCRIPT START                     *
 ****************************************************/

if (process.argv.length <= 2) {
    console.error('Usage: node update-repos.js API_TOKEN');
    process.exit(1)
}
const apiToken = process.argv[2];

const gh = new Github({
    token: apiToken
});
const uc = gh.getOrganization('ultimate-comparisons');
uc.getRepos().then(rs => {
    let repos = rs.data
        .map(r => { return { fullname: r.full_name, name: r.full_name.split('/')[1]}; })
        .filter(r => r.name !== 'ultimate-comparison-BASE' && !r.name.endsWith('.io'));
    const foreignRepos = fs.readFileSync('repos-to-update.list', {encoding: 'utf8'})
        .split('\n')
        .map(e => e.trim())
        .filter(e => !e.startsWith('#') && e.length > 0)
        .map(e => { return {fullname: e, name: e.split('/')[1]}; });
    repos = repos.concat(foreignRepos);

    console.log("Repos to update: " + JSON.stringify(repos, null, 2));

    async.eachOf(repos, function (repo, index, cb) {
        console.log(`iterate ${repo.fullname}`);
        fs.mkdirSync(`../${repo.name}`);
        const gt = Git(`../${repo.name}`);
        gt.clone(`git@github.com:${repo.fullname}.git`, `../${repo.name}`, function () {
            gt.addConfig('user.email', 'kopp.dev+ultimate-comparison-genie@gmail.com').exec(function() {
                gt.addConfig('user.name', 'Ultimate-Comparison-Genie').exec(function() {
                    gt.branch(function (err, branches) {
                        if (err) {
                            console.error(err);
                        }
                        if (Object.keys(branches.branches).indexOf(travisBranch) === -1) {
                            gt.checkoutLocalBranch(travisBranch, function () {
                                makeUpdate(gt, repo.fullname, cb);
                            });
                        } else {
                            gt.checkout(travisBranch, function () {
                                makeUpdate(gt, repo.fullname, cb);
                            });
                        }
                    });
                });
            });
        });
    }, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('update done')
        }
    });
}).catch(err => {
    console.error(err);
    process.exit(2);
});
