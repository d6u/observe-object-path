import {path, equals} from 'ramda';
import {Keypath, ChangeHandler, ListenerConfig} from './interfaces';

function hashKeypath(keypath: Keypath): string {
  let hash = '';
  for (let i = 0; i < keypath.length; i++) {
    hash += i.toString() + keypath[i].toString();
  }
  return hash;
}

export default class ObserveObjectPath {

  private listenersMap: {[key: string]: ListenerConfig} = {};

  constructor(private obj: any) {}

  on(keypath: Keypath, handler: ChangeHandler) {
    const hash = hashKeypath(keypath);

    if (this.listenersMap[hash]) {
      this.listenersMap[hash].handlers.push(handler);
      return;
    }

    this.listenersMap[hash] = {
      keypath: keypath,
      handlers: [handler],
    };
  }

  addEventListener(keypath: Keypath, handler: ChangeHandler) {
    return this.on(keypath, handler);
  }

  off(keypath: Keypath, handler?: ChangeHandler) {
    const hash = hashKeypath(keypath);

    if (!this.listenersMap[hash]) {
      return;
    }

    if (!handler) {
      this.listenersMap[hash] = null;
      return;
    }

    for (let i = 0; i < this.listenersMap[hash].handlers.length; i += 1) {
      if (this.listenersMap[hash].handlers[i] === handler) {
        this.listenersMap[hash].handlers.splice(i, 1);
        if (this.listenersMap[hash].handlers.length === 0) {
          this.listenersMap[hash] = null;
        }
        return;
      }
    }
  }

  removeEventListener(keypath: Keypath, handler?: ChangeHandler) {
    return this.off(keypath, handler);
  }

  get<T>(keypath: Keypath): T {
    return path<T>(keypath, this.obj);
  }

  // update(newObj: Object) {
  //   const oldObj = this.obj;
  //   this.obj = newObj;
  //   for (const [ , { keypath, subject } ] of this.observers) {
  //     const curVal = get(oldObj, keypath);
  //     const newVal = get(newObj, keypath);
  //     if (!isEqual(curVal, newVal)) {
  //       subject.onNext(newVal);
  //     }
  //   }
  // }

}
