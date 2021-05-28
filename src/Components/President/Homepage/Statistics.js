import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Paper,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, PolarArea } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  calculateGeneral,
  calculateProjectsStatistics,
  calculateStudentsStatistics,
  calculateTeachersStatistics,
} from "./Calculations";

const useStyles = makeStyles((theme) => ({
  chart: {
    maxWidth: "33vw",
    flex: "1 1 22%",
    margin: "1rem",
    [theme.breakpoints.down("sm")]: {
      maxWidth: `90vw`,
      minWidth: `90vw`,
      margin: "0",
    },
  },
}));

function Statistics() {
  const projects = useSelector((state) => state.projects.dataArray);
  const theme = useTheme();
  const classes = useStyles();
  const [state, setState] = useState({});

  useEffect(() => {
    if (projects) {
      const _projects = calculateProjectsStatistics(theme);
      const _students = calculateStudentsStatistics(theme);
      const _general = calculateGeneral(theme);
      const _teachers = calculateTeachersStatistics(theme);
      setState({
        ...state,
        _projects,
        _general,
        _students,
        _teachers,
      });
    }
  }, []);
  return (
    (state._teachers && (
      <div
        className="horizontal-list"
        style={{ flex: "1", flexWrap: "wrap", justifyContent: "center" }}
      >
        <Typography variant="h5" style={{ flex: "1 1 100%" }}>
          Statistiques
        </Typography>
        <DialogChart>
          <div className={classes.chart}>
            <GeneralStatistics state={state._general} />
          </div>
        </DialogChart>
        <DialogChart>
          <div className={classes.chart}>
            <DoughnutChart state={state._projects} />
          </div>
        </DialogChart>
        <DialogChart>
          <div className={classes.chart}>
            <DoughnutChart state={state._students} />
          </div>
        </DialogChart>
        <DialogChart>
          <div className={classes.chart}>
            <DoughnutChart state={state._teachers.encadrants} />
          </div>
        </DialogChart>
        <DialogChart>
          <div className={classes.chart}>
            <DoughnutChart state={state._teachers.tags} />
          </div>
        </DialogChart>
        <DialogChart>
          <div className={classes.chart}>
            <DoughnutChart state={state._teachers.dates} />
          </div>
        </DialogChart>
      </div>
    )) ||
    null
  );
}

export default React.memo(Statistics);

const DoughnutChart = ({ state }) => {
  return (
    (state && (
      <div className="chart-animation">
        <Paper style={{ padding: "0.5rem" }} variant="outlined">
          <Typography variant="h6" gutterBottom>
            {state.title}
          </Typography>
          <Doughnut data={state.data} />
        </Paper>
      </div>
    )) ||
    null
  );
};

const GeneralStatistics = ({ state }) => {
  return (
    (state && (
      <Paper style={{ padding: "0.5rem" }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          {state.title}
        </Typography>
        <PolarArea data={state} />
      </Paper>
    )) ||
    null
  );
};

const DialogChart = (props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
          >
            Fermer
          </Button>
        </DialogActions>
        <DialogContent style={{ display: "flex", justifyContent: "center" }}>
          {props.children}
        </DialogContent>
      </Dialog>
      <div onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
        {props.children}
      </div>
    </>
  );
};
