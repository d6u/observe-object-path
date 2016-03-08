'use strict';

const tap = require('tap');
const ObserveObjectPath = require('../lib').ObserveObjectPath;

tap.test('emit value immediately when observed', function (t) {
  t.plan(1);

  const oop = new ObserveObjectPath({ prop: 'A' });

  oop.observe(['prop']).subscribe((val) => {
    t.equal(val, 'A');
  });
});

tap.test('emit new value immediately when update', function (t) {
  t.plan(2);

  const expected = ['A', 'B'];

  const oop = new ObserveObjectPath({ prop: 'A' });

  oop.observe(['prop']).subscribe((val) => {
    t.equal(val, expected.shift());
  });

  oop.update({ prop: 'B' });
});

tap.test('not emit value if values are the same', function (t) {
  t.plan(1);

  const oop = new ObserveObjectPath({ prop: 'A' });

  oop.observe(['prop']).subscribe((val) => {
    t.equal(val, 'A');
  });

  oop.update({ prop: 'A' });
});

tap.test('invoke observe itself will not add observer', function (t) {
  t.plan(1);

  const oop = new ObserveObjectPath({ prop: 'A' });

  oop.observe(['prop']);

  t.equal(oop.observers.size, 0);
});

tap.test('subscribe to observer itself will not add observer', function (t) {
  t.plan(1);

  const oop = new ObserveObjectPath({ prop: 'A' });

  oop.observe(['prop']).subscribe();

  t.equal(oop.observers.size, 1);
});

tap.test('multiple subscription will not add more than one observer', function (t) {
  t.plan(1);

  const oop = new ObserveObjectPath({ prop: 'A' });

  const observable = oop.observe(['prop']);
  observable.subscribe();
  observable.subscribe();

  t.equal(oop.observers.size, 1);
});

tap.test('multiple subscription to the same keypath will not add more than one observer', function (t) {
  t.plan(1);

  const oop = new ObserveObjectPath({ prop: 'A' });

  oop.observe(['prop']).subscribe();
  oop.observe(['prop']).subscribe();

  t.equal(oop.observers.size, 1);
});
