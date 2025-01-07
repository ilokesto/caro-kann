import { useContext, useSyncExternalStore } from "react";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";
export const useStoreSync = (Board) => (selector) => {
    const { getBoard, setBoard, subscribe, getInitState } = useContext(Board);
    const snapshot = (fn) => () => selector ? selector(fn()) : fn();
    const board = useSyncExternalStore(subscribe, snapshot(getBoard), snapshot(getInitState));
    if (selector)
        return [board, createSetTargetBoard(setBoard, selector), setBoard];
    else
        return [board, setBoard];
};
