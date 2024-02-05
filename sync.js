const browserSync = require('browser-sync');
browserSync.init({
  proxy: 'localhost:1234', // The default port of Parcel 2
  files: ['dist/**/*.css'], // The files to watch for changes and inject
  injectChanges: true, // Enable CSS injection
});
