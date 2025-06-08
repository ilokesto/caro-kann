import { Store, UseStore } from "../types";
import { useState, useEffect, useSyncExternalStore } from "react";

type MergeProps<T extends Record<string, any>> = {
  [K in keyof T]: UseStore<T[K]>
}

export const merge = <T extends Record<string, any>>(props: MergeProps<T>, getStoreForm: 'root' | 'context' = 'context'): {
    ():T;
    <S>(selector: (state: T) => S): S;
  } => {
  //@ts-ignore
  const getValueFromContext = (key: keyof T) => props[key].context._currentValue;
  const getValueFromStore = (key: keyof T) => props[key].store;

  // 병합된 store 생성
  function useMerge<S>(selector: (state: T) => S = (state: T) => state as any) {
    const { getStore, subscribe, setSelected, getSelected } = createMergeStore(props, getStoreForm === 'root' ? getValueFromStore : getValueFromContext);

    const s = selector(getStore())
    const isSelected = typeof s === 'object';

    if (isSelected) setSelected(s);

    const state = useSyncExternalStore(
      subscribe,
      isSelected ? getSelected : () => selector(getStore()),
      isSelected ? getSelected : () => selector(getStore())
    )

    return state;
  }

  return useMerge;
}

const createMergeStore = <T extends Record<string, any>>(props: MergeProps<T>, getValue: (key: keyof T) => Store<T[keyof T]>) => {
  const store = {} as T;
  const callbacks = new Set<() => void>();
  let selected = {} as any;

  const getStore = () => {
    for (const key in props) {
      const K = key as keyof T;
      store[K] = getValue(K).getStore();
    }
    return store;
  }

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    
    // 각 개별 store를 구독하고 변경 시 모든 콜백 실행
    const unsubscribers = new Set<() => void>();
    
    for (const key in props) {
      const K = key as keyof T;
      
      // 각 store의 변경사항을 감지하여 모든 콜백 실행
      const unsubscribe = getValue(K).subscribe(() => {
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

  return { getStore, subscribe,
    setSelected: (value: any) => { selected = value },
    getSelected: () => selected
  }
}

export default merge;