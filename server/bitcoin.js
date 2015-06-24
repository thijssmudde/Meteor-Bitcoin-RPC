Bitcoin = {};

Meteor.startup(function() {
    var site = Meteor.absoluteUrl();
    var local = site.indexOf('localhost') != -1;

    var config = Meteor.settings;

    if (local && config.local) {
        var host = config.local.host;
        var port = config.local.port;
        var user = config.local.user;
        var pass = config.local.pass;
    } else if (!local && config.production) {
        var host = config.production.host;
        var port = config.production.port;
        var user = config.production.user;
        var pass = config.production.pass;
    } else {
        console.log('Fullhdpixel:bitcoin Meteor.settings cannot be accessed. Please run "meteor run --settings settings.json"');
        return;
    }

    var connection = Bitcoin.connect(host, port, user, pass);
    return Boolean(connection);
});

/** Documentation needs work but nobody gives a shit anyway.
 * @param host host
 * @param port portnumber
 * @param user username
 * @param pass password for the RPC
 * @return coin client status;
 **/
Bitcoin.connect = function(host, port, user, pass) {
    var coind = Npm.require('node-coind');
    var client = new coind.Client({
        host: config.local.host,
        port: config.local.port,
        user: config.local.user,
        pass: config.local.pass
    });
    return (client);
}

Bitcoin.setAccount = function(address, userid, callback) {
    client.cmd('setaccount', address, userid, function(error, result) {
        if (error) {
            throw new Meteor.Error(406, 'Account could not be set');
            return error;
        }
        try {
            callback(null, result);
        } catch (e) {}
    });
}

Bitcoin.getDeposited = function(account, callback) {
    client.cmd('listtransactions', account, 100000, function(error, transactions) {
        var deposited = 0;

        try {
            for (x = 0; x < transactions.length; x++) {
                if (transactions[x]['category'] == 'receive') {
                    deposited += transactions[x]['amount'];
                }
            }
        } catch (e) {}
        callback(null, deposited);
    });
}

Bitcoin.getWithdrawn = function(account, callback) {
    client.cmd('listtransactions', account, 100000, function(error, transactions) {
        var withdrawed = 0;

        try {
            for (x = 0; x < transactions.length; x++) {
                if (transactions[x]['category'] == 'send') {
                    withdrawed += transactions[x]['amount'];
                }
            }
        } catch (e) {}
        callback(null, withdrawed * -1);
    });
}

Bitcoin.getBalanceFromAddress = function(account, callback) {
    client.cmd('listtransactions', account, 100000, function(error, transactions) {
        var deposited = 0;
        var withdrawed = 0;

        try {
            for (x = 0; x < transactions.length; x++) {
                if (transactions[x]['category'] == 'receive') {
                    deposited += transactions[x]['amount'];
                } else {
                    withdrawed += transactions[x]['amount'];
                }
            }
        } catch (e) {}
        var result = deposited + withdrawed;
        callback(null, result);
    });
}

Bitcoin.getNewAddress = function(account, callback) {
    client.cmd('getnewaddress', account, function(error, address) {
        if (error) {
            throw new Meteor.Error(406, 'Account could not be set (1)');
            return error;
        }
        client.cmd('getaddressesbyaccount', account, function(error, addresses) {
            if (error) {
                throw new Meteor.Error(406, 'Account could not be set (2)');
                return error;
            } else if (addresses.indexOf(address) == -1) {
                throw new Meteor.Error(406, 'Account could not be set (3)');
                return error;
            } else {
                callback(null, address);
            }
        });
    });
}

Bitcoin.sendFrom = function(account, address, amount, callback) {
    var amount = parseFloat(amount);
    client.cmd('sendfrom', account, address, amount, function(error, result) {
        if (error) {
            callback(null, error);
        } else {
            callback(null, result);
        }
    });
}

Bitcoin.validateAddress = function(address, callback) {
    client.cmd('validateaddress', address, function(error, valid) {
        try {
            callback(null, valid.isvalid);
        } catch (e) {}
    });

}

Bitcoin.listTransactions = function(account, amount, callback) {
    client.cmd('listtransactions', account, amount, function(error, result) {
        try {
            callback(null, result);
        } catch (e) {}
    });
}
