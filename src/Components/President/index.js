import { React } from "react";
import "../../App.css";
import { Switch, Route } from "react-router-dom";

import ViewProjects from "../Commun/ViewProjects";
import EditProfile from "../Commun/EditProfile";
import Soutenances from "./Soutenances";
import Teachers from "./Soutenances/Teachers/Teachers";
import { Dialog, Typography } from "@material-ui/core";
import Homepage from "./Homepage";
import Parameters from "./Parameters";
import EditProject from "../Enseignant/ProjectForm/EditProject";
import SavedSoutenances from "./SavedSoutenances";

function President() {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/sujets">
          <ViewProjects />
        </Route>
        <Route exact path="/soutenances">
          <Soutenances />
        </Route>
        <Route exact path="/soutenances/enregistres">
          <SavedSoutenances />
        </Route>
        <Route exact path="/profile">
          <EditProfile />
        </Route>
        <Route exact path="/enseignants/dialog">
          <Teachers />
          <Dialog open={true}>
            <Typography>Test</Typography>
          </Dialog>
        </Route>
        <Route exact path="/enseignants">
          <Teachers />
        </Route>
        <Route exact path="/modifier">
          <EditProject />
        </Route>
        <Route exact path="/parametres">
          <Parameters />
        </Route>
      </Switch>
    </div>
  );
}

export default President;
