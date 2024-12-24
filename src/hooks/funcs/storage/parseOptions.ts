import { Options } from "../../types";

export const parseOptions = <T>(options?: Options<T>) => {
  const storageKey = options?.local ?? options?.cookie ?? options?.session ?? '';
  const storageType = options?.local ? 'local' : options?.cookie ? 'cookie' : options?.session ? 'session' : null;
  const storageVersion = options?.migrate?.version ?? 0;
  const migrate = options?.migrate

  return { storageKey, storageType, storageVersion, migrate } as const;
}