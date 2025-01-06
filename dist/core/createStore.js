import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from "react";
import { createBoard } from "./createBoard";
import { useStoreSync } from "./useStoreSync";
import { createSetTargetBoard } from "../utils/createSetTargetBoard";
function isBoard(initState) {
    return initState.getBoard !== undefined && initState.setBoard !== undefined;
}
export function createStore(initState) {
    const Board = createContext(isBoard(initState) ? initState : createBoard(initState));
    const useStore = (selector) => {
        const [board, setBoard] = selector ? useStoreSync(Board, selector) : useStoreSync(Board);
        if (selector)
            return [board, createSetTargetBoard(setBoard, selector), setBoard];
        else
            return [board, setBoard];
    };
    const useDerivedStore = (selector) => {
        return useStoreSync(Board, selector)[0];
    };
    const BoardContext = ({ value, children }) => {
        return _jsx(Board.Provider, { value: createBoard(value), children: children });
    };
    return isBoard(initState) ? { useStore, useDerivedStore } : { useStore, useDerivedStore, BoardContext };
}
;
