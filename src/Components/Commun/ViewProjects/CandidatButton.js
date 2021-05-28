import { Button, IconButton, Tooltip } from "@material-ui/core";
import { AddRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddCandidature from "../../Etudiant/AddCandidature";
import { canCandidate, leftCandidaturesText } from "../Constraints";

function proposed_by_current_user(project, current) {
  return (
    project.id_etudiant === current.id_utilisateur ||
    project.id_etudiant_2 === current.id_utilisateur
  );
}

function CandidatButton(props) {
  const { project, iconButton } = props;
  const [dialog, openDialog] = useState(false);
  const current = useSelector((state) => state.users.current);
  const canCand = canCandidate(project, current);
  const leftCandText =
    canCand.raison !== "" ? canCand.raison : leftCandidaturesText();
  return (
    current.role === "etudiant" &&
    !current.sujet_affecte &&
    !proposed_by_current_user(project, current) && (
      <Tooltip title={leftCandText}>
        <div>
          <AddCandidature
            project={project}
            dialog={dialog}
            openDialog={openDialog}
          />
          {iconButton ? (
            <IconButton
              size="small"
              color="primary"
              disabled={!canCand.canCandidate}
              onClick={() => {
                openDialog(true);
              }}
            >
              <AddRounded />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              size="small"
              color="primary"
              disableElevation
              disabled={!canCand.canCandidate}
              onClick={() => {
                openDialog(true);
              }}
            >
              Postuler
            </Button>
          )}
        </div>
      </Tooltip>
    )
  );
}

export default CandidatButton;
