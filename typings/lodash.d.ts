declare module 'lodash/get' {
  export default function get<T>(object: Object, path: (string|number)[] | string): T;
}

declare module 'lodash/isEqual' {
  export default function isEqual(value: any, other: any): boolean;
}
