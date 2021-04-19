import { React } from "react";
import { ButtonGroup, Button } from "@material-ui/core";
import {
  ThumbDown,
  ThumbUp,
  Schedule,
  CommentRounded,
} from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'

export function Enseignant(props) {
    const user = useSelector((state) => state.users.current);
    const dispatch = useDispatch();
  
    function addRating(_rating, project, id_rating) {
      const rating = {
        id_utilisateur: user.id_utilisateur,
        id_sujet: project,
        avis_favorable: _rating,
        id_avis: id_rating,
      };
      axios
        .post("http://localhost:5000/api/public/add-rating", rating)
        .then((result) =>
          dispatch({ type: "GET_PROJECTS", payload: result.data })
        );
    }
  function sendRating(project, id_utilisateur, likePressed) {
    var _rating = null;
    var id_rating = null;
    var done = false;
    project.avis.forEach((element) => {
      if (element.id_membre === id_utilisateur) {
        switch (element.avis_favorable) {
          case 1:
            if (likePressed) _rating = null;
            else _rating = false;
            break;
          case 0:
            if (!likePressed) _rating = null;
            else _rating = true;
            break;
          default:
            _rating = likePressed ? true : false;
            break;
        }
        console.log("found  " + _rating);
        id_rating = element.id_avis;
        addRating(_rating, project.id_sujet, id_rating);
        done = true;
      }
    });
    if (done) return;
    _rating = likePressed ? true : false;
    addRating(_rating, project.id_sujet, id_rating);
  }

  function getRatingsCount(ratings, liked) {
    var i = 0;
    if (!ratings) return null;
    ratings.forEach((element) => {
      if (element.avis_favorable == liked) i++;
    });
    return i;
  }
  function userReacted(ratings, id_utilisateur, likeButton) {
    var color = "black";
    for (let element of ratings) {
      if (element.id_membre === id_utilisateur) {
        switch (element.avis_favorable) {
          case 1:
            if (likeButton) color = "green";
            break;
          case 0:
            if (!likeButton) color = "red";
            break;
          default:
            color = "black";
            break;
        }
        break;
      }
    }
    return color;
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Button disabled startIcon={<Schedule />}>
        {props.project.date_creation.substring(
          props.project.date_creation.indexOf("-") + 1,
          props.project.date_creation.indexOf("T")
        )}
      </Button>
      <ButtonGroup
        disableElevation
        size="small"
        color="default"
        variant="outlined"
      >
        <Button
          size="small"
          endIcon={<ThumbUp />}
          onClick={() =>
            sendRating(props.project, user.id_utilisateur, true)
          }
          style={{
            color: userReacted(
              props.project.avis,
              user.id_utilisateur,
              true
            ),
          }}
        >
          {getRatingsCount(props.project.avis, true)}
        </Button>
        <Button
          size="small"
          endIcon={<ThumbDown />}
          onClick={() =>
            sendRating(props.project, user.id_utilisateur, false)
          }
          style={{
            color: userReacted(
              props.project.avis,
              user.id_utilisateur,
              false
            ),
          }}
        >
          {getRatingsCount(props.project.avis, false)}
        </Button>
        <Button
          style={{ textTransform: "none" }}
          startIcon={<CommentRounded />}
          color="primary"
          onClick={() => props.expand(props.project)}
        >
          {props.project.commentaires.length}
        </Button>
      </ButtonGroup>
    </div>
  );
}

