import { useContext, useSyncExternalStore } from "react";
export const useStore = (Board, initialState, selector) => {
    const { getBoard, setBoard, subscribe } = useContext(Board);
    const snapshot = () => selector ? selector(getBoard()) : getBoard();
    const serverSnapshot = () => selector ? selector(initialState) : initialState;
    const board = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
    return [board, setBoard];
};
