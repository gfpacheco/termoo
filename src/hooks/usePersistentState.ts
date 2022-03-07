import merge from 'lodash.merge';
import { useEffect, useState } from 'react';

export default function usePersistentState<T>(
  defaultValue: T,
  key: string,
  mergeFunction: (defaultValue: T, persistedValue: T) => T = merge,
) {
  const [state, setState] = useState(() => {
    const json = localStorage.getItem(key);

    if (json) {
      return mergeFunction(defaultValue, JSON.parse(json) as T);
    }

    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
