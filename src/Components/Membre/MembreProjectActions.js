import React, { useEffect, useState } from "react";
import {
  ButtonGroup,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import { ThumbUp, ThumbDown } from "@material-ui/icons";
import { addAvis, getAvis } from "../../functions";
import { useDispatch, useSelector } from "react-redux";
import { Project_States } from "../../Constants";

function MembreProjectActions(props) {
  const { project, iconButton } = props;
  const [dialog, openDialog] = useState(false);
  const current = useSelector((state) => state.users.current);
  const projectAvis = useSelector((state) => state.avis).filter(
    (a) => a.id_sujet === project.id_sujet
  );
  const dispatch = useDispatch();

  const defineAvis = (isPositive) => {
    return projectAvis.filter((avis) => avis.avis_favorable == isPositive)
      .length;
  };

  const currentUserAvis = () => {
    var userAvis = projectAvis.filter((avis) => {
      return avis.id_utilisateur === current.id_utilisateur;
    });
    userAvis = userAvis.length === 0 ? 0 : userAvis[0].avis_favorable ? 1 : -1;
    return userAvis;
  };

  const userAvis = currentUserAvis();

  const handleClick = (isPositive) => {
    const _delete =
      userAvis === 1 && isPositive
        ? true
        : userAvis === -1 && !isPositive
        ? true
        : false;
    addAvis(
      current.id_utilisateur,
      project.id_sujet,
      isPositive,
      _delete
    ).then(() =>
      getAvis().then((result) =>
        dispatch({ type: "SET_AVIS", payload: result.data })
      )
    );
  };

  return (
    (current.role === "membre" || current.role === "president") && (
      <>
        <Dialog
          open={dialog}
          onClose={() => openDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Avis</DialogTitle>
          <DialogActions>
            <ButtonGroup size={props?.size || "medium"} color="primary">
              <Tooltip title="Avis positif">
                <Button
                  color={userAvis === 1 ? "primary" : "default"}
                  startIcon={<ThumbUp />}
                  onClick={() => handleClick(true)}
                >
                  {defineAvis(true)}
                </Button>
              </Tooltip>
              <Tooltip title="Avis négatif">
                <Button
                  color={userAvis === -1 ? "primary" : "default"}
                  startIcon={<ThumbDown />}
                  onClick={() => handleClick(false)}
                >
                  {defineAvis(false)}
                </Button>
              </Tooltip>
            </ButtonGroup>
            <div style={{ flex: "1" }} />
            <Button color="secondary" onClick={() => openDialog(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
        {iconButton ? (
          <Tooltip title={`👍 ${defineAvis(true)} 👎 ${defineAvis(false)}`}>
            <div>
              <IconButton
                size="small"
                onClick={() => openDialog(true)}
                disabled={project.etat === Project_States.accepted}
                color={
                  currentUserAvis() === 1
                    ? "primary"
                    : currentUserAvis() === -1
                    ? "secondary"
                    : "default"
                }
              >
                {currentUserAvis() === -1 ? <ThumbDown /> : <ThumbUp />}
              </IconButton>
            </div>
          </Tooltip>
        ) : (
          <ButtonGroup
            size={props?.size || "medium"}
            color="primary"
            disabled={project.etat === Project_States.accepted}
          >
            <Tooltip title="Avis positif">
              <Button
                color={userAvis === 1 ? "primary" : "default"}
                startIcon={<ThumbUp />}
                onClick={() => handleClick(true)}
              >
                {defineAvis(true)}
              </Button>
            </Tooltip>
            <Tooltip title="Avis négatif">
              <Button
                color={userAvis === -1 ? "primary" : "default"}
                startIcon={<ThumbDown />}
                onClick={() => handleClick(false)}
              >
                {defineAvis(false)}
              </Button>
            </Tooltip>
          </ButtonGroup>
        )}
      </>
    )
  );
}

export default MembreProjectActions;

//dispatch({ type: "UPDATE_AVIS", payload: {id_sujet: project.id_sujet, id_utilisateur: current.id_utilisateur, isPositive, _delete} })
