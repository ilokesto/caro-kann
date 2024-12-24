import { SetStorage } from "../../types";

export const setStorage: SetStorage = ({storageKey, storageType, storageVersion: version, value: state}) => {
  const encodedState = JSON.stringify({ state, version });
  try {
    if (storageType === 'local') {
      localStorage.setItem(storageKey, encodedState);
    } else if (storageType === 'session') {
      sessionStorage.setItem(storageKey, encodedState);
    } else if (storageType === 'cookie') {
      document.cookie = `${storageKey}=${encodedState}`
    }
  } catch (e) {
    if (typeof window !== 'undefined') console.error('Caro-Kann : Failed to write to storage', e);
  }
};
