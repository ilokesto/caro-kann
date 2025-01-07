import { createZustandStore } from "../core/createZustandStore";
export function zustand(initFn) {
    return createZustandStore(initFn);
}
