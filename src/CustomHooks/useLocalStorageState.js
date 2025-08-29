import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    console.log(storedValue);
    //to handle null value
    return storedValue ? JSON.parse(storedValue) : initialState;
  });
  //this way we will not need to use delete to reset because it will re render when the watched changes.
  useEffect(() => {
    //No need for [...watched, movie]
    //because it wont be mounted unless the watched is updated
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}
