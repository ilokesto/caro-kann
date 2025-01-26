export const setImmer = (setStore) => (fn) => {
    setStore(prev => {
        const newStore = deepCopy(prev);
        fn(newStore);
        return newStore;
    });
};
const deepCopy = (obj, map = new WeakMap()) => {
    if (obj === null || typeof obj !== "object")
        return obj;
    if (map.has(obj))
        return map.get(obj);
    const copy = Array.isArray(obj) ? [] : {};
    map.set(obj, copy);
    if (Array.isArray(obj)) {
        copy = obj.map(item => deepCopy(item, map));
    }
    else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key], map);
            }
        }
    }
    return copy;
};
