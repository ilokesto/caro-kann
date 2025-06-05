import { Immutable, Draft } from 'immer';
export declare function immer<T>(fn: (draft: Draft<T>) => void): (state: Immutable<T>) => T;
