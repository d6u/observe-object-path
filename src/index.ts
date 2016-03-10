import { Subject, Observable } from 'rx';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

export class ObserveObjectPath {

  private observers = new Map<string, ObservingConfig<any>>();

  constructor(private obj: Object = {}) {
  }

  update(newObj: Object) {
    const oldObj = this.obj;
    this.obj = newObj;
    for (const [ , { keypath, subject } ] of this.observers) {
      const curVal = get(oldObj, keypath);
      const newVal = get(newObj, keypath);
      if (!isEqual(curVal, newVal)) {
        subject.onNext(newVal);
      }
    }
  }

  observe<T>(keypath: Keypath): Observable<T> {
    return Observable.create<T>((observer) => {
      const hash = hashKeypath(keypath);

      let config = this.observers.get(hash) as ObservingConfig<T>;

      if (!config) {
        const subject = new Subject<T>();
        config = { keypath, subject, count: 1 };
        this.observers.set(hash, config);
      } else {
        config.count += 1;
      }

      const disposable = config.subject.subscribe(observer);

      return () => {
        disposable.dispose();
        config.count -= 1;

        if (config.count === 0) {
          this.observers.delete(hash);
        }
      };
    });
  }

  get<T>(keypath: Keypath): T {
    return get(this.obj, keypath) as T;
  }

}

function hashKeypath(keypath: Keypath): string {
  let hash = '';
  for (let i = 0; i < keypath.length; i++) {
    hash += i.toString() + keypath[i].toString();
  }
  return hash;
}

export type Keypath = (string | number)[];

interface ObservingConfig<T> {
  keypath: Keypath;
  subject: Subject<T>;
  count: number;
}
