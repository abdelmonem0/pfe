import React from "react";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { IconButton, useTheme } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { addLike } from "../../functions";

function LikeButton(props) {
  const project = props.project;
  const dispatch = useDispatch();
  const current = useSelector((state) => state.users.current);
  const canLike = current.role === "etudiant" && project.affecte_a.length < 1;
  const theme = useTheme();

  const likes = useSelector((state) => state.likes);
  const liked =
    likes.filter((like) => {
      return (
        like.id_sujet === project.id_sujet &&
        like.id_utilisateur === current.id_utilisateur
      );
    }).length > 0;

  const likeProject = () => {
    addLike(project.id_sujet, current.id_utilisateur).then((result) =>
      dispatch({ type: "SET_LIKES", payload: result.data })
    );
  };

  return (
    canLike && (
      <IconButton size="small" onClick={() => likeProject()}>
        {liked ? (
          <Favorite style={{ color: theme.palette.secondary.main }} />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>
    )
  );
}

export default LikeButton;
