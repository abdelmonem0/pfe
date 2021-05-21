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
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { BorderColor, Create } from "@material-ui/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Project_States } from "../../Constants";
import { acceptProject, getProjects } from "../../functions";

function PresidentProjectActions(props) {
  const { project, iconButton } = props;
  const current = useSelector((state) => state.users.current);
  const dispatch = useDispatch();

  const [dialog, setDialog] = useState(false);
  const [decision, setDecision] = useState(undefined);
  const [decisionDialog, setDecisionDialog] = useState(false);

  function takeDecision(isAccepted) {
    acceptProject(
      project.id_sujet,
      isAccepted ? Project_States.accepted : Project_States.refused
    ).then(() =>
      getProjects().then((result) =>
        dispatch({ type: "SET_PROJECTS", payload: result.data })
      )
    );
  }

  return (
    project.etat !== Project_States.accepted &&
    current.role === "president" && (
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
            {project.etat !== Project_States.refused && (
              <Button
                color="secondary"
                onClick={() => {
                  setDecision(false);
                  setDialog(true);
                }}
              >
                Refuser
              </Button>
            )}
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
                setDecisionDialog(false);
              }}
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>

        {project.etat !== Project_States.refused ? (
          iconButton ? (
            <Tooltip title="Prendre decision">
              <IconButton size="small" onClick={() => setDecisionDialog(true)}>
                <Create />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Hidden xsDown>
                <ButtonGroup size="small">
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
          )
        ) : iconButton ? (
          <Tooltip title="Modifier la décision">
            <IconButton
              size="small"
              onClick={() => setDecisionDialog(true)}
              color="primary"
            >
              <BorderColor />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            style={{ textTransform: "none" }}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => setDecisionDialog(true)}
          >
            Modifier décision
          </Button>
        )}
      </>
    )
  );
}

export default PresidentProjectActions;
