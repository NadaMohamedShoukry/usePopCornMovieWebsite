import { useEffect } from "react";

export function useKey(actionFunction, key) {
  useEffect(() => {
    function callBack(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        actionFunction();
        console.log("Closing");
      }
    }
    document.addEventListener("keydown", callBack);
    return () => document.removeEventListener("keydown", callBack);
  }, [actionFunction, key]);
}
