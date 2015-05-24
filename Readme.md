# Bitcoin RPC commands for Meteor

Wrapper for RPC commands used for communicating with Bitcoin or altcoin wallets.
```
meteor add fullhdpixel:bitcoin
```


## Requirements

1- Create a settings.json file in your Meteor project.

```
meteor run --settings settings.json
```

2- In your settings.json file fill in the following credentials for your RPC:

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

## Deployment

Once you are ready to deploy your application, you could use Meteor Up. It has support for settings.json.

https://github.com/arunoda/meteor-up

```

## The following commands are supported
```javascript
setAccount(address, userid);
``` 

```javascript
getDeposited(account);
```

```javascript
getWithdrawn(account);
```

```javascript
getBalanceFromAddress(account);
```

```javascript
getNewAddress(userid);
```

```javascript
sendFrom(account, address, amount, [token]);
```

```javascript
validateAddress(address);
```

```javascript
listTransactions(account, amount)
```


## Example with (simple:reactive-method)

```javascript
Template.templateName.helpers({
    balance: function(account) {
        var account = Meteor.userId();
        var result = ReactiveMethod.call('getBalanceFromAddress', account);
        return result;
    },
    //Get transaction for all accounts
    transactions: function() {
        var transactions = ReactiveMethod.call('listTransactions', '*', 25);
        return transactions;
    }
});
```