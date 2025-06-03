import { Middleware, MiddlewareStore, StoreType, storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const logger: Middleware["logger"] = <T, K extends Array<StoreType>>(
  initState: T | MiddlewareStore<T, K>, 
  options: { 
    collapsed?: boolean, 
    diff?: boolean,
    timestamp?: boolean,
  } = { collapsed: false, diff: false, timestamp: true }
) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);
  
  // 현재 환경이 production인지 확인
  const isProduction = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
  
  const setStore = (nextState: T | ((prev: T) => T), actionName = "setState") => {
    // 프로덕션 모드에서는 로깅 없이 상태만 업데이트
    if (isProduction) {
      Store.setStore(nextState);
      return;
    }
    
    const prevState = Store.getStore();
    const time = new Date().toLocaleTimeString();
    
    // 이하 기존 로깅 코드...
    const logTitle = `State update: ${actionName}`;
    
    if (options.collapsed) {
      console.groupCollapsed(logTitle);
    } else {
      console.group(logTitle);
    }
    
    if (options.timestamp) {
      console.log("Time:", time);
    }
    
    console.log("Previous state:", prevState);
    
    Store.setStore(nextState);
    const newState = Store.getStore();
    
    console.log("Next state:", newState);
    
    if (options.diff) {
      // 기존 diff 코드 유지
      try {
        console.log("Changes:");
        const changes = getObjectDiff(prevState, newState);
        
        if ("value" in changes) {
          console.log(`  Value changed: ${JSON.stringify(prevState)} → ${JSON.stringify(newState)}`);
        } else {
          Object.keys(changes).forEach(key => {
            const prevValue = typeof prevState === 'object' && prevState !== null ? 
              (prevState as any)[key] : prevState;
            const nextValue = typeof newState === 'object' && newState !== null ? 
              (newState as any)[key] : newState;
              
            console.log(`  ${key}: ${JSON.stringify(prevValue)} → ${JSON.stringify(nextValue)}`);
          });
        }
      } catch (e) {
        console.log("Could not calculate changes");
      }
    }
    
    console.groupEnd();
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: ["logger", ...storeTypeTagArray]
  }
};

// 모든 타입의 값 차이점을 계산하는 함수
function getObjectDiff(prev: unknown, next: unknown) {
  const changes: Record<string, boolean> = {};
  
  // 원시값인 경우
  if (typeof prev !== 'object' || prev === null || typeof next !== 'object' || next === null) {
    if (prev !== next) {
      changes["value"] = true;  // 원시값이 변경되었음을 표시
    }
    return changes;
  }
  
  // 객체인 경우 속성별로 비교
  const allKeys = new Set([...Object.keys(prev as object), ...Object.keys(next as object)]);
  
  allKeys.forEach(key => {
    try {
      const prevValue = (prev as Record<string, unknown>)[key];
      const nextValue = (next as Record<string, unknown>)[key];
      
      if (JSON.stringify(prevValue) !== JSON.stringify(nextValue)) {
        changes[key] = true;
      }
    } catch (e) {
      changes[key] = true; // JSON 직렬화 오류 시 변경된 것으로 간주
    }
  });
  
  return changes;
}