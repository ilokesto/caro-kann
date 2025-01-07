import { useContext, useSyncExternalStore } from "react";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";
export const useStoreSync = (Board) => (selector) => {
    const { getStore, setStore, subscribe, getInitState, storeTag } = useContext(Board);
    const snapshot = (fn) => () => selector ? selector(fn()) : fn();
    const board = useSyncExternalStore(subscribe, snapshot(getStore), snapshot(getInitState));
    if (["zustand", "reducer"].includes(storeTag))
        return board;
    if (selector)
        return [
            board,
            createSetTargetBoard(setStore, selector),
            setStore,
        ];
    else
        return [board, setStore];
};
