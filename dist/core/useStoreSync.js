import { useContext, useSyncExternalStore } from "react";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";
export const useStoreSync = ({ Store, storeTag }) => (selector) => {
    const { getStore, setStore, subscribe, getInitState } = useContext(Store);
    const snapshot = (fn) => () => selector ? selector(fn()) : fn();
    const board = useSyncExternalStore(subscribe, snapshot(getStore), snapshot(getInitState));
    if (storeTag === "reducer")
        return [board, setStore];
    if (selector)
        return [
            board,
            createSetTargetBoard(setStore, selector),
            setStore,
        ];
    else
        return [board, setStore];
};
