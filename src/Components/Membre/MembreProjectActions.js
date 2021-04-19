import React from "react";
import { ButtonGroup, Tooltip, Button } from "@material-ui/core";
import { ThumbUp, ThumbDown } from "@material-ui/icons";
import { addAvis, getProjects } from "../../functions";
import { useDispatch } from "react-redux";

function MembreProjectActions(props) {
  const project = props.project;
  const current = props.current;
  const dispatch = useDispatch();

  const getAvis = (isPositive) => {
    return project.avis.filter((avis) => {
      return avis.avis_favorable == isPositive;
    }).length;
  };

  const currentUserAvis = () => {
    var userAvis = project.avis.filter((avis) => {
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
      getProjects().then((result) =>
        dispatch({ type: "SET_PROJECTS", payload: result.data })
      )
    );
  };

  return (
    <ButtonGroup size={props?.size || "medium"} color="primary">
      <Tooltip title="Avis positif">
        <Button
          color={userAvis === 1 ? "primary" : "default"}
          startIcon={<ThumbUp />}
          onClick={() => handleClick(true)}
        >
          {getAvis(true)}
        </Button>
      </Tooltip>
      <Tooltip title="Avis négatif">
        <Button
          color={userAvis === -1 ? "primary" : "default"}
          startIcon={<ThumbDown />}
          onClick={() => handleClick(false)}
        >
          {getAvis(false)}
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
}

export default MembreProjectActions;
