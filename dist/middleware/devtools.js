import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const devtools = (initState, name) => {
    const Store = getStoreFromInitState(initState);
    const devTools = typeof window !== "undefined" &&
        window.__REDUX_DEVTOOLS_EXTENSION__?.connect({ name });
    if (devTools) {
        devTools.init(Store.getInitState());
        devTools.subscribe((message) => {
            if (message.type === "DISPATCH") {
                switch (message.payload.type) {
                    case "RESET":
                        Store.setStore(initState instanceof Array ? initState[0].getInitState() : initState);
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
    const setStore = (nextState, actionName = "setStore") => {
        Store.setStore(nextState, actionName);
        try {
            devTools?.send(`${name}:${actionName}`, Store.getStore());
        }
        catch (error) {
            console.error("Error sending state to devtools", error);
        }
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "devtools"
    };
};
