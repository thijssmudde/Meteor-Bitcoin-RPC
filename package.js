Package.describe({
    name: 'fullhdpixel:bitcoin',
    summary: 'Wrapper for RPC commands used for communicating with Bitcoin or Altcoin wallets',
    version: '0.0.2',
    git: 'https://fullhdpixel@bitbucket.org/fullhdpixel/bitcoin-rpc-commands.git'
});

Package.onUse(function(api) {
    // Atmosphere Package Dependencies
    api.use([
    	'meteorhacks:async@1.0.0'
    ]);

    Npm.depends({
        "node-coind": "1.0.1"
    });

    api.addFiles('packages.json');
    api.addFiles(['server/bitcoin.js'], 'server');
});
