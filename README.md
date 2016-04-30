# Observe Object Path

[![Circle CI](https://circleci.com/gh/d6u/observe-object-path/tree/master.svg?style=svg)](https://circleci.com/gh/d6u/observe-object-path/tree/master)

## Usage

```
npm install -S observe-object-path
```

```js
var ObserveObjectPath = require('observe-object-path').ObserveObjectPath;

var obj = {
  nested: {
    prop: 'propVal'
  }
};

var oop = new ObserveObjectPath(obj);

oop.on(['nested', 'prop'], (val) => console.log(val));

oop.update({
  nested: {
    prop: 'propNewVal'
  }
});

// Log 'propNewVal' after `update` is called
```

## API

### `constructor(object: any)`

### `on(path: string[], handler: (val: any) => void)`
### `addEventListener(path: string[], handler: (val: any) => void)`

### `off(path: string[], handler: (val: any) => void)`
### `removeEventListener(path: string[], handler: (val: any) => void)`

### `update(object: any)`
