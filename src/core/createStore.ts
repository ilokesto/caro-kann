// import { SetStateAction } from "react";
// import { selected, type Store } from "../types";

// // export const createStore = <T>(initState: T): Store<T> => {
// //   const callbacks = new Set<() => void>();
// //   let store = initState;

// //   const setStore = (nextState: T | ((prev: T) => T)) => {
// //     store = typeof nextState === "function" ? (nextState as (prev: T) => T)(store) : nextState;

// //     callbacks.forEach((cb) => cb());
// //   };

// //   const subscribe = (callback: () => void) => {
// //     callbacks.add(callback);
// //     return () => callbacks.delete(callback);
// //   };

// //   const [selected] = {}

// //   return {
// //     setStore,
// //     subscribe,
// //     getStore: () => store,
// //     getInitState: () => initState,
// //   };
// // };

// export class CreateStore<T> {
//   constructor(private initState: T) {
//     this.store = initState;
//   }

//   private callbacks: Set<() => void> = new Set();
//   private store: T;

//   public setStore = (nextState: SetStateAction<T>, selector?: (state: T) => any) => {
//     this.store = typeof nextState === "function" ? (nextState as (prev: T) => T)(this.store) : nextState;

//     if (selector) {
//       this.setSelected(selector(this.store))
//     }

//     this.callbacks.forEach((cb) => cb());
//   };

//   public subscribe = (callback: () => void) => {
//     this.callbacks.add(callback);
//     return () => this.callbacks.delete(callback);
//   };

//   public getStore = () => this.store;

//   public getInitState = () => this.initState;

//   private [selected]: object = {};

//   public setSelected = (value: any) => {
//     this[selected] = value
//   }

//   public getSelected = () => this[selected];
// }

import { SetStateAction } from "react";
import { selected, type Store } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;
  
  // Symbol 속성을 가진 객체 생성
  const storage: { [key: symbol]: any } = { [selected]: {} };

  const setStore = (nextState: SetStateAction<T>, selector?: (state: T) => any) => {
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
    getSelected
  };
};