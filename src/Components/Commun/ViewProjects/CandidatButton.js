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
  const student =
    useSelector((state) => state.users.current.role) === "etudiant";
  const leftCandText = leftCandidaturesText();

  const candidatures = useSelector((state) => state.candidatures);
  return (
    student &&
    canCand && (
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
              onClick={() => {
                openDialog(true);
              }}
            >
              <AddRounded />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disableElevation
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
