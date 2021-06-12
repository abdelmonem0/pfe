import { Typography } from "@material-ui/core";
import { Warning } from "@material-ui/icons";
import React from "react";
import { useHistory, useLocation } from "react-router";

function RedirectPage({ setAuthorized }) {
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    setTimeout(() => {
      history.replace("/");
      setAuthorized(true);
    }, 5000);
  }, []);

  return (
    <div style={{ flex: 1, padding: "5vw", paddingTop: "30vh" }}>
      <div className="horizontal-list wrap">
        <div>
          <Warning style={{ fontSize: "15vh" }} />
        </div>
        <div>
          <Typography variant="h4" color="secondary">
            Page introuvable ou vous n'êtes pas autorisé à la visiter.
          </Typography>
          <Typography variant="h5">
            Vous serez rédirigé vers la page d'accueil dans quelque instants.
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default RedirectPage;
