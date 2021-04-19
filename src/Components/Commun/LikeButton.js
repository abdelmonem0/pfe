import React from "react";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { addLike } from "../../functions";

function LikeButton(props) {
  const current = props.current;
  const project = props.project;
  const dispatch = useDispatch();

  const canLike = current.role === "etudiant";

  const likes = useSelector((state) => state.likes);
  const liked = !likes
    ? false
    : likes.filter((like) => {
        return (
          like.id_sujet === project.id_sujet &&
          like.id_utilisateur === current.id_utilisateur
        );
      }).length > 0
    ? true
    : false;

  const likeProject = () => {
    addLike(project.id_sujet, current.id_utilisateur).then((result) =>
      dispatch({ type: "SET_LIKES", payload: result.data })
    );
  };

  return (
    canLike && (
      <IconButton size="small" onClick={() => likeProject()}>
        {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
      </IconButton>
    )
  );
}

export default LikeButton;
