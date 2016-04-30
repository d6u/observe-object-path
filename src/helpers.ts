import {Keypath} from './interfaces';

export function hashKeypath(keypath: Keypath): string {
  let hash = '';
  for (let i = 0; i < keypath.length; i++) {
    hash += i.toString() + keypath[i].toString();
  }
  return hash;
}
