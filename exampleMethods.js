/*
var setaccount = Async.wrap(Bitcoin.setAccount);
var deposited = Async.wrap(Bitcoin.getDeposited);
var withdrawn = Async.wrap(Bitcoin.getWithdrawn);
var balanceaddress = Async.wrap(Bitcoin.getBalanceFromAddress);
var newaddress = Async.wrap(Bitcoin.getNewAddress);
var sendnow = Async.wrap(Bitcoin.sendFrom);
var validate = Async.wrap(Bitcoin.validateAddress);
var transactions = Async.wrap(Bitcoin.listTransactions);

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
*/
