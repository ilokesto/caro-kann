export const setNestedStore = (setBoard, selector) => (value) => {
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
    if (path.length === 0) {
        Object.keys(obj).forEach(key => delete obj[key]);
        if (typeof value === 'object' && value !== null) {
            Object.assign(obj, value);
        }
        return;
    }
    else if (path.length === 1) {
        obj[path[0]] = value;
    }
    else {
        if (!obj[path[0]])
            obj[path[0]] = {};
        updateNestedValue(obj[path[0]], path.slice(1), value);
    }
}
function parseObjectPath(input) {
    if (!/=>/.test(input))
        throw new Error('Invalid caro-kann selector format: missing " => "');
    if (/{|}/.test(input))
        throw new Error('Invalid caro-kann selector format: contains curly braces({ })');
    if (/&|:|\?/.test(input))
        throw new Error('Invalid caro-kann selector format: contains disallowed special characters(? : &)');
    const path = input.split('=>')[1].trim();
    const invalidMatch = path.match(/\[(?!["'])([^\]]+)(?!["'])\]/);
    if (invalidMatch)
        throw new Error(`Invalid path detected: ${invalidMatch[0]}`);
    const keys = Array.from(path.matchAll(/(?:\.|^)(\w+)|\["(.+?)"\]/g))
        .map(match => match[1] || match[2]).slice(1);
    return keys;
}
