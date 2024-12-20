import { useContext, useSyncExternalStore } from "react";
export function useStore(Board, initialState, selector) {
    const { getBoard, setBoard, subscribe } = useContext(Board);
    const snapshot = () => selector ? selector(getBoard()) : getBoard();
    const board = useSyncExternalStore(subscribe, snapshot, snapshot);
    return [board, setBoard];
}
