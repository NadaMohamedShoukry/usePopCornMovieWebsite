import { useRef } from "react";
import { useKey } from "../CustomHooks/useKey";

//Stateful
export function Search({ query, setQuery }) {
  //React declarative way
  const inputEl = useRef(null);
  //The ref is added to the DOM after the DOM has already loaded.
  useKey(function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  }, "Enter");

  // useEffect(() => {
  //   // console.log(inputEl.current);
  //   //Focus on the search bar when press enter.
  //   function callBack(e) {
  //     //activeElement=>the element which is currently focused.
  //     if (document.activeElement === inputEl.current) return;
  //     //place it in a call back so we can clean up
  //     if (e.code === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   }
  //   document.addEventListener("keydown", callBack);
  //   return () => document.addEventListener("keydown", callBack);
  // }, [setQuery]);
  /*
  //To focuse on the search bar when the component mounts.
  //Manual DOM manipulation(imperative) Vanilla Js way
  useEffect(() => {
    // Not the React way of doing this
    //React is declarative .
    //To make it declarative we need refs
    const el = document.querySelector(".search");
    console.log(el);
    el.focus();
  }, []);
  */
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}