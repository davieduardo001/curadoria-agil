"use client";

import { useState, useEffect } from 'react';

interface UserData {
  email: string;
  password: string;
  timestamp: number;
}

export function useLocalStorage(key: string, initialValue: UserData | null) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<UserData | null>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) as UserData : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: UserData | null) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
