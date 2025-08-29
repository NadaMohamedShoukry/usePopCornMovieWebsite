import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";

import App from "./App";
import StarRating from "./ReusableComponent/StarRating";
function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating maxRating={10} color="red" onSetRating={setMovieRating} />
      <p>This Movie is{movieRating} rating</p>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      className="test"
      messages={["teriable", "bad", "good", "great", "amazing"]}
    />
    <Test /> */}
  </React.StrictMode>
);
