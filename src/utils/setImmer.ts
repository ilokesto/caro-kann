import { Dispatch, SetStateAction } from "react"

export const setImmer = <T>(setStore: Dispatch<SetStateAction<T>>) => (fn: (prev: T) => void | SetStateAction<T>) => {
  setStore(prev => {
    const newStore = deepCopy(prev)

    fn(newStore)

    return newStore
  })
}

const deepCopy = <T>(obj: T, map = new WeakMap()): T => {
  if (obj === null || typeof obj !== "object") return obj;

  if (map.has(obj)) return map.get(obj);

  const copy = Array.isArray(obj) ? [] : {};
  map.set(obj, copy);

  if (Array.isArray(obj)) {
    (copy as any) = obj.map(item => deepCopy(item, map)); // 배열의 요소를 재귀적으로 복사
  } else {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        (copy as any)[key] = deepCopy((obj as any)[key], map);
      }
    }
  }

  return copy as T;
};