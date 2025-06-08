import { SetStateAction } from "react";
import { context, Store } from "./Store";

// 병합 가능한 스토어를 위한 타입 정의
type MergeableStore<T, A = SetStateAction<T>> = {
  [context]: React.Context<Store<T, A>>;
};

export type MergeableStores<T extends Record<string, unknown>> = {
  [K in keyof T]: MergeableStore<T[K]>;
};