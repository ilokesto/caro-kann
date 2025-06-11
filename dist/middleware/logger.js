import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const logger = (initState, options = { collapsed: false, diff: false, timestamp: true }) => {
    const { store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);
    const isProduction = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
    const setStore = (nextState, actionName) => {
        if (isProduction) {
            Store.setStore(nextState, actionName);
            return;
        }
        const prevState = Store.getStore();
        const time = new Date().toLocaleTimeString();
        const logTitle = `State update: ${actionName}`;
        if (options.collapsed) {
            console.groupCollapsed(logTitle);
        }
        else {
            console.group(logTitle);
        }
        if (options.timestamp) {
            console.log("Time:", time);
        }
        console.log("Previous state:", prevState);
        Store.setStore(nextState, actionName);
        const newState = Store.getStore();
        console.log("Next state:", newState);
        if (options.diff) {
            try {
                console.log("Changes:");
                const changes = getObjectDiff(prevState, newState);
                if ("value" in changes) {
                    console.log(`  Value changed: ${JSON.stringify(prevState)} → ${JSON.stringify(newState)}`);
                }
                else {
                    Object.keys(changes).forEach(key => {
                        const prevValue = typeof prevState === 'object' && prevState !== null ?
                            prevState[key] : prevState;
                        const nextValue = typeof newState === 'object' && newState !== null ?
                            newState[key] : newState;
                        console.log(`  ${key}: ${JSON.stringify(prevValue)} → ${JSON.stringify(nextValue)}`);
                    });
                }
            }
            catch (e) {
                console.log("Could not calculate changes");
            }
        }
        console.groupEnd();
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: ["logger", ...storeTypeTagArray]
    };
};
function getObjectDiff(prev, next) {
    const changes = {};
    if (typeof prev !== 'object' || prev === null || typeof next !== 'object' || next === null) {
        if (prev !== next) {
            changes["value"] = true;
        }
        return changes;
    }
    const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
    allKeys.forEach(key => {
        try {
            const prevValue = prev[key];
            const nextValue = next[key];
            if (JSON.stringify(prevValue) !== JSON.stringify(nextValue)) {
                changes[key] = true;
            }
        }
        catch (e) {
            changes[key] = true;
        }
    });
    return changes;
}
