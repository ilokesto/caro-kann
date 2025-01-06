export const createBoard = (initState) => {
    const callbacks = new Set();
    let board = initState;
    const setBoard = (nextState) => {
        board = typeof nextState === "function" ? nextState(board) : nextState;
        callbacks.forEach((cb) => cb());
    };
    const getBoard = () => board;
    const subscribe = (callback) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
    };
    return { getBoard, setBoard, subscribe, getInitState: () => initState };
};
