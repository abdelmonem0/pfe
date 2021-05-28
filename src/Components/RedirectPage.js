import { Typography } from "@material-ui/core";
import { Warning } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router";

function RedirectPage({ setAuthorized }) {
  const history = useHistory();

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
            Page introuvée ou vous n'êtes pas autorisé.
          </Typography>
          <Typography variant="h5">
            Vous serez réorinté vers la page d'accueil dans quelque secondes.
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default RedirectPage;
