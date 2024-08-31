"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playTartakower = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const createBoard_1 = __importDefault(require("./funcs/createBoard"));
const playTartakower = (initialState) => {
    const Board = (0, react_1.createContext)((0, createBoard_1.default)(initialState));
    function useBoard(selector) {
        const { getBoard, setBoard, subscribe } = (0, react_1.useContext)(Board);
        const notationSnapshot = () => (selector ? selector(getBoard()) : getBoard());
        const board = (0, react_1.useSyncExternalStore)(subscribe, notationSnapshot, notationSnapshot);
        return [board, setBoard];
    }
    const BoardContext = ({ value, children }) => {
        return (0, jsx_runtime_1.jsx)(Board.Provider, { value: (0, createBoard_1.default)(value), children: children });
    };
    return { useBoard, BoardContext };
};
exports.playTartakower = playTartakower;
(0, exports.playTartakower)(1);
