import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions,
  useTheme,
} from "@material-ui/core";
import React from "react";

const Feedback = (props) => {
  const { assignedTeachers, showFeedback, setShowFeedback } = props;
  const missing = assignedTeachers.map((el) => el.missing);
  const theme = useTheme();

  const handleClose = () => {
    setShowFeedback(false);
  };
  return (
    <Dialog open={showFeedback} maxWidth="md" fullWidth onClose={handleClose}>
      <DialogTitle>Feedback</DialogTitle>
      <DialogContent>
        <Typography
          variant="h6"
          style={{
            color:
              missing.filter((m) => m.indexOf(1) > -1).length > 0
                ? theme.palette.warning.main
                : theme.palette.success.main,
          }}
        >
          {missing.filter((m) => m.indexOf(1) > -1).length > 0
            ? missing.filter((m) => m.indexOf(1) > -1).length +
              " soutenances sans président"
            : "Tout les soutenances ont eu des presidents avec succès."}
        </Typography>
        <Typography
          variant="h6"
          style={{
            color:
              missing.filter((m) => m.indexOf(2) > -1).length > 0
                ? theme.palette.warning.main
                : theme.palette.success.main,
          }}
        >
          {missing.filter((m) => m.indexOf(2) > -1).length > 0
            ? missing.filter((m) => m.indexOf(2) > -1).length +
              " soutenances sans rapporteur"
            : "Tout les soutenances ont eu des rapporteurs avec succès."}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={handleClose}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Feedback;
