import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";
export const logger = (initState, options = { collapsed: false, diff: false }) => {
    const Store = getStoreFromInitState(initState);
    const setStore = (nextState, actionName = "unknown") => {
        const prevState = Store.getStore();
        if (options.collapsed) {
            console.groupCollapsed(`상태 업데이트: ${actionName}`);
        }
        else {
            console.group(`상태 업데이트: ${actionName}`);
        }
        console.log("이전 상태:", prevState);
        Store.setStore(nextState);
        const newState = Store.getStore();
        console.log("다음 상태:", newState);
        if (options.diff) {
            try {
                console.log("변경사항:");
                const changes = getObjectDiff(prevState, newState);
                if ("value" in changes) {
                    console.log(`  값 변경: ${JSON.stringify(prevState)} → ${JSON.stringify(newState)}`);
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
                console.log("변경사항을 계산할 수 없습니다");
            }
        }
        console.groupEnd();
    };
    return {
        store: { ...Store, setStore },
        [storeTypeTag]: "logger"
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
