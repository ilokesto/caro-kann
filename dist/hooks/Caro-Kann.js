import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createBoard } from "./funcs/createBoard";
import { parseObjectPath } from "./funcs/parseObjectPath";
import { createSetTargetBoard } from "./funcs/createSetTargetBoard";
import { useStore } from "./funcs/syncBoard";
export function playTartakower(initialState, options) {
    const Board = createContext(createBoard(initialState, options));
    const useBoard = (selector) => {
        const [board, setBoard] = selector ? useStore(Board, initialState, selector) : useStore(Board, initialState);
        if (selector) {
            const path = parseObjectPath(selector.toString());
            const setTargetBoard = createSetTargetBoard(setBoard, path, selector);
            return [board, setTargetBoard, setBoard];
        }
        else {
            return [board, setBoard];
        }
    };
    const useDerivedBoard = (selector) => {
        return useStore(Board, initialState, selector)[0];
    };
    const BoardContext = ({ value, children }) => {
        return _jsx(Board.Provider, { value: createBoard(value), children: children });
    };
    return { useBoard, useDerivedBoard, BoardContext };
}
;
