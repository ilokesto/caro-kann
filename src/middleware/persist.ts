import { createStore } from "../core/createStore";
import type { ExecMigrate, GetStorage, Options, SetStorage, Store } from "../types";

function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}

const execMigrate: ExecMigrate = ({ storageKey, storageType, migrate }) => {
  const { version: newVersion, strategy } = migrate!;

  if (storageType === 'local') {
    const { state, version } = JSON.parse(localStorage.getItem(storageKey)!)
  
    // 상태 버전이 신규 버전보다 낮을 경우 마이그레이션 실행
    if (newVersion > version) localStorage.setItem(storageKey, JSON.stringify({
        state: strategy(state, version),
        version: newVersion,
    }))
  } else if (storageType === 'cookie') {
    const { state, version } = JSON.parse(getCookie(storageKey)!)

    if (newVersion > version) document.cookie = `${storageKey}=${JSON.stringify({
        state: strategy(state, version),
        version: newVersion})}`
  }
}
const getStorage: GetStorage = ({storageKey, storageType, migrate, initState}) => {
  try {
    let storedValue: string | null = null;

    migrate && storageType && execMigrate({storageKey, storageType, migrate})

    if (storageType === 'local') {
      storedValue = localStorage.getItem(storageKey);
    } else if (storageType === 'session') {
      storedValue = sessionStorage.getItem(storageKey);
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

const parseOptions = <T>(options?: Options<T>) => {
  const storageKey = options?.local ?? options?.cookie ?? options?.session ?? '';
  const storageType = options?.local ? 'local' : options?.cookie ? 'cookie' : options?.session ? 'session' : null;
  const storageVersion = options?.migrate?.version ?? 0;
  const migrate = options?.migrate

  return { storageKey, storageType, storageVersion, migrate } as const;
}

const setStorage: SetStorage = ({storageKey, storageType, storageVersion: version, value: state}) => {
  const encodedState = JSON.stringify({ state, version });
  try {
    if (storageType === 'local') {
      localStorage.setItem(storageKey, encodedState);
    } else if (storageType === 'session') {
      sessionStorage.setItem(storageKey, encodedState);
    } else if (storageType === 'cookie') {
      document.cookie = `${storageKey}=${encodedState}`
    }
  } catch (e) {
    if (typeof window !== 'undefined') console.error('Caro-Kann : Failed to write to storage', e);
  }
};

export function persist<T>(initState: T, options: Options<T>): [Store<T>, "persist"] {
  const Store = createStore(initState);
  const optionObj = parseOptions(options);
  const initialState = optionObj.storageType ? getStorage({...optionObj, initState: Store.getInitState() }).state : Store.getInitState();
  Store.setStore(initialState);

  const setStore = (nextState: T | ((prev: T) => T)) => {
    Store.setStore(nextState)

    if (optionObj.storageType) setStorage({ ...optionObj, value: Store.getStore() });
  }

  return [{ ...Store, setStore}, "persist" as const]
}