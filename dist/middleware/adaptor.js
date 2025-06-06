import { produce } from 'immer';
export function adaptor(fn) {
    return produce(fn);
}
