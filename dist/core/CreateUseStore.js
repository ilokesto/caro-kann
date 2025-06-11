import { useMemo, useSyncExternalStore } from "react";
export function createUseStore({ getStore, setStore, subscribe }, selector) {
    const getSelection = useMemo(() => {
        let hasMemo = false;
        let memoizedSnapshot;
        let memoizedSelection;
        const memoizedSelector = (nextSnapshot) => {
            if (!hasMemo) {
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                const nextSelection = selector(nextSnapshot);
                memoizedSelection = nextSelection;
                return nextSelection;
            }
            const prevSnapshot = memoizedSnapshot;
            const prevSelection = memoizedSelection;
            if (Object.is(prevSnapshot, nextSnapshot)) {
                return prevSelection;
            }
            const nextSelection = selector(nextSnapshot);
            memoizedSnapshot = nextSnapshot;
            memoizedSelection = nextSelection;
            return nextSelection;
        };
        return () => memoizedSelector(getStore());
    }, [getStore, selector]);
    const value = useSyncExternalStore(subscribe, getSelection, getSelection);
    return [
        value,
        (nextState) => {
            setStore(nextState, "setStoreAction");
        }
    ];
}
