import React, { useState } from "react";
import { Candidature_States, Project_States } from "../../../Constants";
import Section from "./Section";
import { Button, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { saveParameter, saveSoutenanceDates } from "../../../functions";
import { sendSoutenanceDatesNotifications } from "../../../Notifications";
import { useDispatch, useSelector } from "react-redux";
import ParamField from "./ParamField";

function Parameters(props) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSaveDate = () => {
    saveParameter([startDate, endDate]).then(() => {
      dispatch({
        type: "OPEN_SNACK",
        payload: {
          open: true,
          message: "Dates enregistrés.",
          type: "success",
        },
      });
      sendSoutenanceDatesNotifications(users, false).catch((err) =>
        console.error(err)
      );
    });
  };

  function getBusinessDateCount() {
    var elapsed, daysBeforeFirstSaturday, daysAfterLastSunday;
    var ifThen = function (a, b, c) {
      return a == b ? c : a;
    };

    elapsed = new Date(endDate) - new Date(startDate);
    elapsed /= 86400000;

    daysBeforeFirstSaturday = (7 - new Date(startDate).getDay()) % 7;
    daysAfterLastSunday = new Date(endDate).getDay();

    elapsed -= daysBeforeFirstSaturday + daysAfterLastSunday;
    elapsed = (elapsed / 7) * 5;
    elapsed +=
      ifThen(daysBeforeFirstSaturday - 1, -1, 0) +
      ifThen(daysAfterLastSunday, 6, 5);

    return Math.ceil(elapsed);
  }
  return (
    <div className="horizontal-list wrap" style={{ flex: 1, gap: "1rem" }}>
      <Section title="Paramètre generaux"></Section>
      <Section title="Les dates des soutenances">
        <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ flex: 1 }}>
          <div className="horizontal-list wrap">
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Date de début des soutenances"
              format="MM/dd/yyyy"
              variant="outlined"
              value={new Date(startDate)}
              onChange={(date) => setStartDate(date.toISOString())}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              style={{ flex: "1 1 49%", minWidth: "16rem" }}
            />
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Date de fin des soutenances"
              format="MM/dd/yyyy"
              variant="outlined"
              value={new Date(endDate)}
              onChange={(date) => setEndDate(date.toISOString())}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              style={{ flex: "1 1 49%", minWidth: "16rem" }}
            />
            <div style={{ flex: 1, minWidth: "18rem" }}>
              <Typography>
                De: {new Date(startDate).toDateString()} à
                {" " + new Date(endDate).toDateString()}
              </Typography>
              <Typography>
                durée: {getBusinessDateCount()} jours (samedie et dimanche non
                inclus)
              </Typography>
            </div>
            <div className="horizontal-list" style={{ flex: "1 1 100%" }}>
              <div style={{ flex: 1 }} />
              <Typography>getLastUpdate</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleSaveDate()}
              >
                Enrégistrer
              </Button>
            </div>
          </div>
        </MuiPickersUtilsProvider>
      </Section>
      <Section title="Paramètres des états des sujets">
        {Object.keys(Project_States).map((key) => (
          <ParamField value={Project_States[key]} />
        ))}
      </Section>
      <Section title="Paramètres des états des candidatures">
        {Object.keys(Candidature_States).map((key) => (
          <ParamField value={Candidature_States[key]} />
        ))}
      </Section>
    </div>
  );
}

export default Parameters;
