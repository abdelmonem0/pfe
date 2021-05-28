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
} from "@material-ui/core";
import { Delete, EditRounded, MoreHoriz } from "@material-ui/icons";

function Comment(props) {
  const users = useSelector((state) => state.users);
  const { comment, removeComment, editComment } = props;
  const user = users.current;

  const [editDialog, setEdit] = useState(false);
  const [deleteDialog, setDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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
      <Card
        variant="outlined"
        style={{ margin: "0.2rem 0", padding: "0.5rem" }}
      >
        <div style={{ display: "flex" }}>
          <Typography variant="body1" style={{ fontWeight: "bold", flex: "1" }}>
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
                  <EditRounded color="primary" /> Modifier
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setDelete(true);
                    handleClose();
                  }}
                >
                  <Delete color="secondary" /> Supprimer
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {new Date(comment.date_commentaire).toLocaleString("fr-FR")}
        </Typography>
        <Typography variant="body2">{comment.text_commentaire}</Typography>
      </Card>
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
        <Typography>
          Dernière modification: {comment.date_commentaire}
        </Typography>
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
