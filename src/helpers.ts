import {KeyPath} from './interfaces';

export function hashKeyPath(keyPath: KeyPath): string {
  let hash = '';
  for (let i = 0; i < keyPath.length; i++) {
    hash += i.toString() + keyPath[i].toString();
  }
  return hash;
}
