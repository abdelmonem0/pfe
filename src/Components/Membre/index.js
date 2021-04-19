import { Reac } from "react";
import "../../App.css";
import { Switch, Route } from "react-router-dom";
import axios from "axios";

import ViewProjects from "../Commun/ViewProjects";
import EditProfile from "../Commun/EditProfile";

function Membre() {

  return (
    <div style={{ display: "flex", justifyContent: "center", width:'100%' }}>
    <Switch>
      <Route path="/sujets">
        <ViewProjects />
      </Route>
      <Route path="/profile">
        <EditProfile />
      </Route>
    </Switch>
</div>
  );
}

export default Membre;
