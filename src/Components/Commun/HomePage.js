import React from "react";
import Homepage from "../Etudiant/Homepage";
import Candidature from "../Etudiant/Homepage/Candidature";
import Statistics from "./Statistics";

function HomePage(props) {
  return (
    <div style={{ flex: "1" }}>
      {/* Student */}
      <Homepage />
    </div>
  );
}

export default HomePage;
