import { SetStorage } from "../../types";

export const setStorage: SetStorage = ({storageKey, storageType, storageVersion: version, value: state}) => {
  try {
    const serializedValue = JSON.stringify({ state, version });

    if (storageType === 'local') {
      localStorage.setItem(storageKey, serializedValue);
    } else if (storageType === 'session') {
      sessionStorage.setItem(storageKey, serializedValue);
    }
  } catch (e) {
    console.error('Caro-Kann : Failed to write to storage', e);
  }
};
