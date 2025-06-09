import { createContext } from "vm";
import { Store, store_props, context_props } from "../types";
import { Context, useContext, useSyncExternalStore } from "react";

type MergeableStore<T> = {
    [store_props]: Store<T, any>;
    [context_props]: Context<Store<T, any>>;
}

type MergeProps<T extends Record<string, any>> = {
  [K in keyof T]: MergeableStore<T[K]>
};

type StoreObject<T> = {
  [k in keyof T]: Store<T[k], any>;
}

export const merge = <T extends Record<string, any>>(props: MergeProps<T>, getStoreFrom: 'root' | 'context' = 'context'): {
    ():T;
    <S>(selector: (state: T) => S): S;
  } => {
  const storeObject = getStoreObjectFromProps(props);
  // 병합된 store 생성
  return function useMergedStores<S>(selector: (state: T) => S = (state: T) => state as any) {

  const contextObject = useGetStoreObjectFromProps(props);
    const { getStore, subscribe, getSelected } = createMergeStore(getStoreFrom === 'context' ? contextObject : storeObject, selector);

    const state = useSyncExternalStore(
      subscribe,
      typeof getSelected === 'object' ? getSelected : () => selector(getStore()),
      typeof getSelected === 'object' ? getSelected : () => selector(getStore())
    )

    return state;
  }
}

const createMergeStore = <T extends Record<string, any>>(storeObject: StoreObject<T>, selector: (state: T) => any) => {
  const callbacks = new Set<() => void>();

  const setStore = () => {
    const store = {} as T;
    for (const key in storeObject) {
      const K = key as keyof T;
      store[K] = storeObject[key].getStore();
    }
    return store;
  }

  let store = setStore();
  let selected = selector(store);

  const getStore = () => store

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    
    // 각 개별 store를 구독하고 변경 시 모든 콜백 실행
    const unsubscribers = new Set<() => void>();
    
    for (const key in storeObject) {
      const K = key as keyof T;
      
      // 각 store의 변경사항을 감지하여 모든 콜백 실행
      const unsubscribe = storeObject[K].subscribe(() => {
        store = setStore()
        selected = selector(store);

        callbacks.forEach(cb => cb());
      });
      
      unsubscribers.add(unsubscribe);
    }

    // 구독 취소 함수 반환
    return () => {
      callbacks.delete(callback);
      unsubscribers.forEach(unsubscribe => unsubscribe());
    }
  }

  return {
    getStore,
    subscribe,
    setSelected: (value: any) => { selected = value },
    getSelected: () => selected
  }
}

function getStoreObjectFromProps<T extends Record<string, any>>(props: MergeProps<T>): StoreObject<T> {
  return Object.keys(props).reduce((acc, key) => {
    const k = key as keyof T;
    acc[k] = props[key][store_props];
    return acc;
  }, {} as StoreObject<T>);
}

const undefinedContext = createContext(undefined)
function useGetStoreObjectFromProps<T extends Record<string, any>>(props: MergeProps<T>): StoreObject<T> {
  const taggedObject = Object.keys(props).reduce((acc, key, index) => {
    acc[index] = key;
    return acc;
  }, {} as Record<string, string>);

  const zero = useContext(props[taggedObject[0]]?.[context_props] ?? undefinedContext);
  const one = useContext(props[taggedObject[1]]?.[context_props] ?? undefinedContext);
  const two = useContext(props[taggedObject[2]]?.[context_props] ?? undefinedContext);
  const three = useContext(props[taggedObject[3]]?.[context_props] ?? undefinedContext);
  const four = useContext(props[taggedObject[4]]?.[context_props] ?? undefinedContext);
  const five = useContext(props[taggedObject[5]]?.[context_props] ?? undefinedContext);
  const six = useContext(props[taggedObject[6]]?.[context_props] ?? undefinedContext);
  const seven = useContext(props[taggedObject[7]]?.[context_props] ?? undefinedContext);

  const contextArray = [zero, one, two, three, four, five, six, seven].filter(context => context !== undefined);

  return contextArray.reduce((acc, key, index) => {
    const originalKey = taggedObject[index] as keyof T; 
    acc[originalKey] = contextArray[index]
    return acc
  }, {} as StoreObject<T>);
}