import React, { useState } from "react";
import {
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Box,
  Hidden,
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
    addAvis(current.id_utilisateur, project.id_sujet, isPositive, _delete).then(
      () =>
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
            <>
              <Tooltip title="Avis positif">
                <Box>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={project.etat === Project_States.accepted}
                    color={userAvis === 1 ? "primary" : "default"}
                    startIcon={<ThumbUp />}
                    onClick={() => handleClick(true)}
                  >
                    {defineAvis(true)}
                  </Button>
                </Box>
              </Tooltip>
              <Tooltip title="Avis négatif">
                <Box>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={project.etat === Project_States.accepted}
                    color={userAvis === -1 ? "primary" : "default"}
                    startIcon={<ThumbDown />}
                    onClick={() => handleClick(false)}
                  >
                    {defineAvis(false)}
                  </Button>
                </Box>
              </Tooltip>
            </>
            <Box style={{ flex: "1" }} />
            <Button color="secondary" onClick={() => openDialog(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
        {iconButton ? (
          <Tooltip title={`👍 ${defineAvis(true)} 👎 ${defineAvis(false)}`}>
            <Box>
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
            </Box>
          </Tooltip>
        ) : (
          <>
            <Hidden smDown>
              <Tooltip title="Avis positif">
                <Box>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={project.etat === Project_States.accepted}
                    color={userAvis === 1 ? "primary" : "default"}
                    startIcon={<ThumbUp />}
                    onClick={() => handleClick(true)}
                  >
                    {defineAvis(true)}
                  </Button>
                </Box>
              </Tooltip>
              <Tooltip title="Avis négatif">
                <Box>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={project.etat === Project_States.accepted}
                    color={userAvis === -1 ? "primary" : "default"}
                    startIcon={<ThumbDown />}
                    onClick={() => handleClick(false)}
                  >
                    {defineAvis(false)}
                  </Button>
                </Box>
              </Tooltip>
            </Hidden>
            <Hidden mdUp>
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
            </Hidden>
          </>
        )}
      </>
    )
  );
}

export default MembreProjectActions;

//dispatch({ type: "UPDATE_AVIS", payload: {id_sujet: project.id_sujet, id_utilisateur: current.id_utilisateur, isPositive, _delete} })
