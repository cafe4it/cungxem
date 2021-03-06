Package.describe({
	summary: "Automatically add visitor as anonymous guest with userId",
	version: "0.1.3",
	name: "nxcong:accounts-guest",
	git: "https://github.com/cafe4it/meteor-accounts-guest.git"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@0.9.0");
	api.use(['accounts-base', 'accounts-password','deps', 'blaze@2.0.4'], 'client');
	api.use(['accounts-base'], 'server');
	api.add_files('accounts-guest.js', ['client','server']);
	api.export('AccountsGuest');
	api.add_files('accounts-guest-server.js', 'server');
	api.add_files('accounts-guest-client.js', 'client');

});

Package.onTest(function (api) {
	api.versionsFrom("METEOR@0.9.0");
	api.use(['accounts-base', 'accounts-password', 'tinytest','deps'], ['client','server']);
	api.add_files('accounts-guest.js', ['client','server']);
	api.add_files('accounts-guest-server.js', 'server');
	api.add_files('accounts-guest-client.js', 'client');
	api.add_files('accounts-guest-server-tests.js', 'server');
	api.add_files('accounts-guest-client-tests.js', 'client');
});
