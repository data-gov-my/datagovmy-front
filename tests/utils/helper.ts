/**
 * Common assertion patterns
 */
export const PATTERN = {
  I18N_FAILURE: /[a-z0-9]\.[a-z0-9]/,
} as const;

// function generateEnum<T extends string>(strings: T[]): { [K in T as Uppercase<K>]: K } {
//   const enumObject = {} as { [K in T as Uppercase<K>]: K };
//   for (const str of strings) {
//     enumObject[str.toUpperCase()] = str;
//   }
//   return enumObject;
// }
