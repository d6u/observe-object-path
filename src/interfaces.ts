export type KeyPath = (string | number)[];

export interface KeyPathMap {
  [key: string]: KeyPath;
}

export type KeyPathConfig = KeyPath | KeyPathMap;

export interface ChangeHandler {
  (val: any): void;
}

export interface ListenerConfig {
  keyPathConfig: KeyPathConfig;
  handlers: ChangeHandler[];
}
