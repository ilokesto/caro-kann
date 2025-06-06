import { Middleware, MiddlewareStore, StoreType, storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const devtools: Middleware["devtools"] = <T,K extends Array<StoreType>>(initState: T | MiddlewareStore<T, K>, name: string) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);

  // 현재 환경이 production인지 확인
  const isProduction = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

  // 프로덕션 모드에서는 DevTools 연결 시도하지 않음
  const devTools = !isProduction && 
    typeof window !== "undefined" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__?.connect({ name });

  // DevTools가 존재하고(프로덕션 모드가 아니고) 초기화할 수 있는 경우에만 실행
  if (devTools) {
    devTools.init(Store.getInitState());

    devTools.subscribe((message: any) => {
      if (message.type === "DISPATCH") {
        switch (message.payload.type) {
          case "RESET":
            Store.setStore(initState instanceof Array ? initState[0].getInitState() : initState);
            devTools.init(Store.getStore());
            break;
          case "COMMIT":
            devTools.init(Store.getStore());
            break;
          case "ROLLBACK": // revert
            Store.setStore(JSON.parse(message.state));
            break;
          default:
            break;
        }
      }
    });
  }

  const setStore = (nextState: T | ((prev: T) => T), actionName?: string, selector?: (state: T) => any) => {
    Store.setStore(nextState, actionName, selector);

    // 프로덕션이 아닌 환경에서만 DevTools에 상태 전송
    if (!isProduction && devTools) {
      try {
        devTools.send(`${name}:${actionName}`, Store.getStore());
      } catch (error) {
        console.error("Error sending state to devtools", error);
      }
    }
  }

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: ["devtools", ...storeTypeTagArray]
  }
}