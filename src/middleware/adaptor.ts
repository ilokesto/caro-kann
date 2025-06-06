export function adaptor<T>(adaptorFn: (draft: T) => void) {
  return function produce(state: T): T {
    // 재귀적으로 객체를 복사하는 함수
    function deepCopy<S>(obj: S): S {
      if (obj === null || obj === undefined) {
        return obj;
      }
      
      // 배열인 경우
      if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item)) as unknown as S;
      }
      
      // 일반 객체인 경우 (함수가 아니고 객체인 경우)
      if (typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype) {
        const copy = {} as Record<string, any>;
        
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = deepCopy(obj[key as keyof S]);
          }
        }
        
        return copy as S;
      }
      
      // 함수, 원시 타입 등 다른 모든 경우는 그대로 반환
      return obj;
    }
    
    // 원본 상태의 딥 카피 생성
    const copy = deepCopy(state);
    
    // 복사된 상태를 수정
    adaptorFn(copy);
    
    // 수정된 상태 반환
    return copy;
  };
}