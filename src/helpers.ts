import path from 'lodash/fp/path';
import mapValues from 'lodash/mapValues';
import {KeyPathMap, KeyPath} from './interfaces';

export function getValuesForKeyPathMap(obj: any, keyPathMap: KeyPathMap) {
  return mapValues<KeyPath, any>(keyPathMap, (keyPath) => path<any>(keyPath, obj));
}
