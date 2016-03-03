import { ReplaySubject, Observable } from 'rx';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

class ObserveObjectPath {

  private observers = new Map<string, ObservingConfig>();

  constructor(public obj: Object = {}) { }

  update(newObj: Object) {
    for (const [ , { keypath, subject } ] of this.observers) {
      const curVal = get(this.obj, keypath);
      const newVal = get(newObj, keypath);
      if (!isEqual(curVal, newVal)) {
        subject.onNext(newVal);
      }
    }
    this.obj = newObj;
  }

  observe(keypath: Keypath): Observable<any> {
    const hash = hashKeypath(keypath);
    let config: ObservingConfig;
    if (!(config = this.observers.get(hash))) {
      const subject = new ReplaySubject<any>(1);
      subject.onNext(get(this.obj, keypath));
      config = { keypath, subject };
      this.observers.set(hash, config);
    }
    return config.subject;
  }

}

function hashKeypath(keypath: Keypath): string {
  let hash = '';
  for (let i = 0; i < keypath.length; i++) {
    hash += i.toString() + keypath[i].toString();
  }
  return hash;
}

type Keypath = (string|number)[];

interface ObservingConfig {
  keypath: Keypath;
  subject: ReplaySubject<any>;
}

export {
  ObserveObjectPath,
}
