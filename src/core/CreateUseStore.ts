import { useMemo, useSyncExternalStore } from "react";
import type { SetStateAction, Store } from "../types";

export function createUseStore<T, S>(
  { getStore, setStore, subscribe }: Store<T>,
  selector: (state: T) => S,
) {
  const getSelection = useMemo(() => {
      let hasMemo = false;
      let memoizedSnapshot: T | undefined;
      let memoizedSelection: S | undefined;
  
      const memoizedSelector = (nextSnapshot: T): S => {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          const nextSelection = selector(nextSnapshot);
          memoizedSelection = nextSelection;
          return nextSelection;
        }
  
        const prevSnapshot = memoizedSnapshot as T; // hasMemo가 true이므로, memoizedSnapshot은 정의되어 있음
        const prevSelection = memoizedSelection as S; // hasMemo가 true이므로, memoizedSelection은 정의되어 있음
  
        if (Object.is(prevSnapshot, nextSnapshot)) {
          return prevSelection; // 스냅샷이 변경되지 않았다면 이전 선택 값을 반환
        }
  
        // 스냅샷이 변경되었다면 selector를 다시 실행
        const nextSelection = selector(nextSnapshot);
  
        // 새로운 스냅샷과 선택된 값을 메모
        memoizedSnapshot = nextSnapshot;
        memoizedSelection = nextSelection;
        return nextSelection;
      };
  
      return () => memoizedSelector(getStore());
    }, [getStore, selector]);

  const value = useSyncExternalStore(
    subscribe,
    getSelection,
    getSelection,
  );

  return [
    value,
    (nextState: SetStateAction<T>) => {
      setStore(nextState, "setStoreAction")
    }
  ] as const;
}