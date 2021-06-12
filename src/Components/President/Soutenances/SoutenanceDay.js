import {
  Paper,
  Typography,
  useTheme,
  Divider,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { getCrenaux } from "./SoutenanceLogic";
import React, { useState } from "react";
import SoutenanceCrenau from "./SoutenanceCrenau";
import { useSelector } from "react-redux";
import { LibraryAdd } from "@material-ui/icons";

const options = { weekday: "short", month: "short", day: "numeric" };

function SoutenanceDay(props) {
  const { date, saved, soutenances } = props;

  // const savedSoutenances = useSelector(
  //   (state) => state.savedSoutenance.soutenances
  // ).filter((s) => s.date === date);
  // const currentSoutenances = useSelector(
  //   (state) => state.soutenance.soutenances
  // ).filter((s) => s.date === date);
  const maxCrenaux = useSelector((state) => state.soutenance.values.maxCrenaux);
  const [crenaux, setCrenaux] = useState(getCrenaux(soutenances) || []);

  const theme = useTheme();

  const deleteCrenau = (crenau) => {
    setCrenaux(crenaux.filter((c) => c !== crenau));
  };

  return (
    <Paper
      variant="outlined"
      style={{
        flex: "1 1 49%",
      }}
    >
      <div
        className="horizontal-list space-between"
        style={{ alignItems: "flex-start" }}
      >
        <div className="horizontal-list">
          <Typography style={{ padding: "0.25rem" }} variant="h6">
            {new Date(date).toLocaleDateString("fr-FR", options)}
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="h6" color="textSecondary">
            {crenaux ? crenaux.length : "0"} crénau
            {crenaux && crenaux.length < 2 ? "" : "x"}
          </Typography>
        </div>
        {!saved && (
          <Tooltip
            title={`Ajouter une soutenance ${
              crenaux.length >= maxCrenaux
                ? " ( Nombre maximal des crénaux est atteint pour ce jour )"
                : ""
            }`}
          >
            <div>
              <IconButton
                disabled={crenaux.length >= maxCrenaux}
                color="primary"
                size="small"
                onClick={() => setCrenaux([...crenaux, crenaux.length + 1])}
              >
                <LibraryAdd />
              </IconButton>
            </div>
          </Tooltip>
        )}
      </div>
      <Divider />
      <div
        className="vertical-list"
        style={{
          flex: 1,
          alignItems: "flex-start",
          padding: "0.25rem",
        }}
      >
        {crenaux &&
          crenaux.map((crenau, index) => (
            <SoutenanceCrenau
              key={index}
              date={date}
              crenau={crenau}
              saved={saved}
              deleteCrenau={deleteCrenau}
              soutenances={soutenances.filter((s) => s.crenau === crenau)}
            />
          ))}
      </div>
    </Paper>
  );
}

export default SoutenanceDay;
