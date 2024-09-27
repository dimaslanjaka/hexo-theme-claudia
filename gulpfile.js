const gulp = require('gulp');
const sass = require('sass'); // Official Dart SASS package
const through2 = require('through2'); // Stream utility
const path = require('path');
const fs = require('fs');

// Custom function to compile SASS using through2
function compileSass() {
  const includePaths = [
    path.join(__dirname, 'node_modules'),
    path.join(__dirname, '../node_modules'),
    path.join(__dirname, '../../node_modules'),
    path.join(__dirname, '../../../node_modules')
  ].filter(fs.existsSync);
  return through2.obj(function (file, _, cb) {
    if (file.isBuffer()) {
      try {
        // Compile SASS file
        const result = sass.compile(file.path, { style: 'expanded', includePaths });

        // Update file contents with the compiled CSS
        file.contents = Buffer.from(result.css);
        file.path = file.path.replace(path.extname(file.path), '.css'); // Change extension to .css
      } catch (err) {
        return cb(new Error(`SASS compilation failed: ${err.message}`));
      }
    }
    cb(null, file); // Pass the file along the stream
  });
}

function buildStyles() {
  return gulp
    .src('./src/sass/**/*.scss')
    .pipe(compileSass()) // Custom compilation function
    .pipe(gulp.dest('./source/style'));
}

gulp.task('build', gulp.series(buildStyles));
gulp.task('default', gulp.series('build'));
