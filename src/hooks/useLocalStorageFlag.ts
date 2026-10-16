import { useState } from 'react';

export function useLocalStorageFlag(key: string, initial: boolean): [boolean, (next: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initial : stored === '1';
    } catch {
      return initial;
    }
  });

  function update(next: boolean): void {
    setValue(next);
    try {
      window.localStorage.setItem(key, next ? '1' : '0');
    } catch {
      // Storage unavailable — the in-memory value still works for this visit.
    }
  }

  return [value, update];
}
