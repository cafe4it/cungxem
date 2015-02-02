Package.describe({
    name: 'cafe4it:youtube-v2-api',
    version: '0.0.3',
    // Brief, one-line summary of the package.
    summary: 'YouTube API v2 for Meteor',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/fvdm/nodejs-youtube',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({"youtube-feeds": "2.3.0"});

Package.onUse(function (api) {
    api.versionsFrom('1.0.3.1');
    api.addFiles('youtube-feeds.js',['server']);
    if (typeof api.export !== 'undefined') {
        api.export(['YoutubeApiV2'], ['server']);
    }
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('cafe4it:youtube-v2-api');
    api.addFiles('cafe4it:youtube-v2-api-tests.js');
});
