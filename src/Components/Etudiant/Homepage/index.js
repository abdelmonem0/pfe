import React from "react";
import Candidature from "./Candidature";
import Project from "./Project";
import Swipable from "./Swipable";

function Homepage(props) {
  return (
    <div style={{ display: "flex", flex: "1", gap: "1rem", flexWrap: "wrap" }}>
      <Project style={{ flex: "1 1 60%" }} />
      <Candidature style={{ flex: "1 1 60%" }} />
      <Swipable style={{ flex: "1 1 39%" }} />
    </div>
  );
}

export default Homepage;
