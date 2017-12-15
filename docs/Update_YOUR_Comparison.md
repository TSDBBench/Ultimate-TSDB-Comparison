## Update your own comparison with the update branch
There are two main branches in this repository, master and update.
They contain mostly the same files but update does not include configuration and comparison-elements files.
Because of this it is save to merge update into your own comparison.

1. Add ultimate-comparison-base as a remote origin:

  ```bash
  git remote add base https://github.com/ultimate-comparisons/ultimate-comparison-BASE.git
  ```

2. Pull from base update and automatically merge:

  ```bash
  git pull -Xtheirs base update
  ```
