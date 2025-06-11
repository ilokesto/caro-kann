import { createContext, useContext, useSyncExternalStore } from "react";
import { store_props, context_props } from "../types";
import type { Store, GetStoreFrom, MergeFn, MergeProps, StoreObject, SetStateAction } from "../types";

export const merge: MergeFn = <T extends Record<string, any>, GST extends GetStoreFrom<T>>(props: MergeProps<T>, getStoreFrom?: GST)=> {
  if (Object.keys(props).length > 8) {
    throw new Error("merge function can only merge up to 8 stores at a time. Please reduce the number of stores you are trying to merge.");
  }

  const rootObject = getStoreObjectFromRoot(props);

  function useMergedStores<S>(selector: (state: T) => S = (state: T) => state as any) {
    const contextObject = useGetStoreObjectFromContext(props);
    const { getStore, subscribe, getSelected, setMergedStore } = createMergeStore(getCorrectStore(rootObject, contextObject, getStoreFrom), selector);

    const state = useSyncExternalStore(
      subscribe,
      typeof getSelected() === 'object' ? getSelected : () => selector(getStore()),
      typeof getSelected() === 'object' ? getSelected : () => selector(getStore())
    )

    return [state, setMergedStore] as const;
  }

  const dummy = {}

  useMergedStores.readOnly = <S,>(selector: (state: T) => S = (state: T) => state as any): S => useMergedStores(selector)[0];
  useMergedStores.writeOnly = () => useMergedStores(() => dummy)[1];

  return useMergedStores
}

const getCorrectStore = <T extends Record<string, any>, GST extends Partial<Record<keyof T, 'root' | 'context'>>>(rootObject: StoreObject<T>, contextObject: StoreObject<T>, getStoreFrom?: GST) => {
  if (getStoreFrom === undefined) return contextObject

  const result = { ...contextObject };

  for (const key in getStoreFrom) {
    if (getStoreFrom[key] === 'root') {
      result[key] = rootObject[key];
    } else if (getStoreFrom[key] === 'context') {
      continue;
    }
  }

  return result;
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

  const setMergedStore = (nextState: SetStateAction<T>, actionName?: string) => {
    const newState = typeof nextState === "function"
      ? (nextState as (prev: T) => T)(setStore())
      : nextState;

    for (const key in storeObject) {
      const K = key as keyof T;
      storeObject[K].setStore(newState[K], actionName);
    }
    callbacks.forEach((cb) => cb());
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
    getSelected: () => selected,
    setMergedStore
  }
}

function getStoreObjectFromRoot<T extends Record<string, any>>(props: MergeProps<T>): StoreObject<T> {
  // 일반 객체로 만든 후 최종 결과만 타입 단언
  const result: Record<string, any> = {};
  
  Object.keys(props).forEach(key => {
    result[key] = props[key][store_props];
  });
  
  return result as StoreObject<T>;
}
const undefinedContext = createContext(undefined)
function useGetStoreObjectFromContext<T extends Record<string, any>>(props: MergeProps<T>): StoreObject<T> {
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
    acc[originalKey] = contextArray[index] as Store<T[keyof T], SetStateAction<T[keyof T]>>;
    return acc
  }, {} as StoreObject<T>);
}