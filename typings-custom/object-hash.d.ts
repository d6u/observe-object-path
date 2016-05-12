declare module 'object-hash' {
  interface Hash {
    (value: any): string;
  }

  const hash: Hash;

  export {hash as default};
}
