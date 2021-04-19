import React, { useState } from "react";
import { Paper, Button, TextField } from "@material-ui/core";
import Comment from "./ViewProjects/Comment";
import {
  addComment,
  getProjects,
  modifyComment,
  deleteComment,
} from "../../functions";
import { useDispatch, useSelector } from "react-redux";
import { sendCommentNotifications } from "../../Notifications";

function ViewComments(props) {
  const project = props.project;
  const current = useSelector((state) => state.users.current);
  const dispatch = useDispatch();
  const [values, setValues] = useState({ comment: "" });

  const sendComment = () => {
    addComment(current.id_utilisateur, project.id_sujet, values.comment).then(
      () =>
        getProjects().then((result) => {
          sendCommentNotifications(current, project).catch((err) =>
            console.error(err)
          );
          dispatch({ type: "SET_PROJECTS", payload: result.data });
        })
    );
  };

  const removeComment = (id_commentaire) => {
    deleteComment(id_commentaire).then(() =>
      getProjects().then((result) =>
        dispatch({ type: "SET_PROJECTS", payload: result.data })
      )
    );
  };

  const editComment = (id_commentaire, commentaire) => {
    modifyComment(id_commentaire, commentaire).then(() =>
      getProjects().then((result) =>
        dispatch({ type: "SET_PROJECTS", payload: result.data })
      )
    );
  };

  return (
    <Paper elevation={0}>
      <Paper
        elevation={0}
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "end",
          justifyContent: "space-between",
        }}
      >
        <TextField
          value={values.comment}
          multiline
          variant="outlined"
          size="small"
          label="Ajouter un commentaire"
          fullWidth
          onChange={(e) => setValues({ ...values, comment: e.target.value })}
        />
        <Button
          variant="outlined"
          color="primary"
          size="small"
          disabled={values.comment === ""}
          onClick={() => {
            sendComment();
            setValues({ ...values, comment: "" });
          }}
        >
          Ajouter
        </Button>
      </Paper>
      <Paper elevation={0}>
        {project.commentaires &&
          project.commentaires.map((comment) => (
            <Comment
              key={comment.id_commentaire}
              comment={comment}
              removeComment={removeComment}
              editComment={editComment}
            />
          ))}
      </Paper>
    </Paper>
  );
}

export default ViewComments;
