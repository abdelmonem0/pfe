import { React, useState, useEffect } from "react";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import axios from "axios";

import AddProject from "./ProjectForm/AddProject";
import EditProject from "./ProjectForm/EditProject";
import ViewProjects from "../Commun/ViewProjects";
import EditProfile from "../Commun/EditProfile";
import Preferences from "./Preferences/index";
import Candidatures from "../Commun/Candidature.js";

function Enseignant(props) {
  const user = useSelector((state) => state.users.current);
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/get-users")
      .then((result) => dispatch({ type: "SET_USERS", payload: result.data }));
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Switch>
        <Route exact path="/ajouter">
          <AddProject />
        </Route>
        <Route exact path="/modifier">
          <EditProject />
        </Route>
        <Route exact path="/sujets">
          <ViewProjects />
        </Route>
        <Route exact path="/candidatures">
          <Candidatures />
        </Route>
        <Route exact path="/preferences">
          <Preferences />
        </Route>
        <Route exact path="/profile">
          <EditProfile />
        </Route>
      </Switch>
    </div>
  );
}

export default Enseignant;
