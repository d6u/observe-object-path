'use strict';

const tap = require('tap');
const ObserveObjectPath = require('../es5').ObserveObjectPath;

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
