import type { Store, SetStateAction } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;
  let selected = {} as any;
  let isSelectedInit = false

  const setStore = (nextState: SetStateAction<T>, actionName?: string, selector?: (state: T) => any) => {
    store = typeof nextState === "function" 
      ? (nextState as (prev: T) => T)(store) 
      : nextState;

    // setStore 할 때만 selector를 실행
    if (selector) selected = selector(store);

    callbacks.forEach((cb) => cb());
  };

  const getSnapshot = <S>(selector: (state: T) => S) => {
    // selector가 처음 실행될 때만 selected를 초기화
    if (!isSelectedInit) {
      selected = selector(store);
      isSelectedInit = true;
    }

    if (typeof selected === "object" && Object.keys(selected).length > 0) {
      return selected;
    } else {
      return selector(store);
    }
  }

  return {
    setStore,
    getStore: (init?: 'init') => init ? initState : store,
    getSnapshot,
    subscribe: (callback: () => void) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
  };
};