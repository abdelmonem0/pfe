import { React, useEffect, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import axios from "axios";

function EditProfile() {
  const user = useSelector((state) => state.users.current);
  const [values, setValues] = useState({
    visible: false,
    ok: false,
    ancient: "",
    newPassword: "",
    repeatPassword: "",
  });

  const onChange = (event) => {
    setValues((values) => ({
      ...values,
      [event.target.id]: event.target.value,
    }));
    console.log([event.target.id] + " -- " + event.target.value);
  };

  const onClick = () => {
    axios.post("http://localhost:5000/api/public/change-password", {
      user: user.id_utilisateur,
      password: values.newPassword,
    });
  };

  useEffect(() => {
    console.log("updating");
    values.newPassword.length > 0 &&
    values.repeatPassword === values.newPassword
      ? setValues((values) => ({ ...values, ok: true }))
      : setValues((values) => ({ ...values, ok: false }));
  }, [values.newPassword, values.repeatPassword]);

  return (
    <div className="vertical-list" style={{ flex: "1" }}>
      <Typography variant="h4">Profile</Typography>
      <TextField
        variant="outlined"
        disabled
        fullWidth
        label="Nom"
        value={user.nom}
      />
      <TextField
        variant="outlined"
        disabled
        fullWidth
        label="Email"
        value={user.email}
      />
      <Typography>Changer mot de passe:</Typography>
      <TextField
        onChange={onChange}
        variant="outlined"
        fullWidth
        label="Ancient mot de passe"
        type={values.visible ? "text" : "password"}
        id="ancient"
        InputProps={{
          endAdornment: values.ancient.length > 0 && (
            <InputAdornment>
              <IconButton
                onClick={() =>
                  setValues({ ...values, visible: !values.visible })
                }
              >
                {values.visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        onChange={onChange}
        variant="outlined"
        fullWidth
        id="newPassword"
        label="Nouveau mot de passe"
        type={values.visible ? "text" : "password"}
        InputProps={{
          endAdornment: values.newPassword.length > 0 && (
            <InputAdornment>
              <IconButton
                onClick={() =>
                  setValues({ ...values, visible: !values.visible })
                }
              >
                {values.visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        onChange={onChange}
        variant="outlined"
        fullWidth
        id="repeatPassword"
        label="Repeter mot de passe"
        type="password"
        type={values.visible ? "text" : "password"}
        InputProps={{
          endAdornment: values.repeatPassword.length > 0 && (
            <InputAdornment>
              <IconButton
                onClick={() =>
                  setValues({ ...values, visible: !values.visible })
                }
              >
                {values.visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        disabled={values.ok ? false : true}
        variant="contained"
        color="primary"
        onClick={() => {}}
      >
        Enregistrer
      </Button>
    </div>
  );
}

export default EditProfile;
