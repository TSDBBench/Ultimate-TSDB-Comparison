# Ultimate Comparison BASE

[![Build Status](https://travis-ci.org/ultimate-comparisons/ultimate-comparison-BASE.svg?branch=master)](https://travis-ci.org/ultimate-comparisons/ultimate-comparison-BASE)

This is an ultimate comparison framework written in angular2.

## Create your own ultimate comparison 
1. Create a new repository on GitHub. In the following called "ultimate-THING-comparison" and located at https://github.com/example.com/ultimate-THING-comparison, replace `THING` by your comparison (e.g., `web-framework`).
2. Create local repository (in a git bash, Windows shell does not work)

        mkdir ultimate-THING-comparison
        cd ultimate-THING-comparison
        git init
        git fetch --depth=1 -n https://github.com/ultimate-comparisons/ultimate-comparison-BASE.git
        git reset --hard $(git commit-tree FETCH_HEAD^{tree} -m "initial commit")

3. Create push to your GitHub repository
        
        git remote add origin git@github.com:example.com/ultimate-THING-comparison.git
        git push -u origin master
        
### Setup comparison
1. The file `comparison-configuration/comparison.json` defines the main properties of the comparison and the details dialog.
  
  ![comparison.json](https://cdn.rawgit.com/ultimate-comparisons/ultimate-comparison-BASE/master/media/comparison.svg)
  
  In the details dialog the values of the keys `header-label`, `body`, and `body-attachment-tags` matches level 2 headers in the comparison-elements files. The type of the `body-attachment-tags` must be labels and `body` will be parsed as markdown formated text. 
2. The file `comparison-configuration/table.json` defines the table columns. 
  - `tag:` References a level 2 header of the comparison elements (`Performance`, `Description`, `License`, `Showcase`) or the level 1 header and its content (`tag`, `url`, `descr`).
  - `display:` Allows the user to hide a colum by default. It is possible to dynamically hide or display column by clicking on the configuration button and toggle the columns on/off.
  - `name:` Allows the user to change the display name (default display name is defined by `tag`).
  - `type:` Style of the content. 
  - `type.tag:` Either a label, a text, or a url. 
  - `type.class:` Set a label class (e. g. `label label-info`). Will be ignored if value class is set.
  - `type.values:`
  ```json
  {
    "name": "slow",
    "description": "Overall performance above 200ms",
    "class": "label-danger",
    "color": "red"
  }
  ```
  - The label with the value "slow" has the tooltip "overall performance above 200ms", and will be red ("label-danger")
  - You can choose between red and class, classes are the preferred way. If both are missing, an automatic color is assigned.

  ![table.json](https://cdn.rawgit.com/ultimate-comparisons/ultimate-comparison-BASE/master/media/table.svg) 
3. The file `comparison-configuration/criteria.json` defines filter criterias for the table data.
  - `tag:` References a level 2 header of the comparison elements (`Performance`, `Description`, `License`, `Showcase`)
  - `name:` Display name (replaces `tag`).
  - `placeholder:` Placeholder for the select box.
  - `values:` Filter values.
  - `and_search:` Defines if all filter value must match or at least one.
  
  ![criteria.json](https://cdn.rawgit.com/ultimate-comparisons/ultimate-comparison-BASE/master/media/criteria.svg)       
        

### Define comparison elements
For each thing, create a markdown file in `comparison-elements`.
You can base it on `template.md`.

## Test it
1. Install [node.js](https://nodejs.org/en/)
2. Intall [Java JDK8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
3. Install [pandoc](http://pandoc.org/installing.html) (Version 1.17.2) [pandoc-citeproc](https://hackage.haskell.org/package/pandoc-citeproc)
        
        wget https://github.com/jgm/pandoc/releases/download/1.17.2/pandoc-1.17.2-1-amd64.deb
        sudo dpkg -i pandoc-1.17.2-1-amd64.deb
        
4. Update npm (sudo): `npm install -g npm`
5. Test dependencies:

        java -version
        npm -version

6. `npm install`
7. `npm start` (starts the web page)
8. [Setup automatic deployment of `www` directory using Travis CI](https://github.com/ultimate-comparisons/ultimate-comparison-BASE/wiki/Build-and-deploy-project-with-Travis-CI)

## License

The code is licensed under [MIT], the content (located at `comparison-elements`) under [CC0-1.0].

  [CC0-1.0]: https://creativecommons.org/publicdomain/zero/1.0/

<hr />

See [README-THING.template](https://github.com/ultimate-comparisons/ultimate-comparison-BASE/blob/master/README-THING.template.md) for a README skeletton for your ultimate-THING-comparison.

  [MIT]: https://opensource.org/licenses/MIT
  [CC-BY-SA-4.0]: http://creativecommons.org/licenses/by-sa/4.0/
