export const setStorage = (key, storageType, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        if (storageType === 'local') {
            localStorage.setItem(key, serializedValue);
        }
        else if (storageType === 'session') {
            sessionStorage.setItem(key, serializedValue);
        }
    }
    catch (e) {
        console.error('Failed to write to storage', e);
    }
};
