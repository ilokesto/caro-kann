import { produce } from 'immer';
export function immer(fn) {
    const producer = produce(fn);
    return (state) => {
        return producer(state);
    };
}
