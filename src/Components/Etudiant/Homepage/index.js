import React from "react";
import ViewDates from "../../President/Dates/ViewDates";
import Candidature from "./Candidature";
import Project from "./Project";
import Swipable from "./Swipable";

function Homepage(props) {
  return (
    <div style={{ display: "flex", flex: "1", gap: "1rem", flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 100%" }}>
        <ViewDates />
      </div>
      <Project style={{ flex: "1 1 60%" }} />
      <Candidature style={{ flex: "1 1 60%" }} />
      <Swipable style={{ flex: "1 1 39%" }} />
    </div>
  );
}

export default Homepage;
