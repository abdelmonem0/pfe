import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Button, Paper, Typography, useTheme } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { saveDates } from "../../../functions";

const initialValues = {
  soutenanceStart: new Date(),
  soutenanceEnd: new Date(),
  techniqueStart: new Date(),
  techniqueEnd: new Date(),
  controleStart: new Date(),
  controleEnd: new Date(),
  rapportStart: new Date(),
  rapportEnd: new Date(),
  rapportNumericStart: new Date(),
  rapportNumericEnd: new Date(),
};

function load_saved_dates(savedDates) {
  var temp = { ...initialValues };
  for (let key of Object.keys(initialValues))
    temp = { ...temp, [key]: savedDates[key] || new Date() };

  return temp;
}

export default function Dates() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const savedDates = useSelector((state) => state.savedDates) || {};
  const [values, setValues] = React.useState(load_saved_dates(savedDates));

  const handleDateChange = (date, valueProperty) => {
    setValues({ ...values, [valueProperty]: date });
  };

  const saveDate = (startKey, endKey) => {
    saveDates([
      [startKey, new Date(values[startKey])],
      [endKey, new Date(values[endKey])],
    ])
      .then(() => {
        dispatch({
          type: "SET_SINGLE_DATE",
          payload: [
            { key: startKey, value: values[startKey] },
            { key: endKey, value: values[endKey] },
          ],
        });
        dispatch({
          type: "OPEN_SNACK",
          payload: { message: "EnregistrĂ©", type: "success" },
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="vertical-list" style={{ flex: 1 }}>
      <Typography variant="h4" paragraph>
        Dates
      </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Paper style={{ padding: "0.5rem" }}>
          <div className="horizontal-list space-between wrap">
            <div className="horizontal-list">
              <Typography variant="h6" color="primary" gutterBottom>
                Soutenances
              </Typography>
              {savedDates.soutenanceStart && savedDates.soutenanceEnd && (
                <Typography
                  gutterBottom
                  style={{ color: theme.palette.success.main }}
                >
                  enrĂ©gistrĂ©s
                </Typography>
              )}
            </div>
            <Button
              variant="outlined"
              color="primary"
              style={{ textTransform: "none" }}
              onClick={() => saveDate("soutenanceStart", "soutenanceEnd")}
            >
              Enregistrer
            </Button>
          </div>
          <div className="horizontal-list wrap space-between">
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="DĂ©but des soutenances"
                label="DĂ©but des soutenances"
                value={values.soutenanceStart}
                onChange={(date) => handleDateChange(date, "soutenanceStart")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="Fin des soutenances"
                label="Fin des soutenances"
                value={values.soutenanceEnd}
                onChange={(date) => handleDateChange(date, "soutenanceEnd")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
          </div>
        </Paper>
        <Paper style={{ padding: "0.5rem" }}>
          <div className="horizontal-list space-between wrap">
            <div className="horizontal-list">
              <Typography variant="h6" color="primary" gutterBottom>
                Soutenances techniques
              </Typography>
              {savedDates.techniqueStart && savedDates.techniqueEnd && (
                <Typography
                  gutterBottom
                  style={{ color: theme.palette.success.main }}
                >
                  enrĂ©gistrĂ©s
                </Typography>
              )}
            </div>
            <Button
              variant="outlined"
              color="primary"
              style={{ textTransform: "none" }}
              onClick={() => saveDate("techniqueStart", "techniqueEnd")}
            >
              Enregistrer
            </Button>
          </div>
          <div className="horizontal-list wrap space-between">
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="DĂ©but des soutenances techniques"
                label="DĂ©but des soutenances techniques"
                value={values.techniqueStart}
                onChange={(date) => handleDateChange(date, "techniqueStart")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="Fin des soutenances techniques"
                label="Fin des soutenances techniques"
                value={values.techniqueEnd}
                onChange={(date) => handleDateChange(date, "techniqueEnd")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
          </div>
        </Paper>
        <Paper style={{ padding: "0.5rem" }}>
          <div className="horizontal-list space-between wrap">
            <div className="horizontal-list">
              <Typography variant="h6" color="primary" gutterBottom>
                DĂ©pot des rapports versions numĂ©riques
              </Typography>
              {savedDates.rapportNumericStart && savedDates.rapportNumericEnd && (
                <Typography
                  gutterBottom
                  style={{ color: theme.palette.success.main }}
                >
                  enrĂ©gistrĂ©s
                </Typography>
              )}
            </div>
            <Button
              variant="outlined"
              color="primary"
              style={{ textTransform: "none" }}
              onClick={() =>
                saveDate("rapportNumericStart", "rapportNumericEnd")
              }
            >
              Enregistrer
            </Button>
          </div>
          <div className="horizontal-list wrap space-between">
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="DĂ©but du dĂ©pot des rapports"
                label="DĂ©but du dĂ©pot des rapports"
                value={values.rapportStart}
                onChange={(date) =>
                  handleDateChange(date, "rapportNumericStart")
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="Fin du dĂ©pot des rapports"
                label="Fin du dĂ©pot des rapports"
                value={values.rapportEnd}
                onChange={(date) => handleDateChange(date, "rapportNumericEnd")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
          </div>
        </Paper>
        <Paper style={{ padding: "0.5rem" }}>
          <div className="horizontal-list space-between wrap">
            <div className="horizontal-list">
              <Typography variant="h6" color="primary" gutterBottom>
                DĂ©pot des rapports
              </Typography>
              {savedDates.rapportStart && savedDates.rapportEnd && (
                <Typography
                  gutterBottom
                  style={{ color: theme.palette.success.main }}
                >
                  enrĂ©gistrĂ©s
                </Typography>
              )}
            </div>
            <Button
              variant="outlined"
              color="primary"
              style={{ textTransform: "none" }}
              onClick={() => saveDate("rapportStart", "rapportEnd")}
            >
              Enregistrer
            </Button>
          </div>
          <div className="horizontal-list wrap space-between">
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="DĂ©but du dĂ©pot des rapports"
                label="DĂ©but du dĂ©pot des rapports"
                value={values.rapportStart}
                onChange={(date) => handleDateChange(date, "rapportStart")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="Fin du dĂ©pot des rapports"
                label="Fin du dĂ©pot des rapports"
                value={values.rapportEnd}
                onChange={(date) => handleDateChange(date, "rapportEnd")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
          </div>
        </Paper>
        <Paper style={{ padding: "0.5rem" }}>
          <div className="horizontal-list space-between wrap">
            <div className="horizontal-list">
              <Typography variant="h6" color="primary" gutterBottom>
                Soutenance (session contrĂ´le)
              </Typography>
              {savedDates.controleStart && savedDates.controleEnd && (
                <Typography
                  gutterBottom
                  style={{ color: theme.palette.success.main }}
                >
                  enrĂ©gistrĂ©s
                </Typography>
              )}
            </div>
            <Button
              variant="outlined"
              color="primary"
              style={{ textTransform: "none" }}
              onClick={() => saveDate("controleStart", "controleEnd")}
            >
              Enregistrer
            </Button>
          </div>
          <div className="horizontal-list wrap space-between">
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="DĂ©but des soutenances (session contrĂ´le)"
                label="DĂ©but des soutenances"
                value={values.controleStart}
                onChange={(date) => handleDateChange(date, "controleStart")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
            <div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="Fin des soutenances (session contrĂ´le)"
                label="Fin des soutenances "
                value={values.controleEnd}
                onChange={(date) => handleDateChange(date, "controleEnd")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
          </div>
        </Paper>
      </MuiPickersUtilsProvider>
    </div>
  );
}
