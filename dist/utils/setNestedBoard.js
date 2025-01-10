import { parseObjectPath } from "./parseObjectPath";
export const setNestedBoard = (setBoard, selector) => (value) => {
    setBoard((prev) => {
        const path = parseObjectPath(selector.toString());
        const newBoard = { ...prev };
        typeof value === "function"
            ? updateNestedValue(newBoard, path, value(selector(prev)))
            : updateNestedValue(newBoard, path, value);
        return newBoard;
    });
};
function updateNestedValue(obj, path, value) {
    if (path.length === 1) {
        obj[path[0]] = value;
    }
    else {
        if (!obj[path[0]])
            obj[path[0]] = {};
        updateNestedValue(obj[path[0]], path.slice(1), value);
    }
}
;
