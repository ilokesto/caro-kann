import { Draft } from 'immer';
export declare function adaptor<T extends object>(fn: (draft: Draft<T>) => void): (state?: T | undefined) => T;
