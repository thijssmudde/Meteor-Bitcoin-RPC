Meteor.startup(function() {
    coind = Npm.require('node-coind');
    
    var site = Meteor.absoluteUrl();
    var local = site.indexOf('localhost') != -1;

    if (local) {
        var localConfig = Meteor.settings.local;
        client = new coind.Client({
            host: localConfig.host,
            port: localConfig.port,
            user: localConfig.user,
            pass: localConfig.pass
        });
    } else {
        var productionConfig = Meteor.settings.production;
        client = new coind.Client({
            host: productionConfig.host,
            port: productionConfig.port,
            user: productionConfig.user,
            pass: productionConfig.pass
        });
    }
});

var setaccount = Async.wrap(setAccount);
var deposited = Async.wrap(getDeposited);
var withdrawn = Async.wrap(getWithdrawn);
var balanceaddress = Async.wrap(getBalanceFromAddress);
var newaddress = Async.wrap(getNewAddress);
var sendnow = Async.wrap(sendFrom);
var validate = Async.wrap(validateAddress);
var transactions = Async.wrap(listTransactions);

Meteor.methods({
    'setAccount': function(address, userid) {
        return setaccount(address, userid);
    },
    'getDeposited': function(account) {
        return deposited(account);
    },
    'getWithdrawn': function(account) {
        return withdrawn(account);
    },
    'getBalanceFromAddress': function(account) {
        return balanceaddress(account);
    },
    'getNewAddress': function(userid) {
        var address = newaddress(userid);

        Meteor.users.update({
            _id: userid
        }, {
            $set: {
                publickey: address
            }
        });

        return address;
    },
    'sendFrom': function(account, address, amount, token) {
        var getuser = Meteor.users.findOne({
            _id: account
        });
        try {
            if (getuser.hasOwnProperty(auth)) {
                var authtoken = getuser.auth;
            }
        } catch (e) {
            authtoken = '';
        }

        if (authtoken && authtoken !== '') {

            if (!verifyOtp(authtoken, key)) {
                throw new Meteor.Error(406, 'Security code is invalid');
            }
        } else {
            var user = Meteor.user();
            var result = Accounts._checkPassword(user, token);
            if (result.error) {
                throw new Meteor.Error(406, result.error.reason);
            }
        }
        var balance = balanceaddress(account);

        if (amount > balance) {
            throw new Meteor.Error(406, 'Balance is not sufficient');
        }

        return sendnow(account, address, amount);
    },
    'validateAddress': function(address) {
        return validate(address);
    },
    'listTransactions': function(account, amount) {
        return transactions(account, amount);
    }
});

function setAccount(address, userid, callback) {
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

function getDeposited(account, callback) {
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

function getWithdrawn(account, callback) {
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

function getBalanceFromAddress(account, callback) {
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

function getNewAddress(account, callback) {
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

function sendFrom(account, address, amount, callback) {
    var amount = parseFloat(amount);
    client.cmd('sendfrom', account, address, amount, function(error, result) {
        if (error) {
            callback(null, error);
        } else {
            callback(null, result);
        }
    });
}

function validateAddress(address, callback) {
    client.cmd('validateaddress', address, function(error, valid) {
        try {
            callback(null, valid.isvalid);
        } catch (e) {}
    });
}

function listTransactions(account, amount, callback) {
    client.cmd('listtransactions', account, amount, function(error, result) {
        try {
            callback(null, result);
        } catch (e) {}
    });
}
