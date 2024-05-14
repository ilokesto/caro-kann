"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createBoard = (initialState) => {
    let board = initialState;
    const callbacks = new Set();
    const getBoard = () => board;
    const setBoard = (nextState) => {
        board = typeof nextState === "function" ? nextState(board) : nextState;
        callbacks.forEach((callback) => callback());
    };
    const subscribe = (callback) => {
        callbacks.add(callback);
        return () => {
            callbacks.delete(callback);
        };
    };
    return { getBoard, setBoard, subscribe };
};
exports.default = createBoard;
