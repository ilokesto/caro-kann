import { useContext, useSyncExternalStore } from "react";
export const useStore = (Board, selector) => {
    const { getBoard, setBoard, subscribe } = useContext(Board);
    const snapshot = () => selector ? selector(getBoard()) : getBoard();
    const board = useSyncExternalStore(subscribe, snapshot, snapshot);
    return [board, setBoard];
};
