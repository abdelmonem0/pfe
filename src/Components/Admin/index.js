import { Switch, Route } from "react-router-dom";

import EditProfile from "../Commun/EditProfile";
import AdminPanel from "./AdminPanel";

function Admin() {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Switch>
        <Route exact path="/">
          <AdminPanel />
        </Route>
        <Route exact path="/profile">
          <EditProfile />
        </Route>
      </Switch>
    </div>
  );
}

export default Admin;
