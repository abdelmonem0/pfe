import { React } from "react";
import "../../App.css";
import { Switch, Route } from "react-router-dom";

import ViewProjects from "../Commun/ViewProjects";
import EditProfile from "../Commun/EditProfile";
import Soutenances from "./Soutenances";
import Teachers from "./Soutenances/Teachers/Teachers";
import { Dialog, Typography } from "@material-ui/core";

function President() {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Switch>
        <Route path="/sujets">
          <ViewProjects />
        </Route>
        <Route path="/soutenances">
          <Soutenances />
        </Route>
        <Route path="/profile">
          <EditProfile />
        </Route>
        <Route path="/enseignants/dialog">
          <Teachers />
          <Dialog open={true}>
            <Typography>Test</Typography>
          </Dialog>
        </Route>
        <Route path="/enseignants">
          <Teachers />
        </Route>
      </Switch>
    </div>
  );
}

export default President;
