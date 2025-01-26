import { storeTypeTag } from "../types";
export const isMiddlewareStore = (initState) => {
    try {
        return storeTypeTag in initState;
    }
    catch {
        return false;
    }
};
