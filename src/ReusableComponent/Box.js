//Create a reusable Box Component for listbox and watchedbox

import { useState } from "react";

//Stateful
export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {/* render children not object of children like this {children} */}
      {isOpen && children}
    </div>
  );
}
