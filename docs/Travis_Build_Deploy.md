## How to build your project with Travis CI and deploy it on GitHub
1. Sign in to [Travis CI](https://travis-ci.org/)
2. Sync and enable your GitHub repository
3. Add [`.travis.yml`](https://docs.travis-ci.com/user/customizing-the-build) to your repository:
  
        language: node_js
        node_js:
        - '6'
        env:
        - GIT_DEPLOY_DIR: www
        script: npm test
        after_success:
        - git remote set-url origin git@github.com:ultimate-comparisons/ultimate-comparison-BASE.git
        - openssl aes-256-cbc -K $encrypted_08460152d0a3_key -iv $encrypted_08460152d0a3_iv -in id_rsa.enc -out id_rsa -d
        - eval "$(ssh-agent -s)"
        - chmod 600 id_rsa
        - ssh-add id_rsa
        - "./deploy.sh"
        before_install:
        - wget https://github.com/jgm/pandoc/releases/download/1.17.2/pandoc-1.17.2-1-amd64.deb
        - sudo dpkg -i pandoc-1.17.2-1-amd64.deb
        - rm pandoc-1.17.2-1-amd64.deb
        - npm install -g npm
        - java -version
        - pandoc -v
        - npm -version
        - npm install
        sudo: required
        dist: trusty


4. Generate an ssh-key:
`ssh-keygen -t rsa -b 4096 -f id_rsa`
5. Add the public key to **Deploy keys** of the repository (not to the user account keys) + write access
6. Install Travis CI:
(linux): `gem install travis`
7. Encrypt the private key:
    `travis encrypt-file id_rsa`
8. Replace the `git remote ...` and `openssl ...` command in `.travis.yml`
9. Add the encrypted key `id_rsa.enc` to your repository
11. Add [`deploy.sh`](https://github.com/X1011/git-directory-deploy) to your repository and make it executable

## FAQ
- `gem install travis` fails: https://stackoverflow.com/a/38822195/8235252
