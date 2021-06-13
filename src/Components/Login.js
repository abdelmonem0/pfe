import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Button,
  Typography,
} from "@material-ui/core";
import { Visibility, VisibilityOff, EmailOutlined } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../actions";
import { loginUser } from "../functions";
import { useHistory } from "react-router";
import LoginIcon from "../SVG/login.svg";
import Logo from "../SVG/transparent.png";

export function Home() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState({
    showPassword: false,
    forgotPassword: false,
    userId: "",
    password: "",
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.id]: event.target.value,
    });
  };

  const handleForgotPassword = () => {
    setValues({ ...values, forgotPassword: !values.forgotPassword });
  };

  const login = () => {
    history.replace("/");
    loginUser(values.userId, values.password)
      .then((result) => {
        if (result.data) {
          dispatch(setCurrentUser(result.data[0]));
          return result.data[0];
        }
      })
      .catch();
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: "4%",
      }}
    >
      <div className="col-sm-10 col-md-6">
        <div
          className="horizontal-list"
          style={{ paddingBottom: "4rem", alignItems: "flex-end" }}
        >
          <img src={Logo} style={{ maxWidth: "6rem" }} />
          <div className="vertical-list" style={{ gap: 0 }}>
            <Typography variant="h4" style={{ fontWeight: "bold" }}>
              PFE Manager
            </Typography>
            <Typography color="textSecondary">
              Application Web pour la gestion des Projets de Fin d'Études
            </Typography>
          </div>
        </div>
        <Paper
          elevation={10}
          style={{
            flex: "1 1 100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "1rem",
            gap: "1rem",
          }}
        >
          {!values.forgotPassword ? (
            <LoginForm
              values={values}
              handleClickShowPassword={handleClickShowPassword}
              login={login}
              onChange={onChange}
              handleForgotPassword={handleForgotPassword}
            />
          ) : (
            <ForgotPassword handleForgotPassword={handleForgotPassword} />
          )}
        </Paper>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <img style={{ maxWidth: "16rem" }} src={LoginIcon} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Home;

const LoginForm = (props) => {
  return (
    <>
      <TextField
        label="Identifiant ou email"
        variant="outlined"
        id="userId"
        onChange={props.onChange}
      />
      <TextField
        id="password"
        onChange={props.onChange}
        type={props.values.showPassword ? "text" : "password"}
        label="Mot de passe"
        variant="outlined"
        InputProps={{
          endAdornment: props.values.password.length > 0 && (
            <InputAdornment>
              <IconButton onClick={props.handleClickShowPassword}>
                {props.values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => props.login()}
      >
        Se connecter
      </Button>
      <div style={{ displa: "flex" }}>
        <Button
          variant="text"
          color="secondary"
          onClick={props.handleForgotPassword}
        >
          Mot de passe oublié?
        </Button>
      </div>
    </>
  );
};

const ForgotPassword = (props) => {
  return (
    <>
      <TextField
        label="Adresse e-mail"
        variant="outlined"
        color="primary"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <EmailOutlined />
            </InputAdornment>
          ),
        }}
      />
      <Button color="primary" variant="outlined">
        Envoyer
      </Button>
      <div>
        <Button onClick={props.handleForgotPassword}>Se connecter</Button>
      </div>
    </>
  );
};
