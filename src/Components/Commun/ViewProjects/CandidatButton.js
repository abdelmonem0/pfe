import { Button, IconButton, Tooltip } from "@material-ui/core";
import { AddRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddCandidature from "../../Etudiant/AddCandidature";
import { canCandidate, leftCandidaturesText } from "../Constraints";

function CandidatButton(props) {
  const { project, iconButton } = props;
  const [dialog, openDialog] = useState(false);
  const canCand = canCandidate(project);
  const current = useSelector((state) => state.users.current);
  const leftCandText =
    canCand.raison !== "" ? canCand.raison : leftCandidaturesText();

  const candidatures = useSelector((state) => state.candidatures);
  return (
    current.role === "etudiant" &&
    !current.sujet_affecte && (
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
