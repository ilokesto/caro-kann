import type { Store, Context, Dispatch, SetStateAction } from "../types";
import { context_props, store_props } from "../types"

type MergeableStore<T> = {
    [store_props]: Store<T, SetStateAction<T>>;
    [context_props]: Context<Store<T, SetStateAction<T>>>;
}

export type MergeProps<T extends Record<string, any>> = {
  [K in keyof T]: MergeableStore<T[K]>
};

export type StoreObject<T> = {
  [k in keyof T]: Store<T[k], SetStateAction<T[k]>>;
}

export type GetStoreFrom<T extends Record<string, any>> = Partial<Record<keyof T, 'root' | 'context'>>;

export type MergeFn = <T extends Record<string, any>, GST extends GetStoreFrom<T>>(props: MergeProps<T>, getStoreFrom?: GST) => {
    (): readonly [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<SetStateAction<T>>];
    readOnly: {
      (): T;
      <S>(selector?: (state: T) => S): S
    };
    writeOnly(): Dispatch<SetStateAction<T>>;
  }