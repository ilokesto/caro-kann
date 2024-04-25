"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playTartakower = void 0;
var react_1 = require("react");
var playTartakower = function (initialState) {
  var createBoard = function (initialState) {
    var board = initialState;
    var callbacks = new Set();
    var getBoard = function () {
      return board;
    };
    var setBoard = function (nextState) {
      board = typeof nextState === "function" ? nextState(board) : nextState;
      callbacks.forEach(function (callback) {
        return callback();
      });
    };
    var subscribe = function (callback) {
      callbacks.add(callback);
      return function () {
        callbacks.delete(callback);
      };
    };
    return { getBoard: getBoard, setBoard: setBoard, subscribe: subscribe };
  };
  var Board = (0, react_1.createContext)(createBoard(initialState));
  var useBoard = function (selector) {
    var _a = (0, react_1.useContext)(Board),
      getBoard = _a.getBoard,
      setBoard = _a.setBoard,
      subscribe = _a.subscribe;
    var notationSnapshot = function () {
      return selector ? selector(getBoard()) : getBoard();
    };
    var board = (0, react_1.useSyncExternalStore)(subscribe, notationSnapshot, notationSnapshot);
    return [board, setBoard];
  };
  return useBoard;
};
exports.playTartakower = playTartakower;
