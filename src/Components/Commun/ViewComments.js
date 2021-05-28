import React, { useState } from "react";
import { Paper, Button, TextField } from "@material-ui/core";
import Comment from "./ViewProjects/Comment";
import { addComment, modifyComment, deleteComment } from "../../functions";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { sendCommentNotifications } from "../../Notifications";

function ViewComments(props) {
  const project = props.project;
  const current = useSelector((state) => state.users.current);
  const comments = useSelector((state) => state.comments.comments)
    .filter((c) => c.id_sujet === project.id_sujet)
    .sort((a, b) => new Date(a) - new Date(b));
  const dispatch = useDispatch();
  const [values, setValues] = useState({ comment: "" });

  const sendComment = () => {
    const comment = {
      id_commentaire: uuid(),
      text_commentaire: values.comment,
      date_commentaire: new Date().toISOString().split(".")[0],
      id_utilisateur: current.id_utilisateur,
      id_sujet: project.id_sujet,
    };
    addComment(comment).then(() =>
      dispatch({
        type: "ADD_COMMENT",
        payload: comment,
      })
    );
  };

  const removeComment = (id_commentaire) => {
    deleteComment(id_commentaire)
      .then(() => dispatch({ type: "DELETE_COMMENT", payload: id_commentaire }))
      .catch((err) => console.error(err));
  };

  const editComment = (comment) => {
    modifyComment(comment)
      .then(() => dispatch({ type: "UPDATE_COMMENT", payload: comment }))
      .catch((err) => console.error(err));
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
        {comments &&
          comments.map((comment, index) => (
            <React.Fragment key={index}>
              <Comment
                comment={comment}
                removeComment={removeComment}
                editComment={editComment}
              />
            </React.Fragment>
          ))}
      </Paper>
    </Paper>
  );
}

export default ViewComments;
