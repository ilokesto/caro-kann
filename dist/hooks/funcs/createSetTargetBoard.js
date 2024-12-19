import { updateNestedValue } from "./updateNestedValue";
export const createSetTargetBoard = (setBoard, path, selector) => (value) => {
    setBoard((prev) => {
        const newBoard = { ...prev };
        typeof value === "function"
            ? updateNestedValue(newBoard, path, value(selector(prev)))
            : updateNestedValue(newBoard, path, value);
        return newBoard;
    });
};
