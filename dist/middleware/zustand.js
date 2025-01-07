import { createZustandBoard } from "../core/createZustandStore";
export function zustand(initFn) {
    return createZustandBoard(initFn);
}
