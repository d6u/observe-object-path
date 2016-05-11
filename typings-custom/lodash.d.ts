declare module 'lodash/fp/path' {
  interface Get {
    <T>(keyPath: (string| number)[], obj: any): T;
  }

  const get: Get;

  export {get as default};
}

declare module 'lodash/fp/equals' {
  interface IsEqual {
    (left: any, right: any): boolean;
  }

  const isEqual: IsEqual;

  export {isEqual as default};
}
