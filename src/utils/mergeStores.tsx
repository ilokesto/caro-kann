import { Dispatch, SetStateAction, useSyncExternalStore } from "react";
import { Store } from "../types";

// 병합 가능한 스토어를 위한 타입 정의
type MergeableStore<T, A = SetStateAction<T>> = {
  context: React.Context<Store<T, A>>;
};

type MergeableStores<T extends Record<string, unknown>> = {
  [K in keyof T]: MergeableStore<T[K]>;
};
const createMergeStore = <T extends Record<string, unknown>>(stores: MergeableStores<T>): Store<T> => {
  const subscribers = new Set<() => void>();
  let selected = {};
  let state = {} as T;

  // 현재 컨텍스트의 기본값에서 스토어 객체 접근
  const getStoreFromContext = <K extends keyof T>(key: K) => {
    // context._currentValue에 접근하는 것은 권장되지 않지만
    // 다른 방법이 없을 경우 사용할 수 있음
    // 실제 구현에서는 컨텍스트의 현재 값을 안전하게 가져올 수 있는 방법 필요
    // @ts-ignore
    return stores[key].context._currentValue as Store<T[K]>;
  };

  // 병합된 스토어 생성
  const mergedStore: Store<T> = {
    getStore: (mode?: 'init') => {
      // 모든 개별 스토어의 상태를 하나의 객체로 병합
      for (const key in stores) {
        const storeFromContext = getStoreFromContext(key);
        state[key] = storeFromContext.getStore(mode);
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
          const storeFromContext = getStoreFromContext(key);
          // 개별 스토어의 타입에 맞게 상태 업데이트
          storeFromContext.setStore(() => nextState[key], actionName);
        }
      }

      if (selector) selected = selector(nextState);

      subscribers.forEach(callback => callback());
    },

    subscribe: (callback: () => void) => {
      subscribers.add(callback);
      
      // 모든 개별 스토어 구독
      const unsubscribes = Object.keys(stores).map(key => {
        const storeFromContext = getStoreFromContext(key as keyof T);
        return storeFromContext.subscribe(() => {
          // 개별 스토어 변경 시 병합된 스토어도 업데이트
          state[key as keyof T] = storeFromContext.getStore();
          callback();
        });
      });
      
      // 구독 해제 함수 반환
      return () => {
        subscribers.delete(callback);
        unsubscribes.forEach(unsubscribe => unsubscribe());
      };
    },

    getSelected: () => selected,
    setSelected: (value: any) => { selected = value },
  };

  return mergedStore;
};

export const merge = <T extends Record<string, unknown>>(stores: MergeableStores<T>): {
    (): readonly [T, Dispatch<SetStateAction<T>>];
    <S>(selector: (state: T) => S): readonly [S, Dispatch<SetStateAction<T>>];
} => {

  function useStore<S>(selector: (state: T) => S = (state: T) => state as any) {
    const { getStore, setStore, subscribe, getSelected, setSelected } = createMergeStore(stores);

    const s = selector(getStore())
    const isSelected = typeof s === 'object';

    if (isSelected) setSelected(s);

    const board = useSyncExternalStore(
      subscribe,
      isSelected ? getSelected : () => selector(getStore()),
      isSelected ? getSelected : () => selector(getStore('init'))
    );

    return [
      board,
      isSelected
        ? (nextState: SetStateAction<T>) => {
          setStore(nextState, "setStoreAction", selector)
        }
        : setStore
    ] as const;
  };
  
  return useStore;
};
