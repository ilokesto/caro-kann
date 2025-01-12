import { createStore } from "../core/createStore";
import { Middleware, Store } from "../types";

export const devtools: Middleware["devtools"] = <T,>(initState: T | [Store<T>, string], name: string) => {
  const Store = initState instanceof Array ? initState[0] : createStore(initState)

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
  
  const setStore = (nextState: T | ((prev: T) => T)) => {
    Store.setStore(nextState);
    try {
      devTools?.send(`${name}:SET_STORE`, Store.getStore());
    } catch (error) {
      console.error("Error sending state to devtools", error);
    }
  }

  return [{ ...Store, setStore }, "devtools" as const];
}