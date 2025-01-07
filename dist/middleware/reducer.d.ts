import { Store } from "../types";
export declare function reducer<T>(reducer: (state: T, action: {
    [x: string]: any;
    type: string;
}) => T, initialState: T): [Omit<Store<T>, "setStore"> & {
    setStore: (action: {
        [x: string]: any;
        type: string;
    }) => void;
}, "reducer"];
