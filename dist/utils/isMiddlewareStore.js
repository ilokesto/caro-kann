import { storeTypeTag } from "../types";
export const isMiddlewareStore = (initState) => {
    return storeTypeTag in initState;
};
