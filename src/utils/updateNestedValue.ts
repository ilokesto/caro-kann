export const updateNestedValue = (obj: any, path: string[], value: any) => {
  if (path.length === 1) {
    obj[path[0]] = value;
  } else {
    if (!obj[path[0]]) obj[path[0]] = {};
    updateNestedValue(obj[path[0]], path.slice(1), value);
  }
};
