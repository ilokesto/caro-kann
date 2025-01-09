import { createStore } from "../core/createStore";
export const devtools = (initState, name) => {
    const Store = createStore(initState);
    const devTools = typeof window !== "undefined" &&
        window.__REDUX_DEVTOOLS_EXTENSION__?.connect({ name: "a" });
    if (devTools) {
        devTools.init(Store.getInitState());
        devTools.subscribe((message) => {
            if (message.type === "DISPATCH") {
                switch (message.payload.type) {
                    case "RESET":
                        Store.setStore(initState);
                        devTools.init(Store.getStore());
                        break;
                    case "COMMIT":
                        devTools.init(Store.getStore());
                        break;
                    case "ROLLBACK":
                        Store.setStore(JSON.parse(message.state));
                        break;
                    default:
                        break;
                }
            }
        });
    }
    const setStore = (nextState) => {
        Store.setStore(nextState);
        devTools?.send(`${name}:SET_STORE`, Store.getStore());
    };
    return [{ ...Store, setStore }, "devtools"];
};
