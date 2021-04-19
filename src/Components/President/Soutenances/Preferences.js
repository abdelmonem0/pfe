import { Button, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveSoutenanceDates } from "../../../functions";
import { sendSoutenanceDatesNotifications } from "../../../Notifications";

function Preferences(props) {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxCrenaux, setMaxCrenaux] = useState(1);
  const [sales, setSales] = useState([]);

  const projects = useSelector((state) => state.soutenance.projects);
  const users = useSelector((state) => state.users);

  function getBusinessDateCount() {
    var elapsed, daysBeforeFirstSaturday, daysAfterLastSunday;
    var ifThen = function (a, b, c) {
      return a == b ? c : a;
    };

    elapsed = endDate - startDate;
    elapsed /= 86400000;

    daysBeforeFirstSaturday = (7 - startDate.getDay()) % 7;
    daysAfterLastSunday = endDate.getDay();

    elapsed -= daysBeforeFirstSaturday + daysAfterLastSunday;
    elapsed = (elapsed / 7) * 5;
    elapsed +=
      ifThen(daysBeforeFirstSaturday - 1, -1, 0) +
      ifThen(daysAfterLastSunday, 6, 5);

    return Math.ceil(elapsed);
  }
  const handleSaleListChange = (e) => {
    var _sales = e.target.value
      .replaceAll(" ", "")
      .split(",")
      .filter((sale) => {
        return sale != "";
      });
    setSales(_sales);
  };
  const handleCrenauxOnChange = (e, v) => {
    setMaxCrenaux(parseInt(v));
  };
  const handleSaveDate = () => {
    saveSoutenanceDates(startDate.toISOString(), endDate.toISOString()).then(
      () => {
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
      }
    );
  };
  function generate(data) {
    var _projects = data;
    var soutenances = [];
    for (let proj of _projects) {
      //assigning the date and crenaux
      {
        var sout = { project: proj };
        var lastSout =
          soutenances.length > 0 ? soutenances[soutenances.length - 1] : null;
        var crenaux = lastSout
          ? lastSout.crenaux === maxCrenaux
            ? 1
            : lastSout.crenaux + 1
          : 1;
        var date = lastSout
          ? crenaux === 1
            ? new Date(
                new Date(lastSout.date).setDate(
                  new Date(lastSout.date).getDate() + 1
                )
              ).toISOString()
            : new Date(lastSout.date).toISOString()
          : startDate.toISOString();
        sout = { ...sout, crenaux, date };
      }

      //sorting teachers by number of matched tags
      {
        var enseignants = proj.potential.sort((a, b) => {
          return a.matched_tags.length < b.matched_tags.length;
        });
        _projects.potential = enseignants;
      }

      soutenances.push(sout);
    }

    console.log(soutenances);
  }
  const generateSoutenances = () => {
    var soutenances = [];
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Date de début des soutenances"
            format="MM/dd/yyyy"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Date de fin des soutenances"
            format="MM/dd/yyyy"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <div>
            <Typography>
              De: {startDate.toDateString()} à{" " + endDate.toDateString()}
            </Typography>
            <Typography>
              durée: {getBusinessDateCount()} jours (samedie et dimanche non
              inclus)
            </Typography>
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleSaveDate()}
          >
            Enrégistrer
          </Button>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Autocomplete
            options={["1", "2", "3", "4", "5"]}
            getOptionLabel={(option) => option}
            onChange={handleCrenauxOnChange}
            style={{ minWidth: "16rem" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nombre des crenaux par jour"
                variant="outlined"
              />
            )}
          />
          <TextField
            label="Liste des salles séparée par des virgules"
            onChange={handleSaleListChange}
            variant="outlined"
            fullWidth
            style={{ minWidth: "16rem" }}
          />
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Typography>
            Il y en a {projects.length} projets, if faut{" "}
            {Math.ceil(projects.length / maxCrenaux)} jours à {maxCrenaux}{" "}
            crenaux et {sales.length} sales.
          </Typography>
        </div>
        <div>
          <Button variant="outlined" onClick={() => generate(projects)}>
            Test
          </Button>
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default Preferences;
