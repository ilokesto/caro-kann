export function adaptor(adaptorFn) {
    return function produce(state) {
        function deepCopy(obj) {
            if (obj === null || obj === undefined) {
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.map(item => deepCopy(item));
            }
            if (typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype) {
                const copy = {};
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        copy[key] = deepCopy(obj[key]);
                    }
                }
                return copy;
            }
            return obj;
        }
        const copy = deepCopy(state);
        adaptorFn(copy);
        return copy;
    };
}
