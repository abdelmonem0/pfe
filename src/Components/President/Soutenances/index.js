import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Preferences from "./Preferences";

function Soutenances(props) {
  console.log("Soutenances index.js");

  return (
    <div style={{ flex: "1 1 100%" }}>
      <Preferences />
    </div>
  );
}

export default Soutenances;
