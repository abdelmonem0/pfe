import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  Card,
  TextField,
  Typography,
  Paper,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Delete, EditRounded, MoreHoriz } from "@material-ui/icons";
import { get_comment_visibility } from "../ViewComments";
import { getProjectByID } from "../../Enseignant/Candidatures/logic";
import { Comment_Visibility } from "../../../Constants";

function Comment(props) {
  const users = useSelector((state) => state.users);
  const { comment, removeComment, editComment } = props;
  const user = users.current;

  const [editDialog, setEdit] = useState(false);
  const [deleteDialog, setDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const project = getProjectByID(comment.id_sujet);

  const visibility = project
    ? get_comment_visibility(project, user.role)
    : Comment_Visibility.candidature;

  function getUser(id) {
    return users.all.find((u) => u.id_utilisateur === id);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    // visibility === comment.visible_par ||
    // (user.role === "president" &&
    //   (comment.visible_par === Comment_Visibility.proposing_and_president ||
    //     comment.visible_par === Comment_Visibility.membres_and_president) && (
    <React.Fragment key={comment.id_commentaire}>
      <Dialog
        open={editDialog}
        onClose={() => setEdit(false)}
        maxWidth="md"
        fullWidth
      >
        <Edit editComment={editComment} comment={comment} close={setEdit} />
      </Dialog>
      <Dialog open={deleteDialog} onClose={() => setDelete(false)}>
        <DeleteComment
          removeComment={removeComment}
          comment={comment}
          close={setDelete}
        />
      </Dialog>
      <div style={{ margin: "0.2rem 0" }}>
        <Paper variant="outlined">
          <div
            className="horizontal-list space-between"
            style={{ alignItems: "flext-start" }}
          >
            <Typography
              style={{
                fontWeight: "bold",
                paddingLeft: "0.4rem",
                paddingTop: "0.2rem",
              }}
              variant="body2"
            >
              {getUser(comment.id_utilisateur).nom}
            </Typography>
            {user.id_utilisateur == comment.id_utilisateur && (
              <div>
                <IconButton size="small" onClick={handleClick}>
                  <MoreHoriz />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      setEdit(true);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <EditRounded color="primary" />{" "}
                    </ListItemIcon>
                    <ListItemText primary="Modifier" />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setDelete(true);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <Delete color="secondary" />{" "}
                    </ListItemIcon>
                    <ListItemText primary="Supprimer" />
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>

          <Typography
            style={{ paddingLeft: "0.5rem", paddingBottom: "0.1rem" }}
            variant="subtitle2"
          >
            {comment.text_commentaire}
          </Typography>
        </Paper>

        <Typography style={{ fontSize: "12px" }} color="textSecondary">
          {new Date(comment.date_commentaire).toLocaleString("fr-FR")}
        </Typography>
      </div>
    </React.Fragment>
  );
}

export default Comment;

const Edit = (props) => {
  const { comment, editComment, close } = props;
  const lastComment = comment.text_commentaire;
  const [newComment, setNewComment] = useState(lastComment);
  return (
    <Paper
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div>
        <Typography variant="h5">Modifier le commentaire</Typography>
      </div>
      <TextField
        value={newComment}
        variant="outlined"
        multiline
        fullWidth
        onChange={(e) => setNewComment(e.target.value)}
      />
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            editComment({
              ...comment,
              text_commentaire: newComment,
            });
            close(false);
          }}
        >
          Enregistrer
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => close(false)}
        >
          Annuler
        </Button>
      </div>
    </Paper>
  );
};

const DeleteComment = (props) => {
  const { removeComment, comment, close } = props;
  return (
    <Paper
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Typography variant="h5">Supprimer le commentaire?</Typography>
      <div style={{ display: "flex", display: "flex", gap: "1rem" }}>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => {
            removeComment(comment.id_commentaire);
            close(false);
          }}
        >
          Supprimer
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => close(false)}
        >
          Anuuler
        </Button>
      </div>
    </Paper>
  );
};
