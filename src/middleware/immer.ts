import { produce, Immutable, Draft } from 'immer';

export function immer<T>(fn: (draft: Draft<T>) => void) {
  const producer = produce(fn);
  return (state: Immutable<T>): T => {
    return producer(state as any) as unknown as T;
  };
}
