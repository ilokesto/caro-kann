import { Dispatch, SetStateAction, useSyncExternalStore } from "react";
import { Store } from "../types";
import { createUseStore } from "../core/createUseStore";

// 병합 가능한 스토어를 위한 타입 정의
type MergeableStore<T> = {
  ContextStore: React.Context<Store<T>>;
  store: Store<T>;
};

type MergeableStores<T extends Record<string, unknown>> = {
  [K in keyof T]: MergeableStore<T[K]>;
};

/**
 * 병합된 스토어를 생성하는 함수
 */
function createMergedStore<T extends Record<string, unknown>>(
  stores: MergeableStores<T>, 
  subscribers: Set<() => void>,
  selected: any
): Store<T> {
  const mergedStore: Store<T> = {
    getStore: () => {
      // 모든 개별 스토어의 상태를 하나의 객체로 병합
      const state: Partial<T> = {};
      for (const key in stores) {
        state[key] = stores[key].store.getStore();
      }
      return state as T;
    },
    
    setStore: (action: SetStateAction<T>, actionName?: string, selector?: (state: T) => any) => {
      const prevState = mergedStore.getStore();
      const nextState = typeof action === 'function'
        ? (action as (prev: T) => T)(prevState)
        : action;

      // 변경된 부분만 각 개별 스토어에 반영
      for (const key in stores) {
        if (key in nextState && nextState[key] !== prevState[key]) {
          stores[key].store.setStore(nextState[key], actionName);
        }
      }
      
      if (selector) selected = selector(nextState);

      subscribers.forEach(callback => callback());
    },
    
    subscribe: (callback: () => void) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    
    getSelected: () => selected,
    setSelected: (value: any) => { selected = value },
  };

  return mergedStore;
}

export const merge = <T extends Record<string, unknown>>(stores: MergeableStores<T>): {
    (): readonly [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<SetStateAction<T>>];
} => {
  // 구독자 관리를 위한 Set
  const subscribers = new Set<() => void>();
  let selected = {};
  
  // 각 개별 스토어에 대한 구독 설정
  const unsubscribes: Array<() => void> = [];
  for (const key in stores) {
    const unsubscribe = stores[key].store.subscribe(() => {
      // 개별 스토어가 변경되면 병합된 스토어의 구독자들에게 알림
      subscribers.forEach(callback => callback());
    });
    unsubscribes.push(unsubscribe);
  }
  
  // 병합된 스토어 생성
  const mergedStore = createMergedStore(stores, subscribers, selected);

  const useStore = createUseStore<T>(() => mergedStore)
  
  return useStore;
};