import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DateSale(props) {
  const { maxCrenaux, setMaxCrenaux, sales, setSales, saturday } = props;
  const savedDates = useSelector((state) => state.savedDates);

  const handleSaleListChange = (e) => {
    var _sales = e.target.value;
    setSales(_sales);
  };
  const handleCrenauxOnChange = (e, v) => {
    setMaxCrenaux(parseInt(v));
  };

  function calculateWorkDays() {
    var sDate = new Date(savedDates.soutenanceStart);
    var eDate = new Date(savedDates.soutenanceEnd);
    var i = 0;
    while (sDate <= eDate) {
      if (sDate.getDay() !== 0 && (saturday ? true : sDate.getDay() !== 6)) i++;
      sDate.setDate(sDate.getDate() + 1);
    }

    return `${i} jour${i > 1 ? "s" : ""} (dimanches ${
      !saturday ? "et samedis" : ""
    } non inclus)`;
  }

  return (
    <div className="vertical-list" style={{ gap: "1rem", padding: "0.5rem 0" }}>
      <div className="horizontal-list wrap">
        {(savedDates.soutenanceStart && savedDates.soutenanceEnd && (
          <div className="horizontal-list space-between wrap">
            <div className="horizontal-list wrap">
              <Typography variant="h6">Date de debut:</Typography>
              <Typography variant="h6" color="primary">
                {new Date(savedDates.soutenanceStart).toLocaleDateString(
                  "fr-FR"
                )}
              </Typography>
            </div>
            <div
              style={{
                height: "1px",
                margin: "0 0.2rem",
                backgroundColor: "lightgray",
                flex: "1",
              }}
            />
            <div className="horizontal-list wrap">
              <Typography variant="h6">Date de fin:</Typography>
              <Typography variant="h6" color="primary">
                {new Date(savedDates.soutenanceEnd).toLocaleDateString("fr-FR")}
              </Typography>
            </div>
            <Typography color="secondary">{calculateWorkDays()}</Typography>
            <Link to="/dates">
              <Typography color="primary">modifier les dates</Typography>
            </Link>
          </div>
        )) || (
          <div>
            <Typography>
              Vous n'avez pas mis des dates pour les soutenances,
              <Link to="/dates">
                <Typography color="primary">cliquez ici</Typography>
              </Link>{" "}
              pour en mettre.
            </Typography>
          </div>
        )}
      </div>
      <div className="horizontal-list wrap">
        <Autocomplete
          options={["1", "2", "3", "4", "5"]}
          getOptionLabel={(option) => option}
          onChange={handleCrenauxOnChange}
          value={maxCrenaux.toString()}
          style={{ minWidth: "16rem", flex: "1 1 20%" }}
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
          style={{ minWidth: "16rem", flex: "1 1 79%" }}
        />
      </div>
    </div>
  );
}

export default DateSale;
