import { useMemo, useSyncExternalStore } from "react";
import type { Store } from "../types";
import { deepCompare } from "../utils/deepCompare";

export function createUseStore<T, S>(
  { getStore, setStore, subscribe }: Store<T>,
  selector: (state: T) => S,
) {
  const getSelection = useMemo(() => {
    let hasMemo = false;
    let mStore: T | undefined;
    let mSelection: S | undefined;

    // m: memo, p: prev, n: next
    const mSelector = (nStore: T): S => {
      if (!hasMemo) {
        hasMemo = true;
        mStore = nStore;
        const nSelection = selector(nStore);
        mSelection = nSelection;
        return nSelection;
      }

      const pStore = mStore as T; // hasMemo가 true이므로, mSnapshot 정의되어 있음
      const pSelection = mSelection as S; // hasMemo가 true이므로, mSelection 정의되어 있음

      if (deepCompare(pStore, nStore)) return pSelection; // 스냅샷이 변경되지 않았다면 이전 선택 값을 반환

      // 스냅샷이 변경되었다면 selector를 다시 실행
      const nSelection = selector(nStore);

      // 새로운 스냅샷과 선택된 값을 메모
      mStore = nStore;
      mSelection = nSelection;
      return nSelection;
    };

    return () => mSelector(getStore());
  }, [getStore, selector]);

  const value = useSyncExternalStore(
    subscribe,
    getSelection,
    getSelection,
  );

  return [value, setStore] as const;
}