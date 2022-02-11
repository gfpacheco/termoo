import { useEffect, useState } from 'react';

export default function usePersistentState<T>(defaultValue: T, key: string) {
  const [state, setState] = useState(() => {
    const json = localStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
