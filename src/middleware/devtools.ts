import { createStore } from "../core/createStore";
import { Middleware } from "../types";

export const devtools: Middleware["Devtools"] = (initState, name) => {
  type T = typeof initState;
  const Store = createStore(initState)

  const devTools =
    typeof window !== "undefined" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__?.connect({ name: "a" });

  if (devTools) {
    devTools.init(Store.getInitState());

    devTools.subscribe((message: any) => {
      if (message.type === "DISPATCH") {
        switch (message.payload.type) {
          case "RESET":
            Store.setStore(initState);
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
    });}
  
  const setStore = (nextState: T | ((prev: T) => T)) => {
    Store.setStore(nextState);
    devTools?.send(`${name}:SET_STORE`, Store.getStore());
  }

  return [{ ...Store, setStore }, "devtools" as const];
}