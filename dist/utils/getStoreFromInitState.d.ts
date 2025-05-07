/// <reference types="react" />
import { MiddlewareStore } from "../types";
export declare const getStoreFromInitState: <T>(initState: T | MiddlewareStore<T, string>) => import("../types").Store<T, import("react").SetStateAction<T>>;
