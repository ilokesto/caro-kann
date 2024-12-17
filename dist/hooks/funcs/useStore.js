import { useContext, useSyncExternalStore } from "react";
export const useStore = (initialState, Board, selector) => {
    const { getBoard, setBoard, subscribe } = useContext(Board);
    const snapshot = () => selector ? selector(getBoard()) : getBoard();
    const serverSideSnapshot = () => selector ? selector(initialState) : initialState;
    const board = useSyncExternalStore(subscribe, snapshot, serverSideSnapshot);
    if (selector) {
        const target = selector?.toString().split(".").at(1) ?? selector?.toString().split("\[\"").at(1)?.split("\"\]").at(0);
        const setTargetBoard = (value) => {
            if (typeof value === "function") {
                setBoard((prev) => {
                    return {
                        ...prev,
                        [target]: value(prev[target]),
                    };
                });
            }
            else {
                setBoard((prev) => {
                    return {
                        ...prev,
                        [target]: value,
                    };
                });
            }
        };
        return [board, setTargetBoard];
    }
    else {
        return [board, setBoard];
    }
};
