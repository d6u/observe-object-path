declare module 'lodash/get' {
  export default function get(object: Object, path: (string|number)[] | string): any;
}

declare module 'lodash/isEqual' {
  export default function isEqual(value: any, other: any): boolean;
}
