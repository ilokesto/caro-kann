import { Options } from "../../types";

export const parseOptions = <T>(options?: Options<T>) => {
  const storageKey = options?.local ?? options?.cookie ?? '';
  const storageType = options?.local ? 'local' : options?.cookie ? 'cookie' : null;
  const storageVersion = options?.migrate?.version ?? 0;
  const migrate = options?.migrate

  return { storageKey, storageType, storageVersion, migrate } as const;
}