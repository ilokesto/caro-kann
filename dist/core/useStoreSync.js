import { useContext, useSyncExternalStore } from "react";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";
export const useStoreSync = ({ Store, storeTag }) => (selector) => {
    const { getStore, setStore, subscribe, getInitState } = useContext(Store);
    const snapshot = (fn) => () => selector ? selector(fn()) : fn();
    const board = useSyncExternalStore(subscribe, snapshot(getStore), snapshot(getInitState));
    switch (storeTag) {
        case "reducer":
            return [board, setStore];
        case "zustand":
            return board;
        default:
            if (selector)
                return [
                    board,
                    // 일반적인 상황에서 중첩된 객체를 효율적으로 처리
                    createSetTargetBoard(setStore, selector),
                    setStore,
                ];
            else
                return [board, setStore];
    }
};
