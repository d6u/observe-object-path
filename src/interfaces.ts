export type Keypath = string[];

export type ChangeHandler = (val: any) => void;

export interface ListenerConfig {
  keypath: Keypath;
  handlers: ChangeHandler[];
}
