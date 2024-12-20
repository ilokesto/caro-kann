export const setStorage = <T>(key: string, storageType: 'local' | 'session', value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);

    if (storageType === 'local') {
      localStorage.setItem(key, serializedValue);
    } else if (storageType === 'session') {
      sessionStorage.setItem(key, serializedValue);
    }
  } catch (e) {
    console.error('Failed to write to storage', e);
  }
};