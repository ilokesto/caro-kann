import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useSyncExternalStore } from "react";
import createBoard from "./funcs/createBoard";
export const playTartakower = (initialState) => {
    const Board = createContext(createBoard(initialState));
    function useBoard(selector) {
        const { getBoard, setBoard, subscribe } = useContext(Board);
        const notationSnapshot = () => (selector ? selector(getBoard()) : getBoard());
        const board = useSyncExternalStore(subscribe, notationSnapshot, notationSnapshot);
        return [board, setBoard];
    }
    const BoardContext = ({ value, children }) => {
        return _jsx(Board.Provider, { value: createBoard(value), children: children });
    };
    return { useBoard, BoardContext };
};
