import { execMigrate } from "./execMigrate";
import { getCookie } from "./getCookie";
export const getStorage = ({ storageKey, storageType, migrate, initState }) => {
    try {
        let storedValue = null;
        migrate && storageType && execMigrate({ storageKey, storageType, migrate });
        if (storageType === 'local') {
            storedValue = localStorage.getItem(storageKey);
        }
        else if (storageType === 'session') {
            storedValue = sessionStorage.getItem(storageKey);
        }
        else if (storageType === 'cookie') {
            storedValue = getCookie(storageKey);
        }
        if (storedValue !== null) {
            return JSON.parse(storedValue);
        }
    }
    catch (e) {
        if (typeof window !== 'undefined')
            console.error('Caro-Kann : Failed to read from storage');
    }
    return { state: initState, version: 0 };
};
