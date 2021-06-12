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

export default function ViewDates() {
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
          payload: { message: "Enregistré", type: "success" },
        });
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="vertical-list" style={{ flex: 1 }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Typography variant="h5">Dates</Typography>
        <div className="horizontal-list wrap">
          {savedDates.soutenanceStart && savedDates.soutenanceEnd && (
            <Paper
              style={{ padding: "0.5rem", flex: "1 1 49%", minWidth: "16rem" }}
            >
              <div className="horizontal-list space-between wrap">
                <div className="horizontal-list">
                  <Typography variant="h6" color="primary" gutterBottom>
                    Soutenances
                  </Typography>
                </div>
              </div>
              <div className="horizontal-list  space-between">
                <div>
                  <KeyboardDatePicker
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    disabled
                    id="Début des soutenances"
                    label="Début des soutenances"
                    value={values.soutenanceStart}
                    onChange={(date) =>
                      handleDateChange(date, "soutenanceStart")
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </div>
                <div>
                  <KeyboardDatePicker
                    disabled
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
          )}
          {savedDates.techniqueStart && savedDates.techniqueEnd && (
            <Paper
              style={{ padding: "0.5rem", flex: "1 1 49%", minWidth: "16rem" }}
            >
              <div className="horizontal-list space-between wrap">
                <div className="horizontal-list">
                  <Typography variant="h6" color="primary" gutterBottom>
                    Soutenances techniques
                  </Typography>
                </div>
              </div>
              <div className="horizontal-list  space-between">
                <div>
                  <KeyboardDatePicker
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="Début soutenances tech."
                    label="Début soutenances tech."
                    value={values.techniqueStart}
                    onChange={(date) =>
                      handleDateChange(date, "techniqueStart")
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </div>
                <div>
                  <KeyboardDatePicker
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="Fin soutenances tech."
                    label="Fin soutenances tech."
                    value={values.techniqueEnd}
                    onChange={(date) => handleDateChange(date, "techniqueEnd")}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </div>
              </div>
            </Paper>
          )}
          {savedDates.rapportNumericStart && savedDates.rapportNumericEnd && (
            <Paper
              style={{ padding: "0.5rem", flex: "1 1 49%", minWidth: "16rem" }}
            >
              <div className="horizontal-list space-between wrap">
                <div className="horizontal-list ">
                  <Typography variant="h6" color="primary" gutterBottom>
                    Dépot des rapports versions numériques
                  </Typography>
                </div>
              </div>
              <div className="horizontal-list  space-between">
                <div>
                  <KeyboardDatePicker
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="Début dépot"
                    label="Début dépot"
                    value={values.rapportNumericStart}
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
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="Fin dépot"
                    label="Fin dépot"
                    value={values.rapportNumericEnd}
                    onChange={(date) =>
                      handleDateChange(date, "rapportNumericEnd")
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </div>
              </div>
            </Paper>
          )}
          {savedDates.rapportStart && savedDates.rapportEnd && (
            <Paper
              style={{ padding: "0.5rem", flex: "1 1 49%", minWidth: "16rem" }}
            >
              <div className="horizontal-list space-between wrap">
                <div className="horizontal-list">
                  <Typography variant="h6" color="primary" gutterBottom>
                    Dépot des rapports
                  </Typography>
                </div>
              </div>
              <div className="horizontal-list  space-between">
                <div>
                  <KeyboardDatePicker
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="Début dépot"
                    label="Début dépot"
                    value={values.rapportStart}
                    onChange={(date) => handleDateChange(date, "rapportStart")}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </div>
                <div>
                  <KeyboardDatePicker
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="Fin dépot"
                    label="Fin dépot"
                    value={values.rapportEnd}
                    onChange={(date) => handleDateChange(date, "rapportEnd")}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </div>
              </div>
            </Paper>
          )}
          {savedDates.controleStart && savedDates.controleEnd && (
            <Paper
              style={{ padding: "0.5rem", flex: "1 1 49%", minWidth: "16rem" }}
            >
              <div className="horizontal-list space-between wrap">
                <div className="horizontal-list">
                  <Typography variant="h6" color="primary" gutterBottom>
                    Soutenance (session contrôle)
                  </Typography>
                </div>
              </div>
              <div className="horizontal-list  space-between">
                <div>
                  <KeyboardDatePicker
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="Début sout. (contrôle)"
                    label="Début sout. (contrôle)"
                    value={values.controleStart}
                    onChange={(date) => handleDateChange(date, "controleStart")}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </div>
                <div>
                  <KeyboardDatePicker
                    disabled
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="Fin des soutenances (session contrôle)"
                    label="Fin sout. (contrôle)"
                    value={values.controleEnd}
                    onChange={(date) => handleDateChange(date, "controleEnd")}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </div>
              </div>
            </Paper>
          )}
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );
}
