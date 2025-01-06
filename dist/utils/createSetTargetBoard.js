import { parseObjectPath } from "./parseObjectPath";
import { updateNestedValue } from "./updateNestedValue";
export const createSetTargetBoard = (setBoard, selector) => (value) => {
    setBoard((prev) => {
        const path = parseObjectPath(selector.toString());
        const newBoard = { ...prev };
        typeof value === "function"
            ? updateNestedValue(newBoard, path, value(selector(prev)))
            : updateNestedValue(newBoard, path, value);
        return newBoard;
    });
};
