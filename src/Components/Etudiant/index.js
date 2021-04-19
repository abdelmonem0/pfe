import { React } from "react";
import "../../App.css";
import { Switch, Route } from "react-router-dom";

import AddProject from "../Commun/AddProject";
import ViewProjects from "../Commun/ViewProjects";
import Candidatures from "./Candidatures";
import EditProfile from "../Commun/EditProfile";

function Etudiant() {

  return (
      <div style={{ display: "flex", justifyContent: "center", width:'100%' }}>
          <Switch>
            <Route path="/ajouter">
              <AddProject />
            </Route>
            <Route path="/sujets">
              <ViewProjects />
            </Route>
            <Route path="/candidatures">
              <Candidatures />
            </Route>
            <Route path="/profile">
              <EditProfile />
            </Route>
          </Switch>
      </div>
  );
}

export default Etudiant;
