# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enabling and disabling elements
- Clicking labels for filtering

### Changed
- replaced angular2-select with ng2-select

### Fixed
- Improved foreground colors when auto assigning
- Fixed problem with sorting `repo` columns [#114](https://github.com/ultimate-comparisons/ultimate-comparison-BASE/issues/114)
- Fixed problem on first load after restart
- Add expand and shrink option for table [#90](https://github.com/ultimate-comparisons/ultimate-comparison-BASE/issues/90)

## 1.0.0 - 2017-08-24
### Added
- This file
- Static VersionInformation class
- Section about difference of `update` and `master` branch in README.md
- Added force push for deployment
- Moved deployment to .travis.yml
- Added tslint
- Added unknown label for empty values
- Enabling and disabling elements

### Fixed
- Rate Limit exceeded for GitHub for up to 60 elements.
