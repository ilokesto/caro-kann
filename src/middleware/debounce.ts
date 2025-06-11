
import type { Middleware, MiddlewareStore, StoreType, SetStateAction } from "../types";
import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const debounce: Middleware["debounce"] = <T, K extends Array<StoreType>>(initState: T | MiddlewareStore<T, K>, wait = 300) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState<T, K>(initState);
  let timeout: NodeJS.Timeout | null = null;
  let updates: Array<SetStateAction<T>> = [];

  const setStore = (nextState: SetStateAction<T>, actionName?: string, selector?: (state: T) => any) => {
    // 업데이트를 큐에 추가
    updates.push(nextState);
    
    // 이미 타이머가 있으면 리셋하지 않음
    if (timeout) return;

    // 타이머 설정
    timeout = setTimeout(() => {
      // 모든 업데이트 순차 적용
      let currentState = Store.getStore();
      
      updates.forEach(update => {
        if (typeof update === 'function') {
          currentState = (update as Function)(currentState);
        } else {
          currentState = update;
        }
      });
      
      // 최종 상태로 업데이트
      Store.setStore(currentState, actionName, selector);
      
      // 리셋
      updates = [];
      timeout = null;
    }, wait);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: ["debounce", ...storeTypeTagArray]
  }
}