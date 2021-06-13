import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import { Snackbar, Slide } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import MainDrawer from "./MainDrawer";
import { BrowserRouter as Router } from "react-router-dom";
import {
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
  makeStyles,
} from "@material-ui/core/styles";
import { frFR } from "@material-ui/core/locale";
import Loading from "./Components/Loading";
import ProjectDetail from "./Components/Commun/ProjectDetail";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function App() {
  const themeType = useSelector((state) => state.constants.theme) || "light";
  const constants = useSelector((state) => state.constants);
  const dispatch = useDispatch();

  const setThemeType = () => {
    dispatch({
      type: "SET_THEME",
      payload: themeType === "light" ? "dark" : "light",
    });
  };

  let theme = createMuiTheme(
    {
      palette: {
        type: themeType,
        primary: { main: themeType === "light" ? "#1976d2" : "#17b3cc" },
        secondary: { main: themeType === "light" ? "#ef6c00" : "#ff726f" },
        background: {
          paper: themeType === "light" ? "#f1f1f1" : "#393e46",
        },
      },
    },
    frFR
  );

  theme = responsiveFontSizes(theme);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: "CLOSE_SNACK" });
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {constants.backdrop.open && <Loading />}
        <Snackbar
          TransitionComponent={SlideTransition}
          key="snack"
          open={constants.snackbar.open}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            variant="filled"
            severity={constants.snackbar.type}
            onClose={handleClose}
          >
            {constants.snackbar.message}
          </Alert>
        </Snackbar>
        <ProjectDetail />
        {/* <Backdrop className={classes.backdrop} open={constants.backdrop.open}>
          <CircularProgress color="inherit" />
        </Backdrop> */}
        <MainDrawer themeType={themeType} setThemeType={setThemeType} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
