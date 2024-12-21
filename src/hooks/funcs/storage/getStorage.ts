import { Options } from "../../types";

export const getStorage = <T>(key: string, storageType: 'local' | 'session', defaultValue: T, migrate?: Options<T>["migrate"]): { state: T, version: number} => {
  try {
    let storedValue: string | null = null;

    if (storageType === 'local') {
      if (migrate) {
        const { version: newVersion, strategy } = migrate;
        const { state, version } = JSON.parse(localStorage.getItem(key)!)

        const newState = () => {
          if (newVersion <= version) {
            console.error('Caro-Kann : The version of the data is the same or newer than the version of the migration strategy. The data will not be migrated.');
            return JSON.stringify({ state, version });
          } else {
            return JSON.stringify({ state: strategy(state, version, newVersion), version: newVersion });
          }
        }

        localStorage.setItem(key, newState());
      }

      storedValue = localStorage.getItem(key);
    } else if (storageType === 'session') {
      storedValue = sessionStorage.getItem(key);
    }

    if (storedValue !== null) {
      return JSON.parse(storedValue);
    }

  } catch (e) {
    console.error('Caro-Kann : Failed to read from storage', e);
  }

  return { state : defaultValue, version: 0 }; // 데이터가 없거나 오류 발생 시 기본값 반환
};