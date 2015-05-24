# Bitcoin RPC commands for Meteor

Wrapper for RPC commands used for communicating with Bitcoin or Altcoin wallets.
```
meteor add fullhdpixel:bitcoin
```


## Requirements

In your settings.json file, which you can create by running <i>meteor run --settings settings.json</i>, fill in the following credentials for your RPC:

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
        var result = ReactiveMethod.call('getBalanceFromAddress', account);
        return result;
    },
    transactions: function() {
        var account = Meteor.userId();
        var transactions = ReactiveMethod.call('listTransactions', '*', 25);
        return transactions;
    }
});
```