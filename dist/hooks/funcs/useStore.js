import { useContext, useSyncExternalStore } from "react";
const updateNestedValue = (obj, path, value) => {
    if (path.length === 1) {
        obj[path[0]] = value;
    }
    else {
        if (!obj[path[0]])
            obj[path[0]] = {};
        updateNestedValue(obj[path[0]], path.slice(1), value);
    }
};
export function useStore(initialState, Board, selector) {
    const { getBoard, setBoard, subscribe } = useContext(Board);
    const snapshot = () => selector ? selector(getBoard()) : getBoard();
    const serverSnapshot = () => selector ? selector(initialState) : initialState;
    const board = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
    if (selector) {
        if (/[?&:|\[\]]/.test(selector.toString()))
            throw new Error("Invalid selector function");
        const path = selector.toString().split(".").slice(1);
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
