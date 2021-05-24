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
import { useDispatch, useSelector } from "react-redux";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import axios from "axios";
import { updatePassword } from "../../functions";

function EditProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.current);
  const [values, setValues] = useState({
    visible: false,
    ok: false,
    current_password: "",
    new_password: "",
    repeated_new_password: "",
  });

  const onChange = (event) => {
    setValues((values) => ({
      ...values,
      [event.target.id]: event.target.value,
    }));
    console.log([event.target.id] + " -- " + event.target.value);
  };

  const update = () => {
    updatePassword({
      id_utilisateur: user.id_utilisateur,
      current_password: values.current_password,
      new_password: values.new_password,
    })
      .then((result) => {
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            message: result.data,
            type: result.status === 200 ? "success" : "error",
          },
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    values.new_password.length > 0 &&
    values.repeated_new_password === values.new_password
      ? setValues((values) => ({ ...values, ok: true }))
      : setValues((values) => ({ ...values, ok: false }));
  }, [values.new_password, values.repeated_new_password]);

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
        id="current_password"
        InputProps={{
          endAdornment: values.current_password.length > 0 && (
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
        id="new_password"
        label="Nouveau mot de passe"
        type={values.visible ? "text" : "password"}
        InputProps={{
          endAdornment: values.new_password.length > 0 && (
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
        id="repeated_new_password"
        label="Repeter mot de passe"
        type="password"
        type={values.visible ? "text" : "password"}
        InputProps={{
          endAdornment: values.repeated_new_password.length > 0 && (
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
        onClick={update}
      >
        Enregistrer
      </Button>
    </div>
  );
}

export default EditProfile;
