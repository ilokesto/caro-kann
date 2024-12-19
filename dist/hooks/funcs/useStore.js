import { useContext, useSyncExternalStore } from "react";
import { parseObjectPath } from "./parseObjectPath";
import { updateNestedValue } from "./updateNestedValue";
export function useStore(initialState, Board, selector) {
    const { getBoard, setBoard, subscribe } = useContext(Board);
    const snapshot = () => selector ? selector(getBoard()) : getBoard();
    const serverSnapshot = () => selector ? selector(initialState) : initialState;
    const board = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
    if (selector) {
        console.log(selector.toString());
        const path = parseObjectPath(selector.toString());
        const setTargetBoard = (value) => {
            setBoard((prev) => {
                const newBoard = { ...prev };
                typeof value === "function" ? updateNestedValue(newBoard, path, value(selector(prev))) : updateNestedValue(newBoard, path, value);
                return newBoard;
            });
        };
        return [board, setTargetBoard, setBoard];
    }
    else {
        return [board, setBoard];
    }
}
