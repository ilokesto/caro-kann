import { Middleware, MiddlewareStore, storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const logger: Middleware["logger"] = <T>(
  initState: T | MiddlewareStore<T>, 
  options: { collapsed?: boolean, diff?: boolean } = { collapsed: false, diff: false }
) => {
  const Store = getStoreFromInitState(initState);
  
  const setStore = (nextState: T | ((prev: T) => T), actionName = "unknown") => {
    const prevState = Store.getStore();
    
    // collapsed 옵션에 따라 그룹 로그 방식 선택
    if (options.collapsed) {
      console.groupCollapsed(`상태 업데이트: ${actionName}`);
    } else {
      console.group(`상태 업데이트: ${actionName}`);
    }
    
    console.log("이전 상태:", prevState);
    
    // 상태 업데이트
    Store.setStore(nextState);
    const newState = Store.getStore();
    
    console.log("다음 상태:", newState);
    
    // diff 옵션이 true인 경우 차이점 표시
    if (options.diff) {
      try {
        console.log("변경사항:");
        const changes = getObjectDiff(prevState, newState);
        
        if ("value" in changes) {
          // 원시값이 변경된 경우
          console.log(`  값 변경: ${JSON.stringify(prevState)} → ${JSON.stringify(newState)}`);
        } else {
          // 객체의 속성이 변경된 경우
          Object.keys(changes).forEach(key => {
            const prevValue = typeof prevState === 'object' && prevState !== null ? 
              (prevState as any)[key] : prevState;
            const nextValue = typeof newState === 'object' && newState !== null ? 
              (newState as any)[key] : newState;
              
            console.log(`  ${key}: ${JSON.stringify(prevValue)} → ${JSON.stringify(nextValue)}`);
          });
        }
      } catch (e) {
        console.log("변경사항을 계산할 수 없습니다");
      }
    }
    
    console.groupEnd();
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: "logger"
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