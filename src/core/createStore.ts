import { SetStateAction } from "react";
import type { Store } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;
  
  // Symbol 속성을 가진 객체 생성
  let storage = {}

  const setStore = (nextState: SetStateAction<T>, actionName?: string, selector?: (state: T) => any) => {
    store = typeof nextState === "function" 
      ? (nextState as (prev: T) => T)(store) 
      : nextState;
    
    if (selector) {
      setSelected(selector(store));
    }
    
    callbacks.forEach((cb) => cb());
  };
  
  const setSelected = (value: any) => { storage = value };

  return {
    setStore,
    setSelected,
    subscribe: (callback: () => void) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
    getStore: (init?: 'init') => init ? initState : store,
    getSelected: () => storage,
  };
};