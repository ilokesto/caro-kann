import { getStorage } from "./getStorage";
export const setStorage = (key, storageType, value) => {
    try {
        const { version } = getStorage(key, storageType, value);
        const serializedValue = JSON.stringify({ state: value, version });
        if (storageType === 'local') {
            localStorage.setItem(key, serializedValue);
        }
        else if (storageType === 'session') {
            sessionStorage.setItem(key, serializedValue);
        }
    }
    catch (e) {
        console.error('Caro-Kann : Failed to write to storage', e);
    }
};
