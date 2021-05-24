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

function SoutenanceDay(props) {
  const { date, saved } = props;
  const soutenances = useSelector(
    (state) => state.soutenance.soutenances
  ).filter((s) => s.date === date);
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
        backgroundColor: theme.palette.background.default,
      }}
    >
      <div
        className="horizontal-list space-between"
        style={{ alignItems: "flex-start" }}
      >
        <Typography style={{ padding: "0.25rem" }} variant="h5">
          {date}
        </Typography>
        {!saved && (
          <Tooltip title="Ajouter un crénau">
            <IconButton
              disabled={crenaux.length >= maxCrenaux}
              color="primary"
              size="small"
              onClick={() => setCrenaux([...crenaux, crenaux.length + 1])}
            >
              <LibraryAdd />
            </IconButton>
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
            />
          ))}
      </div>
    </Paper>
  );
}

export default SoutenanceDay;
