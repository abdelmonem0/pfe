import { React, useState, useEffect } from "react";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import axios from "axios";

import AddProject from "../Commun/AddProject";
import ViewProjects from "../Commun/ViewProjects";
import Candidatures from "./Candidatures";
import EditProfile from "../Commun/EditProfile";
import Preferences from "./Preferences/index";

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
        <Route path="/ajouter">
          <AddProject />
        </Route>
        <Route path="/sujets">
          <ViewProjects />
        </Route>
        <Route path="/candidatures">
          <Candidatures />
        </Route>
        <Route path="/preferences">
          <Preferences />
        </Route>
        <Route path="/profile">
          <EditProfile />
        </Route>
      </Switch>
    </div>
  );
}

export default Enseignant;
