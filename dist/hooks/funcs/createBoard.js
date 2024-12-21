import { getStorage } from "./storage/getStorage";
import { setStorage } from "./storage/setStorage";
export const createBoard = (initState, options) => {
    const storageKey = options?.local ?? options?.session ?? '';
    const storageType = options?.local ? 'local' : options?.session ? 'session' : null;
    const migrate = options?.migrate;
    const initialState = storageType ? getStorage(storageKey, storageType, initState, migrate).state : initState;
    let board = initialState;
    const callbacks = new Set();
    const getBoard = () => board;
    const setBoard = (nextState) => {
        board = typeof nextState === "function" ? nextState(board) : nextState;
        if (storageType) {
            setStorage(storageKey, storageType, getBoard());
        }
        callbacks.forEach((cb) => cb());
    };
    const subscribe = (callback) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
    };
    return { getBoard, setBoard, subscribe, getInitState: () => initState };
};
