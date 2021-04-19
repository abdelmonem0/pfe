import React from "react";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import { Backdrop, Snackbar, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import MainDrawer from "./MainDrawer";
import { BrowserRouter as Router } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: "#fff",
  },
}));

function App() {
  const user = useSelector((state) => state.users.current);
  const classes = useStyles();
  const constants = useSelector((state) => state.constants);
  const dispatch = useDispatch();

  const closeSnackBar = () => {
    dispatch({ type: "CLOSE_SNACK" });
  };

  return (
    <Router>
      <Snackbar
        open={constants.snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackBar}
      >
        <Alert severity={constants.snackbar.type}>
          {constants.snackbar.message}
        </Alert>
      </Snackbar>
      <Backdrop className={classes.backdrop} open={constants.backdrop.open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MainDrawer />
    </Router>
  );
}

export default App;
