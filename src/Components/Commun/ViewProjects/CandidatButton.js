import { Button } from "@material-ui/core";
import React from "react";
import { Candidature_States } from "../../../Constants";

function CandidatButton(props) {
  const { candidatures, project, setSelectedProject, openCandidature } = props;
  const waitingCand = candidatures.filter((el) => {
    return (
      el.etat === Candidature_States.waiting_for_response ||
      Candidature_States.waiting_for_student
    );
  });
  const gotAcceptedCand =
    candidatures.filter((el) => {
      return el.etat === Candidature_States.accepted;
    }).length > 0;

  return (
    !gotAcceptedCand && (
      <div>
        <Button
          disabled={waitingCand.length > 3}
          variant={waitingCand.length >= 3 ? "outlined" : "contained"}
          color="primary"
          disableElevation
          onClick={() => {
            setSelectedProject(project);
            openCandidature(true);
          }}
        >
          Postuler
        </Button>
      </div>
    )
  );
}

export default CandidatButton;
