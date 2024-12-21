export const getStorage = ({ storageKey, storageType, migrate, initState }) => {
    try {
        let storedValue = null;
        if (storageType === 'local') {
            if (migrate) {
                const { version: newVersion, strategy } = migrate;
                const { state, version, updatedAt } = JSON.parse(localStorage.getItem(storageKey));
                const newState = () => newVersion <= version
                    ? JSON.stringify({ state, version, updatedAt })
                    : JSON.stringify({ state: strategy(state, version), version: newVersion, updatedAt });
                localStorage.setItem(storageKey, newState());
            }
            storedValue = localStorage.getItem(storageKey);
        }
        else if (storageType === 'session') {
            storedValue = sessionStorage.getItem(storageKey);
        }
        if (storedValue !== null) {
            return JSON.parse(storedValue);
        }
    }
    catch (e) {
        console.error('Caro-Kann : Failed to read from storage');
    }
    return { state: initState, version: 0 }; // 데이터가 없거나 오류 발생 시 기본값 반환
};
