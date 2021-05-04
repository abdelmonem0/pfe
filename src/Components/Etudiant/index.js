import { React } from "react";
import "../../App.css";
import { Switch, Route } from "react-router-dom";

import AddProject from "./AddProject";
import ViewProjects from "../Commun/ViewProjects";
import EditProfile from "../Commun/EditProfile";
import Candidatures from "../Commun/Candidature.js";
import Homepage from "./Homepage";

function Etudiant() {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/ajouter">
          <AddProject />
        </Route>
        <Route exact path="/sujets">
          <ViewProjects />
        </Route>
        <Route exact path="/candidatures">
          <Candidatures />
        </Route>
        <Route exact path="/profile">
          <EditProfile />
        </Route>
      </Switch>
    </div>
  );
}

export default Etudiant;
