import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createBoard } from "./funcs/createBoard";
import { createSetTargetBoard } from "./funcs/createSetTargetBoard";
import { useStore } from "./funcs/useStore";
export function playTartakower(initState, options) {
    const Board = createContext(createBoard(initState, options));
    const useBoard = (selector) => {
        const [board, setBoard] = selector ? useStore(Board, selector) : useStore(Board);
        if (selector)
            return [board, createSetTargetBoard(setBoard, selector), setBoard];
        else
            return [board, setBoard];
    };
    const useDerivedBoard = (selector) => {
        return useStore(Board, selector)[0];
    };
    const BoardContext = ({ value, children }) => {
        return _jsx(Board.Provider, { value: createBoard(value), children: children });
    };
    return { useBoard, useDerivedBoard, BoardContext };
}
;
