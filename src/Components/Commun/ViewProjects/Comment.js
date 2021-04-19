import { React, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Button,
  Dialog,
  Card,
  TextField,
  Typography,
  Paper,
  MenuItem,
  CardContent,
  IconButton,
  Menu,
} from "@material-ui/core";
import { Delete, EditRounded, MoreHoriz } from "@material-ui/icons";

function Comment(props) {
  const users = useSelector((state) => state.users);
  const comment = props.comment;
  const user = users.current;
  const dispatch = useDispatch();

  const [editDialog, setEdit] = useState(false);
  const [deleteDialog, setDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  function getUser(id) {
    var user = null;
    var BreakException = {};
    try {
      users.all.forEach((element) => {
        if (element.id_utilisateur === id) {
          user = element;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return user;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Dialog
        open={editDialog}
        onClose={() => setEdit(false)}
        maxWidth="sm"
        fullWidth
      >
        <Edit
          editComment={props.editComment}
          comment={comment}
          close={setEdit}
        />
      </Dialog>
      <Dialog open={deleteDialog} onClose={() => setDelete(false)}>
        <DeleteComment
          removeComment={props.removeComment}
          comment={comment}
          close={setDelete}
        />
      </Dialog>
      <Card
        variant="outlined"
        style={{ margin: "0.2rem 0", padding: "0.5rem" }}
        key={props.key}
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
          {comment.date_commentaire}
        </Typography>
        <Typography variant="body2">{comment.text_commentaire}</Typography>
      </Card>
    </>
  );
}

export default Comment;

const Edit = (props) => {
  const lastComment = props.comment.text_commentaire;
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
          Dernière modification: {props.comment.date_commentaire}
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
            props.editComment(props.comment.id_commentaire, newComment);
            props.close(false);
          }}
        >
          Enregistrer
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => props.close(false)}
        >
          Annuler
        </Button>
      </div>
    </Paper>
  );
};

const DeleteComment = (props) => {
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
            props.removeComment(props.comment.id_commentaire);
            props.close(false);
          }}
        >
          Supprimer
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => props.close(false)}
        >
          Anuuler
        </Button>
      </div>
    </Paper>
  );
};
