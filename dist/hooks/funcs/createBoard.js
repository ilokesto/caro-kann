import { getStorage } from "./storage/getStorage";
import { parseOptions } from "./storage/parseOptions";
import { setStorage } from "./storage/setStorage";
export const createBoard = (initState, options) => {
    const optionObj = parseOptions(options);
    const initialState = optionObj.storageType ? getStorage({ ...optionObj, initState }).state : initState;
    const callbacks = new Set();
    let board = initialState;
    const setBoard = (nextState) => {
        board = typeof nextState === "function" ? nextState(board) : nextState;
        if (optionObj.storageType)
            setStorage({ ...optionObj, value: board });
        callbacks.forEach((cb) => cb());
    };
    const getBoard = () => board;
    const subscribe = (callback) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
    };
    return { getBoard, setBoard, subscribe, getInitState: () => initState };
};
