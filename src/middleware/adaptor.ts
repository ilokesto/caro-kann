export function adaptor<T>(recipe: (draft: T) => void): (baseState: T) => T {
  // 커링된 함수 반환
  return function produceState(baseState: T): T {
    // 기본 타입이면 직접 처리
    if (typeof baseState !== 'object' || baseState === null) {
      const result = recipe(baseState);
      return result === undefined ? baseState : result;
    }
    
    // 타입 정의
    type Base = Record<string | symbol, any>;
    type Draft<B> = B;
    type Parent = { parent: Base; key: string | symbol | null };
    
    // 상태 관리를 위한 맵과 셋
    const drafts = new WeakMap<Base, any>();  // 원본 -> 드래프트
    const parents = new WeakMap<object, Parent>(); // 드래프트 -> 부모 참조
    const copies = new WeakMap<Base, Base>();  // 원본 -> 복사본
    const modified = new WeakSet<Base>(); // 수정된 객체들
    let isModified = false; // 변경 여부를 추적하는 플래그
    
    // 드래프트 생성 함수
    function createDraft<B extends Base>(base: B, parent: Base | null = null, key: string | symbol | null = null): Draft<B> {
      // 기본 타입 처리
      if (typeof base !== 'object' || base === null) {
        return base as any;
      }
      
      // 이미 드래프트가 있으면 반환
      if (drafts.has(base)) {
        return drafts.get(base) as Draft<B>;
      }
      
      // 핸들러 객체 생성
      const handler: ProxyHandler<B> = {
        get(target: B, prop: string | symbol): any {
          if (prop === '__isDraft') return true;
          
          // 특수 프로퍼티는 원본에서 직접 접근
          if (typeof prop === 'symbol' || 
              ['constructor', 'prototype', '__proto__'].includes(prop as string)) {
            return target[prop as keyof B];
          }
          
          // 속성 디스크립터 확인 (읽기 전용 확인용)
          try {
            const desc = Object.getOwnPropertyDescriptor(target, prop);
            // 읽기 전용 & 구성 불가능 속성은 원본 값을 직접 반환
            if (desc && !desc.writable && !desc.configurable) {
              return target[prop as keyof B];
            }
          } catch (e) {
            // getOwnPropertyDescriptor 실패 시 기본 동작 계속
          }
          
          const value = target[prop as keyof B];
          
          // 객체가 아니면 그대로 반환
          if (typeof value !== 'object' || value === null) {
            return value;
          }
          
          // 객체면 새 드래프트 생성하여 반환
          return createDraft(value, target, prop);
        },
        
        set(target: B, prop: string | symbol, value: any): boolean {
          try {
            const desc = Object.getOwnPropertyDescriptor(target, prop);
            // 읽기 전용 속성은 수정할 수 없음
            if (desc && !desc.writable && !desc.configurable) {
              return false;
            }
          } catch (e) {
            // 오류 무시
          }
          
          // 값이 같으면 변경하지 않음
          if (Object.is((target as any)[prop], value)) {
            return true;
          }
          
          // 복사본 생성 후 값 설정
          const copy = getOrCreateCopy(target);
          (copy as any)[prop] = value;
          markChanged(target);
          return true;
        },
        
        deleteProperty(target: B, prop: string | symbol): boolean {
          try {
            const desc = Object.getOwnPropertyDescriptor(target, prop);
            // 구성 불가능 속성은 삭제할 수 없음
            if (desc && !desc.configurable) {
              return false;
            }
          } catch (e) {
            // 오류 무시
          }
          
          if (!(prop in target)) return true;
          
          const copy = getOrCreateCopy(target);
          delete (copy as any)[prop];
          markChanged(target);
          return true;
        }
      };
      
      // 프록시 생성 및 매핑
      const draft = new Proxy(base, handler);
      drafts.set(base, draft);
      
      // 부모 참조 저장
      if (parent && key !== null) {
        parents.set(draft, { parent, key });
      }
      
      return draft as Draft<B>;
    }
    
    // 나머지 코드는 그대로 유지...
    
    // 객체를 변경됨으로 표시
    function markChanged(target: Base): void {
      if (modified.has(target)) return;
      
      modified.add(target);
      isModified = true; // 수정 플래그 설정
      
      // 부모 객체들도 변경됨으로 표시
      const draft = drafts.get(target);
      if (draft && parents.has(draft)) {
        const { parent } = parents.get(draft)!;
        markChanged(parent);
      }
    }
    
    // 복사본 생성 또는 가져오기
    function getOrCreateCopy(target: Base): Base {
      if (!copies.has(target)) {
        copies.set(
          target,
          Array.isArray(target) ? target.slice() : { ...target }
        );
      }
      return copies.get(target)!;
    }
    
    // 최종 결과물 생성
    function finalize(base: any): any {
      // 기본 타입 처리
      if (typeof base !== 'object' || base === null) {
        return base;
      }
      
      // 변경되지 않았으면 원본 반환
      if (!modified.has(base)) {
        return base;
      }
      
      // 복사본 가져오기 또는 생성하기
      const copy = getOrCreateCopy(base);
      
      // 자식 객체들도 재귀적으로 처리
      if (copy) {  // null/undefined 체크 추가
        for (const key of Object.keys(copy)) {
          const value = base[key];
          if (typeof value === 'object' && value !== null) {
            copy[key] = finalize(value);
          }
        }
      }
      
      return Object.freeze(copy); // 불변성 보장
    }
    
    // 메인 로직
    const draft = createDraft(baseState as Base);
    const result = recipe(draft as T);
    
    // 레시피가 값을 명시적으로 반환한 경우
    if (result !== undefined && result !== draft) {
      return result;
    }
    
    // 변경 사항이 없으면 원본 반환
    if (!isModified) {
      return baseState;
    }
    
    // 최종 변경된 상태 반환
    return finalize(baseState as Base) as T;
  };
}