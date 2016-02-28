import { nestedDiff } from 'nested-diff';
import { path as getPathValue, keys, findIndex, equals, remove, is, adjust, split, pathEq, drop } from 'ramda';
import { ReplaySubject } from 'rx';

const { min } = Math;

const lhs = {
    name: 'my object',
    description: 'it\'s an object!',
    details: {
        it: 'has',
        an: 'array',
        with: ['a', 'few', 'elements']
    }
};

const rhs = {
    name: 'updated object',
    hello: 'world',
    details: {
        an: 'what',
        with: ['elements', 'a', 'few', 'more', { than: 'before' }]
    }
};

class ObserveObjectPath {
  constructor(obj = {}) {
    this.obj = obj;
    this.observingPaths = new Map();
  }

  update(newObj) {
    const differences = nestedDiff(this.obj, newObj);

    if (!differences.length) {
      return;
    }

    // pp(differences);

    const pathSubjectPairs = Array.from(this.observingPaths).map(adjust(split('.'), 0));
    handleEdit({ differences }, pathSubjectPairs);
    this.obj = newObj;
  }

  observe(path) {
    let subject = this.observingPaths.get(path);
    if (!subject) {
      subject = new ReplaySubject(1);
      this.observingPaths.set(path, subject);
    }
    return subject;
  }
}

function handleEdit({ key = null, rhs, differences }, pathSubjectPairs) {
  if (key !== null) {
    let j = 0;

    while (j < pathSubjectPairs.length) {
      const [ observingPath, subject ] = pathSubjectPairs[j];

      if (observingPath.length === 1 && observingPath[0] === key) {
        subject.onNext(rhs);
      }

      j += 1;
    }

    if (differences == null) {
      return;
    }

    pathSubjectPairs = pathSubjectPairs
      .filter( (p) => p[0].length > 1 && p[0][0] === key )
      .map(adjust(drop(1), 0));
  }

  for (const difference of differences) {
    switch (difference.kind) {
    case 'N':
      handleAddition(difference, pathSubjectPairs);
      break;
    case 'D':
      handleDeletion(difference, pathSubjectPairs);
      break;
    case 'E':
      handleEdit(difference, pathSubjectPairs);
      break;
    case 'A':
      // handleArray(difference, pathSubjectPairs);
      break;
    }
  }
}

function handleDeletion({ key }, pathSubjectPairs) {
  let j = 0;

  while (j < pathSubjectPairs.length) {
    const [ observingPath, subject ] = pathSubjectPairs[j];

    if (key === observingPath[0]) {
      subject.onNext();
    }

    j += 1;
  }
}

function handleAddition({ key, rhs }, pathSubjectPairs) {
  let j = 0;

  while (j < pathSubjectPairs.length) {
    const [ observingPath, subject ] = pathSubjectPairs[j];

    if (key === observingPath[0]) {
      if (observingPath.length > 1) {
        const val = getPathValue(observingPath.slice(1), rhs);
        if (typeof val !== 'undefined') {
          subject.onNext(val);
        }
      } else {
        subject.onNext(rhs);
      }
    }

    j += 1;
  }
}

const oop = new ObserveObjectPath();

oop.observe('name').subscribe((val) => pp({path: 'name', val}));
oop.observe('details').subscribe((val) => pp({path: 'details', val}));
oop.observe('details.it').subscribe((val) => pp({path: 'details.it', val}));
oop.observe('details.an').subscribe((val) => pp({path: 'details.an', val}));
oop.observe('details.undef').subscribe((val) => pp({path: 'details.undef', val}));
oop.observe('description').subscribe((val) => pp({path: 'description', val: val}));

console.time('A');
oop.update(lhs);
console.timeEnd('A');

console.time('B');
oop.update(rhs);
console.timeEnd('B');

function pp(obj) {
  console.log(JSON.stringify(obj, null, 4));
}
