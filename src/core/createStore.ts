import { SetStateAction } from "react";
import { selected, type Store } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;
  
  // Symbol 속성을 가진 객체 생성
  const storage: { [key: symbol]: any } = { [selected]: {} };

  const setStore = (nextState: SetStateAction<T>, actionName?: string, selector?: (state: T) => any) => {
    store = typeof nextState === "function" 
      ? (nextState as (prev: T) => T)(store) 
      : nextState;
    
    if (selector) {
      setSelected(selector(store));
    }
    
    callbacks.forEach((cb) => cb());
  };

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  const getStore = () => store;
  
  const getInitState = () => initState;
  
  const setSelected = (value: any) => {
    storage[selected] = value;
  };
  
  const getSelected = () => storage[selected];

  return {
    setStore,
    subscribe,
    getStore,
    getInitState,
    setSelected,
    getSelected,
  };
};