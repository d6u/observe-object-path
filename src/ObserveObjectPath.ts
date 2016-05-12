import path from 'lodash/fp/path';
import equals from 'lodash/fp/equals';
import isArray from 'lodash/isArray';
import hash from 'object-hash';
import {getValuesForKeyPathMap} from './helpers';
import {
  KeyPath,
  KeyPathMap,
  KeyPathConfig,
  ChangeHandler,
  ListenerConfig,
} from './interfaces';

export default class ObserveObjectPath {

  private listenersMap: {[key: string]: ListenerConfig} = {};

  constructor(private obj: any) {}

  on(keyPathConfig: KeyPathConfig, handler: ChangeHandler) {
    const h = hash(keyPathConfig);

    if (this.listenersMap[h]) {
      this.listenersMap[h].handlers.push(handler);
      return;
    }

    this.listenersMap[h] = {
      keyPathConfig,
      handlers: [handler],
    };
  }

  addEventListener(keyPathConfig: KeyPathConfig, handler: ChangeHandler) {
    return this.on(keyPathConfig, handler);
  }

  off(keyPathConfig: KeyPathConfig, handler?: ChangeHandler) {
    const h = hash(keyPathConfig);

    if (!this.listenersMap[h]) {
      return;
    }

    if (!handler) {
      this.listenersMap[h] = null;
      return;
    }

    for (let i = 0; i < this.listenersMap[h].handlers.length; i += 1) {
      if (this.listenersMap[h].handlers[i] === handler) {
        this.listenersMap[h].handlers.splice(i, 1);
        if (this.listenersMap[h].handlers.length === 0) {
          this.listenersMap[h] = null;
        }
        return;
      }
    }
  }

  removeEventListener(keyPathConfig: KeyPathConfig, handler?: ChangeHandler) {
    return this.off(keyPathConfig, handler);
  }

  // TODO: accept KeyPathConfig
  get<T>(keyPath: KeyPath): T {
    return path<T>(keyPath, this.obj);
  }

  update(newObj: any) {
    const oldObj = this.obj;
    this.obj = newObj;
    for (const h of Object.keys(this.listenersMap)) {
      // listenersMap[h] was assigned to null when off
      // which will leave a key with null value to listenersMap object
      // Don't use `delete` because it make an object slow in V8
      // TODO: test the theory
      if (!this.listenersMap[h]) {
        continue;
      }

      const {keyPathConfig, handlers} = this.listenersMap[h];

      if (isArray(keyPathConfig)) {
        this.handlerKeyPathUpdate(keyPathConfig as KeyPath, handlers, oldObj, newObj);
      } else {
        this.handlerKeyPathMapUpdate(keyPathConfig as KeyPathMap, handlers, oldObj, newObj);
      }
    }
  }

  private handlerKeyPathUpdate(
    keyPath: KeyPath,
    handlers: ChangeHandler[],
    oldObj: any,
    newObj: any
  ) {
    const oldVal = path<any>(keyPath, oldObj);
    const newVal = path<any>(keyPath, newObj);
    if (!equals(oldVal, newVal)) {
      for (const handler of handlers) {
        handler(newVal);
      }
    }
  }

  private handlerKeyPathMapUpdate(
    keyPathMap: KeyPathMap,
    handlers: ChangeHandler[],
    oldObj: any,
    newObj: any
  ) {
    const oldVal = getValuesForKeyPathMap(oldObj, keyPathMap);
    const newVal = getValuesForKeyPathMap(newObj, keyPathMap);
    if (!equals(oldVal, newVal)) {
      for (const handler of handlers) {
        handler(newVal);
      }
    }
  }

}
