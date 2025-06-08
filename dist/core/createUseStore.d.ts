import { Store, StoreType, UseStore } from "../types";
export declare function createUseStore<T, K extends Array<StoreType> = []>(store: () => Store<T>): UseStore<T, K>;
