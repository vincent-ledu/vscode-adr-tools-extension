var gulp = require('gulp'),
  bump = require('gulp-bump'),
  git = require('gulp-git'),
  tag_version = require('gulp-tag-version'),
  run = require('gulp-run'),
  PluginError = require('plugin-error'),
  minimist = require('minimist'),
  path = require('path');

const exec = require('child_process').exec;

const releaseOptions = {
  semver: '',
  gitHubToken: '',
};

// prettier
function runPrettier(command, done) {
  exec(command, function(err, stdout) {
    if (err) {
      return done(new PluginError('runPrettier', { message: err }));
    }

    if (!stdout) {
      return done();
    }

    var files = stdout
      .split(/\r?\n/)
      .filter(f => {
        return f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.md');
      })
      .join(' ');

    if (!files) {
      return done();
    }

    const prettierPath = path.normalize('./node_modules/.bin/prettier');
    exec(
      `${prettierPath} --write --print-width 100 --single-quote --trailing-comma es5 ${files}`,
      function(err) {
        if (err) {
          return done(new PluginError('runPrettier', { message: err }));
        }
        return done();
      }
    );
  });
}

function validateArgs(done) {
  const options = minimist(process.argv.slice(2), releaseOptions);
  if (!options.semver) {
    return done(
      new PluginError('updateVersion', {
        message: 'Missing `--semver` option. Possible values: patch, minor, major',
      })
    );
  }

  const gitHubToken = options.gitHubToken || process.env.CHANGELOG_GITHUB_TOKEN;
  if (!gitHubToken) {
    return done(
      new PluginError('createChangelog', {
        message:
          'Missing GitHub API Token. Supply token using `--gitHubToken` option or `CHANGELOG_GITHUB_TOKEN` environment variable.',
      })
    );
  }

  done();
}


function createGitTag() {
  return gulp.src(['./package.json']).pipe(tag_version());
}

function createGitCommit() {
  return gulp
    .src(['./package.json', './package-lock.json', 'CHANGELOG.md'])
    .pipe(git.commit('bump version'));
}

function updateVersion(done) {
  var options = minimist(process.argv.slice(2), releaseOptions);

  return gulp
    .src(['./package.json', './package-lock.json'])
    .pipe(bump({ type: options.semver }))
    .pipe(gulp.dest('./'))
    .on('end', () => {
      done();
    });
}

gulp.task('prettier', function(done) {
  // files changed
  runPrettier('git diff --name-only HEAD', done);
});

gulp.task('forceprettier', function(done) {
  // files managed by git
  runPrettier('git ls-files', done);
});

gulp.task('commit-hash', function(done) {
  git.revParse({ args: 'HEAD', quiet: true }, function(err, hash) {
    require('fs').writeFileSync('out/version', hash);
    done();
  });
});

// test
gulp.task('test', function() {
    return run('npm test').exec();
});

gulp.task('build', gulp.series('prettier', 'commit-hash'));
gulp.task(
  'release',
  gulp.series(
    validateArgs,
    updateVersion,
    'prettier',
    createGitCommit,
    createGitTag
  )
);
gulp.task('default', gulp.series('build', 'test'));