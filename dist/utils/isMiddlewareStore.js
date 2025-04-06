import { storeTypeTag } from "../types";
export const isMiddlewareStore = (initState) => {
    return typeof initState === 'object' ? Reflect.has(initState, storeTypeTag) : false;
};
