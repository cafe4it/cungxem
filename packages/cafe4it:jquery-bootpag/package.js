Package.describe({
  name: 'cafe4it:jquery-bootpag',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'This jQuery plugin helps you create dynamic pagination with Bootstrap or in any other html pages.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/botmonster/jquery-bootpag',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.addFiles('lib/jquery.bootpag.min.js','client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cafe4it:jquery-bootpag');
  api.addFiles('cafe4it:jquery-bootpag-tests.js');
});
