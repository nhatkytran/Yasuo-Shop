import { useEffect, useState } from 'react';

function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    () => localStorage.setItem(key, JSON.stringify(value)),
    [key, value]
  );

  return [value, setValue];
}

export default useLocalStorageState;
