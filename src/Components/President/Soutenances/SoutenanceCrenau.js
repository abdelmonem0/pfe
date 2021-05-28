import {
  Typography,
  Paper,
  IconButton,
  Collapse,
  Divider,
  Tooltip,
  useTheme,
  Button,
} from "@material-ui/core";
import {
  AddCircle,
  DeleteSweep,
  DoneAll,
  ErrorOutline,
  ExpandLess,
} from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SoutenanceCard from "./Card";
import { checkMultipleSoutenanceValid } from "./SoutenanceLogic";
import { v4 as uuid } from "uuid";
import ConfirmDialog from "../../Commun/ConfirmDialog";

function SoutenanceCrenau(props) {
  const { crenau, saved, date, deleteCrenau } = props;
  const dispatch = useDispatch();

  const savedSoutenances =
    useSelector((state) => state.savedSoutenance.soutenances).filter(
      (s) => s.date === date && s.crenau === crenau
    ) || [];
  const currentSoutenances = useSelector(
    (state) => state.soutenance.soutenances
  ).filter((s) => s.date === date && s.crenau === crenau);
  const soutenances = saved ? savedSoutenances : currentSoutenances;

  var sales = useSelector((state) => state.soutenance.values.sales.split(","));
  const savedSales =
    useSelector((state) => state.savedSoutenance.values.sales) || [];
  if (saved) sales = savedSales;
  const [open, setOpen] = useState(true);

  const theme = useTheme();

  const handleExpand = () => {
    setOpen(!open);
  };

  const allSoutenanceValid = checkMultipleSoutenanceValid(soutenances);

  const handleDeleteAllSoutenance = () => {
    dispatch({
      type: "DELETE_SOUTENANCE",
      payload: soutenances.map((s) => s.id),
    });
    deleteCrenau(crenau);
  };

  const handleAddSoutenance = () => {
    dispatch({
      type: "ADD_SOUTENANCE",
      payload: {
        id_soutenance: uuid(),
        id_sujet: "",
        sale: "",
        date,
        crenau,
        invite: [],
      },
    });
  };

  useEffect(() => {
    console.log("soutenanceCrenau");
  }, [soutenances]);

  return (
    <Paper variant="outlined" style={{ width: "100%" }}>
      <div
        className="horizontal-list"
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="h6">{`Crenau ${crenau}`}</Typography>

        <Divider orientation="vertical" flexItem />
        <Typography>{`${soutenances.length} soutenance${
          soutenances.length > 1 ? "s" : ""
        }`}</Typography>
        <div style={{ flex: 1 }} />

        {!saved && (
          <ConfirmDialog
            title="Supprimer"
            body="Voulez-vous vraiment supprimer tout les soutenances de ce crénau?"
            onConfirm={handleDeleteAllSoutenance}
          >
            <Tooltip title="Supprimer ce crénau">
              <div>
                {" "}
                <IconButton disabled={saved} size="small">
                  <DeleteSweep style={{ color: theme.palette.error.main }} />
                </IconButton>
              </div>
            </Tooltip>
          </ConfirmDialog>
        )}
        {!saved && (
          <Tooltip title="Ajouter une soutenance">
            <div>
              <IconButton
                disabled={soutenances.length >= sales.length}
                size="small"
                color="primary"
                onClick={handleAddSoutenance}
              >
                <AddCircle />
              </IconButton>
            </div>
          </Tooltip>
        )}

        {allSoutenanceValid ? (
          <Tooltip title="Toutes les soutenances de ce crénau sont valides">
            <DoneAll style={{ color: theme.palette.success.main }} />
          </Tooltip>
        ) : (
          <Tooltip title="Une ou plusieurs soutenance(s) non validée(s) dans ce crénau">
            <ErrorOutline style={{ color: theme.palette.warning.main }} />
          </Tooltip>
        )}
        <IconButton size="small" onClick={handleExpand}>
          <ExpandLess />
        </IconButton>
      </div>
      <Collapse in={open}>
        <Divider />

        <div className="vertical-list" style={{ flex: 1 }}>
          {soutenances.map((s, i) => (
            <>
              <SoutenanceCard
                saved={saved}
                key={s.id_sujet + i}
                soutenance={s}
              />
              {i < soutenances.length && <Divider key={s.id_sujet} light />}
            </>
          ))}
        </div>
      </Collapse>
    </Paper>
  );
}

export default React.memo(SoutenanceCrenau);
