import type { Options, Store } from "../types";
export declare function persist<T>(initState: T, options: Options<T>): [Store<T>, "persist"];
