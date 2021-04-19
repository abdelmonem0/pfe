import {
  Button,
  ButtonGroup,
  Hidden,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { acceptProject, getProjects } from "../../functions";
import MembreProjectActions from "../Membre/MembreProjectActions";

function PresidentProjectActions(props) {
  const project = props.project;
  const current = props.current;
  const dispatch = useDispatch();

  const [dialog, setDialog] = useState(false);
  const [decision, setDecision] = useState(undefined);
  const [decisionDialog, setDecisionDialog] = useState(false);

  function takeDecision(isAccepted) {
    acceptProject(
      project.id_sujet,
      isAccepted ? "accepté" : "refusé"
    ).then(() =>
      getProjects().then((result) =>
        dispatch({ type: "SET_PROJECTS", payload: result.data })
      )
    );
  }

  return (
    <>
      <Dialog
        open={decisionDialog}
        onClose={() => setDecisionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prendre une decision pour ce sujet</DialogTitle>
        <DialogContent>
          <DialogContentText>{project.titre}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              setDecision(true);
              setDialog(true);
            }}
          >
            Accepter
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setDecision(false);
              setDialog(true);
            }}
          >
            Refuser
          </Button>
          <Button onClick={() => setDecisionDialog(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialog} onClose={() => setDialog(false)}>
        <DialogTitle>{`Confirmer ${
          decision ? "l'acceptation" : "le refus"
        } du sujet`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment effectuer ce decision?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="secondary"
            onClick={() => setDialog(false)}
          >
            Annuler
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              takeDecision(decision);
              setDialog(false);
              setDecisionDialog(false)
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      {(project.etat != "accepté" && project.etat != "refusé") ||
      project.etat === null ? (
        <>
          <Hidden xsDown>
            <ButtonGroup size={props?.size || "medium"}>
              <Button
                color="primary"
                onClick={() => {
                  setDecision(true);
                  setDialog(true);
                }}
              >
                Accepter
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  setDecision(false);
                  setDialog(true);
                }}
              >
                Refuser
              </Button>
            </ButtonGroup>
          </Hidden>
          <Hidden smUp>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => setDecisionDialog(true)}
            >
              Decision
            </Button>
          </Hidden>
        </>
      ) : (
        <Typography
          style={{
            padding: "0.2rem 0.5rem",
            borderRadius: "3px",
            backgroundColor: project.etat === "accepté" ? "greenyellow" : "red",
            color: project.etat === "accepté" ? "black" : "white",
          }}
        >
          {project.etat}
        </Typography>
      )}
      <MembreProjectActions
        size={props?.size || "medium"}
        project={project}
        current={current}
      />
    </>
  );
}

export default PresidentProjectActions;
