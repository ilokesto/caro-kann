import { useContext, useSyncExternalStore } from "react";
export const useStore = (Board, selector) => {
    const { getBoard, setBoard, subscribe, getInitState } = useContext(Board);
    const snapshot = (fn) => () => selector ? selector(fn()) : fn();
    const board = useSyncExternalStore(subscribe, snapshot(getBoard), snapshot(getInitState));
    return [board, setBoard];
};
