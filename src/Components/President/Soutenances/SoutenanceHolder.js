import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SoutenancesTable from "../../Commun/SoutenancesTable";
import SoutenanceDay from "./SoutenanceDay";
import { getDays } from "./SoutenanceLogic";

function SoutenanceHolder(props) {
  const { values, saved, saturday, soutenances } = props;
  // const generatedSoutenances = useSelector(
  //   (state) => state.soutenance.soutenances
  // );
  // const savedSoutenances = useSelector(
  //   (state) => state.savedSoutenance.soutenances
  // );
  // const soutenances = saved ? savedSoutenances : generatedSoutenances;
  const days = getDays(soutenances, values, !saved ? saturday : true, saved);

  return (
    <div>
      <div className="horizontal-list space-between wrap">
        {soutenances && (
          <Visualize soutenances={soutenances}>
            <Button>Visualize</Button>
          </Visualize>
        )}
      </div>
      <div
        className="horizontal-list wrap"
        style={{ alignItems: "flex-start" }}
      >
        {days.map((day, index) => (
          <SoutenanceDay
            soutenances={soutenances.filter((s) => s.date === day)}
            saved={saved}
            key={index}
            date={day}
          />
        ))}
      </div>
    </div>
  );
}

export default SoutenanceHolder;

const Visualize = (props) => {
  const [open, setOpen] = useState(false);
  const { soutenances } = props;

  return (
    <div
      onClick={() => {
        if (!open) setOpen(true);
      }}
    >
      <Dialog
        maxWidth="lg"
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Soutenances</DialogTitle>
        <DialogContent>
          <SoutenancesTable soutenances={soutenances} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Fermer</Button>
          <Button>Envoyer</Button>
        </DialogActions>
      </Dialog>
      {props.children}
    </div>
  );
};
