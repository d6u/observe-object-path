import path from 'lodash/fp/path';
import equals from 'lodash/fp/equals';
import {hashKeyPath} from './helpers';
import {
  KeyPath,
  ChangeHandler,
  ListenerConfig,
} from './interfaces';

export default class ObserveObjectPath {

  private listenersMap: {[key: string]: ListenerConfig} = {};

  constructor(private obj: any) {}

  on(keyPath: KeyPath, handler: ChangeHandler) {
    const hash = hashKeyPath(keyPath);

    if (this.listenersMap[hash]) {
      this.listenersMap[hash].handlers.push(handler);
      return;
    }

    this.listenersMap[hash] = {
      keyPath: keyPath,
      handlers: [handler],
    };
  }

  addEventListener(keyPath: KeyPath, handler: ChangeHandler) {
    return this.on(keyPath, handler);
  }

  off(keyPath: KeyPath, handler?: ChangeHandler) {
    const hash = hashKeyPath(keyPath);

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

  removeEventListener(keyPath: KeyPath, handler?: ChangeHandler) {
    return this.off(keyPath, handler);
  }

  get<T>(keyPath: KeyPath): T {
    return path<T>(keyPath, this.obj);
  }

  update(newObj: Object) {
    const oldObj = this.obj;
    this.obj = newObj;
    for (const hash of Object.keys(this.listenersMap)) {
      // listenersMap[hash] was assigned to null when off
      // which will leave a key with null value to listenersMap object
      if (!this.listenersMap[hash]) {
        continue;
      }

      const {keyPath, handlers} = this.listenersMap[hash];
      const oldVal = path<any>(keyPath, oldObj);
      const newVal = path<any>(keyPath, newObj);
      if (!equals(oldVal, newVal)) {
        for (const handler of handlers) {
          handler(newVal);
        }
      }
    }
  }

}
