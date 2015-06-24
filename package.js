Package.describe({
    name: 'fullhdpixel:bitcoin',
    summary: 'Wrapper for RPC commands used for communicating with Bitcoin or Altcoin wallets',
    version: '0.1.0',
    git: 'https://github.com/fullhdpixel/Meteor-Bitcoin-RPC'
});

Package.onUse(function(api) {
    Npm.depends({
        "node-coind": "1.0.1"
    });

    api.addFiles('exampleMethods.js');
    api.addFiles('server/bitcoin.js', 'server');
    api.export('Bitcoin', 'server');
});
