import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { File_States } from "../../Constants";
import { updateFileAndSendNotifications } from "./evaluateCahierLogic";

function EvaluateCahier(props) {
  const { file } = props;
  const current = useSelector((state) => state.users.current);
  const [dialog, setDialog] = useState(false);

  const handleUpdateFile = (decision) => {
    updateFileAndSendNotifications(file, decision);
    setDialog(false);
  };

  return (
    current.role === "president" &&
    (file.type === File_States.cahier_de_charge_en_instance ||
      file.type === File_States.cahier_de_charge_refuse ||
      file.type === File_States.cahier_de_charge_accepte) && (
      <div>
        <Dialog
          open={dialog}
          onClose={() => setDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Cahier de charge</DialogTitle>
          <DialogContent>
            <Typography>
              Prendre une décision pour ce cahier de charge
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => handleUpdateFile(true)}>
              Accepter
            </Button>

            <Button color="secondary" onClick={() => handleUpdateFile(false)}>
              Refuser
            </Button>

            <Button onClick={() => setDialog(false)}>Annuler</Button>
          </DialogActions>
        </Dialog>
        <Button
          size="small"
          variant="contained"
          color="primary"
          style={{ textTransform: "none" }}
          onClick={() => setDialog(true)}
        >
          {file.type === File_States.cahier_de_charge_en_instance
            ? "Decision"
            : "Modifier décision"}
        </Button>
      </div>
    )
  );
}

export default EvaluateCahier;
