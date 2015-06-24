# Bitcoin RPC commands for Meteor

Wrapper for RPC commands used for communicating with Bitcoin wallet software. This is exclusively a server side package.

```
meteor add fullhdpixel:bitcoin
```

## Requirements

1- Create a settings.json file in the root of your Meteor project.

```
meteor run --settings settings.json
```

2- In your settings.json file fill in the credentials for your RPC's:

```
{
    "local": {
        "host": "localhost",
        "port": 30000,
        "user": "fullhdpixel",
        "pass": "pass"
    },
    "production": {
        "host": "localhost",
        "port": 30000,
        "user": "fullhdpixel",
        "pass": "pass"
    }
}
```

## The following methods are supported
```javascript
Bitcoin.setAccount(address, userid);
``` 

```javascript
Bitcoin.getDeposited(account);
```

```javascript
Bitcoin.getWithdrawn(account);
```

```javascript
Bitcoin.getBalanceFromAddress(account);
```

```javascript
Bitcoin.getNewAddress(userid);
```

```javascript
Bitcoin.sendFrom(account, address, amount);
```

```javascript
Bitcoin.validateAddress(address);
```

```javascript
Bitcoin.listTransactions(account, amount)
```

## Own methods

You have to create your own methods in order to do the accounting part.

See exampleMethods.js for examples. You need the meteorhacks:async package to support the asynchronous nature of all these functions.

Then you can do the following on the client (install the simple:reactive-method package)

```javascript
Template.templateName.helpers({
    balance: function(account) {
        var account = Meteor.userId();
        var result = ReactiveMethod.call('getBalanceFromAddress', account);
        return result;
    },
    //Get the latest x transactions for all accounts
    transactions: function() {
        var transactions = ReactiveMethod.call('listTransactions', '*', 25);
        return transactions;
    }
});
```

## Deployment

Once you are ready to deploy your application, you could use Meteor Up. It has support for settings.json.

https://github.com/arunoda/meteor-up
