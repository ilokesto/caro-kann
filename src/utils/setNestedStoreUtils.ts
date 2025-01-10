import { SetNestedBoard } from "../types";

export const setNestedStore: SetNestedBoard = (setBoard, selector) =>
    (value) => {
      setBoard((prev) => {
      const path = parseObjectPath(selector.toString());
      const newBoard = {...prev};

      typeof value === "function"
        ? updateNestedValue(newBoard, path, (value as Function)(selector(prev)))
        : updateNestedValue(newBoard, path, value)

      return newBoard;
    })
  };

function updateNestedValue (obj: any, path: string[], value: any) {
  if (path.length === 1) {
    obj[path[0]] = value;
  } else {
    if (!obj[path[0]]) obj[path[0]] = {};
    updateNestedValue(obj[path[0]], path.slice(1), value);
  }
};

function parseObjectPath(input: string) {
  // 화살표 함수로 작성되었는지 확인
  if (!/=>/.test(input)) throw new Error('Invalid caro-kann selector format: missing " => "');

  // 중괄호가 있는지 확인
  if (/{|}/.test(input)) throw new Error('Invalid caro-kann selector format: contains curly braces({ })');

  // 존재해서는 안될 특수문자가 있는지 확인
  if (/&|:|\?/.test(input)) throw new Error('Invalid caro-kann selector format: contains disallowed special characters(? : &)');

  const path = input.split('=>')[1].trim();

  // 변수가 사용되었는지 확인
  const invalidMatch = path.match(/\[(?!["'])([^\]]+)(?!["'])\]/);
  if (invalidMatch) throw new Error(`Invalid path detected: ${invalidMatch[0]}`);

  // 경로를 배열로 변환
  const keys = Array.from(path.matchAll(/(?:\.|^)(\w+)|\["(.+?)"\]/g))
    .map(match => match[1] || match[2]).slice(1);

  return keys;
}
