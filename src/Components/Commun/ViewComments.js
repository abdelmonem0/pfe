import React, { useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  TextField,
  Dialog,
  Typography,
  useTheme,
} from "@material-ui/core";
import Comment from "./ViewProjects/Comment";
import { addComment, modifyComment, deleteComment } from "../../functions";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { Comment_Visibility, Project_States } from "../../Constants";

function ViewComments(props) {
  const project = props.project;
  const current = useSelector((state) => state.users.current);
  const comments = useSelector((state) => state.comments.comments)
    .filter((c) => c.id_sujet === project.id_sujet)
    .sort((a, b) => new Date(a) - new Date(b));
  const dispatch = useDispatch();
  const [values, setValues] = useState({ comment: "" });
  const [presidentComment, setPresidentComment] = useState("");
  const theme = useTheme();

  const sendComment = () => {
    const comment = {
      id_commentaire: uuid(),
      text_commentaire: values.comment,
      date_commentaire: new Date().toISOString().split(".")[0],
      id_utilisateur: current.id_utilisateur,
      id_sujet: project.id_sujet,
      visible_par:
        current.role !== "president"
          ? get_comment_visibility(project, current.role)
          : presidentComment,
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
    <div vlassName="vertical-list" style={{ gap: "1rem" }}>
      <div
        className="horizontal-list space-between"
        style={{
          position: "sticky",
          top: "0",
          backgroundColor: theme.palette.background.paper,
          padding: "0.5rem",
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
        <AddCommentButton
          presidentComment={presidentComment}
          setPresidentComment={setPresidentComment}
          sendComment={sendComment}
          current={current}
          values={values}
          setValues={setValues}
        />
      </div>
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
    </div>
  );
}

export default ViewComments;

export function get_comment_visibility(project, role) {
  var visibility = "";
  if (role === "etudiant")
    if (project.etat === Project_States.proposed_by_student_for_teacher)
      visibility = Comment_Visibility.student_and_teacher_private;
    else visibility = Comment_Visibility.proposing_and_president;

  if (role === "enseignant")
    if (project.etat === Project_States.proposed_by_student_for_teacher)
      visibility = Comment_Visibility.student_and_teacher_private;
    else visibility = Comment_Visibility.proposing_and_president;

  if (role === "membre") visibility = Comment_Visibility.membres_and_president;

  return visibility;
}

const AddCommentButton = (props) => {
  const {
    presidentComment,
    setPresidentComment,
    sendComment,
    current,
    values,
    setValues,
  } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Choisir la visibilitée du commentaire</DialogTitle>
        <DialogContent>
          <div className="horizontal-list space-between wrap">
            <div
              className="horizontal-list"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setPresidentComment(Comment_Visibility.membres_and_president)
              }
            >
              <Radio
                checked={
                  presidentComment === Comment_Visibility.membres_and_president
                }
              />
              <Typography>Visible par la commission</Typography>
            </div>
            <div
              className="horizontal-list"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setPresidentComment(Comment_Visibility.proposing_and_president)
              }
            >
              <Radio
                checked={
                  presidentComment ===
                  Comment_Visibility.proposing_and_president
                }
              />
              <Typography>
                Visible par la personne qui a proposé le sujet
              </Typography>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            disabled={
              presidentComment.length < 1 && current.role === "president"
            }
            color="primary"
            variant="contained"
            onClick={() => {
              sendComment();
              setValues({ ...values, comment: "" });
              setOpen(false);
            }}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        disabled={values.comment === ""}
        onClick={() => {
          if (current.role === "president") setOpen(true);
          else {
            sendComment();
            setValues({ ...values, comment: "" });
          }
        }}
        // onClick={() => {
        //   sendComment();
        //   setValues({ ...values, comment: "" });
        // }}
      >
        Ajouter
      </Button>
    </>
  );
};
