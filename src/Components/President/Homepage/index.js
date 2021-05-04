import React from "react";
import Statistics from "./Statistics";

function Homepage(props) {
  return (
    <div style={{ display: "flex", flex: "1", gap: "1rem", flexWrap: "wrap" }}>
      <Statistics />
    </div>
  );
}

export default Homepage;
