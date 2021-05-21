import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { Warning } from "@material-ui/icons";
import React, { useState } from "react";

function ConfirmDialog(props) {
  const { title, body, onConfirm } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          if (!open) setOpen(true);
        }}
      >
        {props.children}
      </div>

      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          <div className="horizontal-list">
            <Warning />
            <Typography variant="h6">{title}</Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography>{body}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfirmDialog;
