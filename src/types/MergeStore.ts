import { SetStateAction } from "react";
import { store_property, Store } from "./Store";

// 병합 가능한 스토어를 위한 타입 정의
type MergeableStore<T, A = SetStateAction<T>> = {
  [store_property]: Store<T, A>;
};

export type MergeableStores<T extends Record<string, unknown>> = {
  [K in keyof T]: MergeableStore<T[K]>;
};