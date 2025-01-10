import { useContext, useSyncExternalStore } from "react";
import { setNestedBoard } from "../utils/setNestedBoard";
export const useStoreSync = ({ Store, storeTag, }) => (selector = (state) => state) => {
    const { getStore, setStore, subscribe, getInitState } = useContext(Store);
    const board = useSyncExternalStore(subscribe, () => selector(getStore()), () => selector(getStore()));
    if (storeTag === "zustand")
        return board;
    if (selector && storeTag !== "reducer")
        return [
            board,
            setNestedBoard(setStore, selector),
            setStore,
        ];
    else
        return [board, setStore];
};
