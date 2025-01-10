export type Roll<T> = { [K in keyof T]: T[K] } & {};
export type ReplacePropertyValue<T extends object, U extends { [x in keyof T]?: unknown }> = Roll<Omit<T, keyof U> & U>;