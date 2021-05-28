import React from "react";
import Statistics from "./Statistics";

function Homepage() {
  console.log("homepage president.js");
  return (
    <div style={{ display: "flex", flex: "1", gap: "1rem", flexWrap: "wrap" }}>
      <Statistics />
    </div>
  );
}

export default React.memo(Homepage);
