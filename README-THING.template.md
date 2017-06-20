# Ultimate THING Comparison

[![Build Status](https://travis-ci.org/example.com/ultimate-THING-comparison.svg?branch=master)](https://travis-ci.org/example.com/ultimate-THING-comparison)

This is an ultimate comparison of THINGs.

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


## Ultimate-THING-Comparison Element Specification
The code below shows a sample element.

    # THING Element - http://example.com
    Element short description ...

    ## Description
    Element long __markdown__ description ...
    
    ## Property 1
    - label 1
    - label 2
    
    ## Property 2
    - label 3
    - label 4
    - label 5
    
    ## Rating
    - [1] Bad THING
    - [3] It is ok
    - [5] Good THING


## License

The code is licensed under [MIT], the content (located at `comparison-elements`) under [CC-BY-SA-4.0].

  [MIT]: https://opensource.org/licenses/MIT
  [CC-BY-SA-4.0]: http://creativecommons.org/licenses/by-sa/4.0/

<hr />
