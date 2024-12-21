import { getCookie } from "./getCookie";
export const execMigrate = ({ storageKey, storageType, migrate }) => {
    const { version: newVersion, strategy } = migrate;
    if (storageType === 'local') {
        const { state, version } = JSON.parse(localStorage.getItem(storageKey));
        // 상태 버전이 신규 버전보다 낮을 경우 마이그레이션 실행
        if (newVersion > version)
            localStorage.setItem(storageKey, JSON.stringify({
                state: strategy(state, version),
                version: newVersion,
            }));
    }
    else if (storageType === 'cookie') {
        const { state, version } = JSON.parse(getCookie(storageKey));
        if (newVersion > version)
            document.cookie = `${storageKey}=${JSON.stringify({
                state: strategy(state, version),
                version: newVersion
            })}`;
    }
};
