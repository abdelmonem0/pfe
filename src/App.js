import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import { Backdrop, Snackbar, CircularProgress, Slide } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: "#fff",
  },
}));

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function App() {
  const [themeType, setThemeType] = useState("light");
  const classes = useStyles();
  const constants = useSelector((state) => state.constants);
  const dispatch = useDispatch();

  let theme = createMuiTheme(
    {
      palette: {
        type: themeType,
        primary: { main: themeType === "light" ? "#1976d2" : "#ab47bc" },
        secondary: { main: themeType === "light" ? "#ef6c00" : "#ef6c00" },
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
        <Backdrop className={classes.backdrop} open={constants.backdrop.open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <MainDrawer themeType={themeType} setThemeType={setThemeType} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
