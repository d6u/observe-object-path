# Observe Object Path

## Usage

```js
var ObserveObjectPath = require('observe-object-path').ObserveObjectPath;

var obj = {
  name: 'world',
  nested: {
    prop: 'propVal'
  }
};

var oop = new ObserveObjectPath(obj);

oop
  .observe(['nested', 'prop'])
  .subscribe((val) => console.log(val));

oop.update({
  nested: {
    prop: 'propNewVal'
  }
});

// Should log 'propVal' at initial subscription
// Then log 'propNewVal' after `fullUpdate` is called
```
