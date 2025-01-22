import { createStore } from "../core/createStore";
import { Middleware, MiddlewareStore, storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";

export const devtools: Middleware["devtools"] = <T,>(initState: T | MiddlewareStore<T>, name: string) => {
  const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);

  const devTools =
    typeof window !== "undefined" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__?.connect({ name });

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
  
  const setStore = (nextState: T | ((prev: T) => T), actionName: string = "setStore") => {
    // @ts-ignore
    Store.setStore(nextState, actionName);

    try {
      devTools?.send(`${name}:${actionName}`, Store.getStore());
    } catch (error) {
      console.error("Error sending state to devtools", error);
    }
  }

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: "devtools"
  }
}