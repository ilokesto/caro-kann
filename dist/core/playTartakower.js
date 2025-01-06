import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createBoard } from "./createBoard";
import { useStore } from "./useStore";
import { createSetTargetBoard } from "../funcs/createSetTargetBoard";
function isBoard(initState) {
    return initState.getBoard !== undefined;
}
export function playTartakower(initState) {
    const Board = createContext(isBoard(initState) ? initState : createBoard(initState));
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
