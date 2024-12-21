import { SetStorage } from "../../types";

export const setStorage: SetStorage = ({storageKey, storageType, storageVersion: version, value: state}) => {
  try {
    if (storageType === 'local') {
      localStorage.setItem(storageKey, JSON.stringify({ state, version }));
    } else if (storageType === 'cookie') {
      document.cookie = `${storageKey}=${JSON.stringify({ state, version })}`
    }
  } catch (e) {
    if (typeof window !== 'undefined') console.error('Caro-Kann : Failed to write to storage', e);
  }
};
