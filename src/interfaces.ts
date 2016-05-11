export type KeyPath = (string | number)[];

export interface ChangeHandler {
  (val: any): void;
}

export interface ListenerConfig {
  keyPath: KeyPath;
  handlers: ChangeHandler[];
}

export interface KeyPathMap {
  [key: string]: KeyPath;
}
