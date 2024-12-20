export const getStorage = <T>(key: string, storageType: 'local' | 'session', defaultValue: T): T => {
  try {
    let storedValue: string | null = null;

    if (storageType === 'local') {
      storedValue = localStorage.getItem(key);
    } else if (storageType === 'session') {
      storedValue = sessionStorage.getItem(key);
    }

    if (storedValue !== null) {
      return JSON.parse(storedValue);
    }

  } catch (e) {
    console.error('Failed to read from storage', e);
  }

  return defaultValue; // 데이터가 없거나 오류 발생 시 기본값 반환
};