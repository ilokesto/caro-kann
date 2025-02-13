import { storeTypeTag } from "../types";
export const isMiddlewareStore = (initState) => {
    return Reflect.has(initState, storeTypeTag);
};
