var gulp = require('gulp'),
    rename = require('gulp-rename'),
    jsontransform = require('gulp-json-transform'),
    concatjson = require('gulp-concat-json'),
    clean = require('gulp-clean'),
    run = require('run-sequence'),
    exec = require('gulp-exec'),
    bibtex2json = require('./citation/bibtex2json'),
    fs = require('fs');

var paths = {
    src: 'app',
    dev: 'www',
    json: 'comparison-elements-json/',
    data: 'app/components/comparison/data/'
};

var files = {
    data: [
        './app/components/comparison/data/*.json',
        './comparison-configuration/*',
        './citation/output/*',
        './favicon.ico'
    ],
    markdown: [
        './comparison-elements/*.md'
    ],
    json: [
        './comparison-elements-json/*.json'
    ]
}

var destfiles = {
    index: './www'
}

// BUILD / UPDATE data files -------------------------------------<
gulp.task('build-data', function (callback) {
    run('markdown', 'json', 'citation', callback);
})

gulp.task('update-data', function () {
    gulp.watch(files.markdown, ['build-data']);
})

gulp.task('markdown', function(callback){
    var options = {
      continueOnError: false,
      pipeStdout: true
    }
    return gulp.src(files.markdown)
    .pipe(exec("./gradlew -q -b ./app/java/md-to-json/build.gradle run -PappArgs=\"[$/\n<%= file.contents.toString() %>\n/$, 1, true]\"", options))
    .pipe(rename({extname: ".json"}))
    .pipe(gulp.dest(paths.json));
});

gulp.task('json', function(){
    return gulp.src(files.json)
        .pipe(concatjson("data.json"))
        .pipe(jsontransform(function(data){
            return data;
        }, 2))
        .pipe(gulp.dest(paths.data))
})

gulp.task('citation', function(callback){
    var fileContent = JSON.parse(fs.readFileSync("./citation/config.json", "utf8"));
    bibtex2json.parse('./citation/' + fileContent.bibtex_file, 'utf8', './citation/' + fileContent.bibtex_style, './citation/output', callback);
})
// --------------------------------------------------------------->


// BUILD / UPDATE www folder -------------------------------------<
gulp.task('build-www', ['data'], function () {})

gulp.task('update-www', function () {
    gulp.watch(files.data, ['data']);
})

gulp.task('data', function() {
    return gulp.src(files.data, {base: '.'})
        .pipe(gulp.dest(destfiles.index)); 
});
// --------------------------------------------------------------->

// DELETE www folder ---------------------------------------------<
gulp.task('delete-www', function() {
    return gulp.src(paths.dev, {read: false})
        .pipe(clean());
});
// --------------------------------------------------------------->

// DEFAULT and DEV tasks -----------------------------------------<
gulp.task('default', function(callback){
    run('build-data', 'delete-www', 'build-www', callback);
});

gulp.task('dev', ['default'], function(callback) {
    run('update-data','update-www', callback);
});
// --------------------------------------------------------------->