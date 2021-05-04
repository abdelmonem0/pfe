import { Button, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useEffect, useRef, useState } from "react";
import { saveSoutenanceDates } from "../../../../functions";
import { sendSoutenanceDatesNotifications } from "../../../../Notifications";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch, useSelector } from "react-redux";

function DateSale(props) {
  const {
    setStartDate,
    setEndDate,
    startDate,
    endDate,
    maxCrenaux,
    setMaxCrenaux,
    sales,
    setSales,
  } = props;
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.soutenance.projects);
  const users = useSelector((state) => state.users);

  const handleSaleListChange = (e) => {
    var _sales = e.target.value;
    setSales(_sales);
  };
  const handleCrenauxOnChange = (e, v) => {
    setMaxCrenaux(parseInt(v));
  };
  const handleSaveDate = () => {
    saveSoutenanceDates(startDate, endDate).then(() => {
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
            value={new Date(startDate)}
            onChange={(date) => setStartDate(date.toISOString())}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Date de fin des soutenances"
            format="MM/dd/yyyy"
            value={new Date(endDate)}
            onChange={(date) => setEndDate(date.toISOString())}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <div>
            <Typography>
              De: {new Date(startDate).toDateString()} à
              {" " + new Date(endDate).toDateString()}
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
            value={maxCrenaux.toString()}
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
            value={sales}
            fullWidth
            style={{ minWidth: "16rem" }}
          />
        </div>
        <div
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        ></div>
        <div></div>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default DateSale;
