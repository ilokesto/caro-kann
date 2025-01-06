export const updateNestedValue = (obj, path, value) => {
    if (path.length === 1) {
        obj[path[0]] = value;
    }
    else {
        if (!obj[path[0]])
            obj[path[0]] = {};
        updateNestedValue(obj[path[0]], path.slice(1), value);
    }
};
