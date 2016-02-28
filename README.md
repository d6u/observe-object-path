# Observe Object Path

http://stackoverflow.com/questions/35688629/is-there-any-library-that-allows-me-to-subscribe-to-value-changes-of-a-nested-pa

## Usage

```js
var obj = {
  name: 'world',
  nested: {
    prop: 'propVal'
  }
};

var observableObj = new AwesomeLibrary(obj); // <- AwesomeLibrary should be this one :)

observableObj
  .observe('nested.prop')
  .subscribe((val) => console.log(val));

observableObj.fullUpdate({
  nested: {
    prop: 'propNewVal'
  }
});

// Should log 'propVal' at initial subscription
// Then log 'propNewVal' after `fullUpdate` is called
```
