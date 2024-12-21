export const setStorage = ({ storageKey, storageType, storageVersion: version, value: state }) => {
    try {
        if (storageType === 'local') {
            localStorage.setItem(storageKey, JSON.stringify({ state, version }));
        }
        else if (storageType === 'session') {
            sessionStorage.setItem(storageKey, JSON.stringify({ state }));
        }
    }
    catch (e) {
        console.error('Caro-Kann : Failed to write to storage', e);
    }
};
