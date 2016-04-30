'use strict';

const test = require('tape');
const ObserveObjectPath = require('../lib').ObserveObjectPath;

test('on() emit new value immediately when update', (t) => {
  t.plan(1);

  const oop = new ObserveObjectPath({prop: 'A'});

  oop.on(['prop'], (val) => {
    t.equal(val, 'B');
  });

  oop.update({prop: 'B'});
});

test('on() not emit value if values are the same', (t) => {
  const oop = new ObserveObjectPath({prop: 'A'});

  oop.on(['prop'], (val) => {
    t.fail('should not reach here');
  });

  oop.update({prop: 'A'});

  t.end();
});

test('on() use deep equals to compare equality', (t) => {
  const oop = new ObserveObjectPath({prop: {name: {first: 'A'}}});

  oop.on(['prop'], (val) => {
    t.fail('should not reach here');
  });

  oop.update({prop: {name: {first: 'A'}}});

  t.end();
});

test('on() multiple handlers', (t) => {
  t.plan(3);

  const oop = new ObserveObjectPath({prop: 'A'});

  oop.on(['prop'], (val) => {
    t.equal(val, 'B');
  });

  oop.on(['prop'], (val) => {
    t.equal(val, 'B');
  });

  oop.on(['prop'], (val) => {
    t.equal(val, 'B');
  });

  oop.update({prop: 'B'});
});

test('off() remove handlers', (t) => {
  t.plan(2);

  const oop = new ObserveObjectPath({prop: 'A'});

  const handlerA = (val) => {
    t.fail('should not reach here');
  };

  oop.on(['prop'], handlerA);

  oop.on(['prop'], (val) => {
    t.equal(val, 'B');
  });

  oop.on(['prop'], (val) => {
    t.equal(val, 'B');
  });

  oop.off(['prop'], handlerA);

  oop.update({prop: 'B'});
});

test('get() gets target value', (t) => {
  t.plan(1);

  const oop = new ObserveObjectPath({prop: 'A'});

  t.equal(oop.get(['prop']), 'A');
});
