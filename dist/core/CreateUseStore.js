import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
export function createUseStore({ getStore, setStore, subscribe }, selector) {
    const board = useSyncExternalStoreWithSelector(subscribe, getStore, getStore, selector);
    return [
        board,
        (nextState) => {
            setStore(nextState, "setStoreAction", selector);
        }
    ];
}
