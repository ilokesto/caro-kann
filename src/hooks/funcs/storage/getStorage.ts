import { GetStorage } from "../../types";
import { execMigrate } from "./execMigrate";
import { getCookie } from "./getCookie";

export const getStorage: GetStorage = ({storageKey, storageType, migrate, initState}) => {
  try {
    let storedValue: string | null = null;

    migrate && execMigrate({storageKey, storageType, migrate})

    if (storageType === 'local') {
      storedValue = localStorage.getItem(storageKey);
    } else if (storageType === 'cookie') {
      storedValue = getCookie(storageKey)
    }

    if (storedValue !== null) {
      return JSON.parse(storedValue);
    }

  } catch (e) {
    if (typeof window !== 'undefined') console.error('Caro-Kann : Failed to read from storage',);
  }

  return { state : initState, version: 0 };
};