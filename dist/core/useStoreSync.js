import { useContext, useSyncExternalStore } from "react";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";
export const useStoreSync = ({ Store, storeTag }) => (selector) => {
    const { getStore, setStore, subscribe, getInitState } = useContext(Store);
    const snapshot = (fn) => () => selector ? selector(fn()) : fn();
    const board = useSyncExternalStore(subscribe, snapshot(getStore), snapshot(getInitState));
    if (storeTag === "zustand")
        return board;
    if (selector && storeTag !== "reducer")
        return [
            board,
            createSetTargetBoard(setStore, selector),
            setStore,
        ];
    else
        return [board, setStore];
};
