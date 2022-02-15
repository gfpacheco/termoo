import { useEffect } from 'react';

export default function useKeyDownHandler(handler: (key: string) => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      handler(event.key);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handler]);
}
