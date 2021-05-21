import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Hidden,
} from "@material-ui/core";
import { Attachment } from "@material-ui/icons";
import React, { useState } from "react";
import AttachedFiles from "../AttachedFiles";
import { canViewAttachement } from "../Constraints";

function AttachementButton(props) {
  const { project, icon } = props;
  const [dialog, openDialog] = useState(false);

  return (
    canViewAttachement(project) && (
      <div>
        <Dialog
          open={dialog}
          onClose={() => openDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Attachement</DialogTitle>
          <DialogContent>
            <Typography paragraph>{project.titre}</Typography>
            <AttachedFiles project={project} />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => openDialog(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {icon ? (
          <Tooltip title="Contient des fichiers">
            <IconButton onClick={() => openDialog(true)} size="small">
              <Attachment />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Hidden smDown>
              <Button
                style={{ textTransform: "none" }}
                color="primary"
                variant="outlined"
                onClick={() => openDialog(true)}
                size="small"
              >
                Fichiers
              </Button>
            </Hidden>
            <Hidden mdUp>
              <IconButton onClick={() => openDialog(true)} size="small">
                <Attachment />
              </IconButton>
            </Hidden>
          </>
        )}
      </div>
    )
  );
}

export default AttachementButton;
