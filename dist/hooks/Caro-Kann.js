import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { useStore } from "./funcs/useStore";
import { createBoard } from "./funcs/createBoard";
export const playTartakower = (initialState) => {
    const Board = createContext(createBoard(initialState));
    const useBoard = (selector) => {
        return selector ? useStore(initialState, Board, selector) : useStore(initialState, Board);
    };
    const BoardContext = ({ value, children }) => {
        return _jsx(Board.Provider, { value: createBoard(value), children: children });
    };
    return { useBoard, BoardContext };
};
