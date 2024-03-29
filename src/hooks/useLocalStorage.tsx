import { useState, useEffect } from "react";

const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Determine the value to store
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Update state
      setStoredValue(valueToStore);

      // Update localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Read from localStorage only after mounting
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
