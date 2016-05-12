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

declare module 'lodash/isArray' {
  interface IsArray {
    (value: any): boolean;
  }

  const isArray: IsArray;

  export {isArray as default};
}

declare module 'lodash/mapValues' {
  interface Iteratee<A, B> {
    (value: A, index: string, collection: {[key: string]: A}): {[key: string]: B};
  }

  interface MapValues {
    <A, B>(value: { [key: string]: A }, iteratee: Iteratee<A, B>): {[key: string]: B};
  }

  const mapValues: MapValues;

  export {mapValues as default};
}
