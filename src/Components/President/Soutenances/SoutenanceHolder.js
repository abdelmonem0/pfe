import { Button } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import SoutenanceDay from "./SoutenanceDay";
import { equalizeCrenaux, getDays, filterByDates } from "./SoutenanceLogic";

function SoutenanceHolder() {
  const soutenances = useSelector((state) => state.soutenance.soutenances);
  const days = getDays(soutenances);

  return (
    <div>
      <div className="horizontal-list">
        <Button onClick={() => equalizeCrenaux()}>Egualiser</Button>
        <Button onClick={() => filterByDates()}>By Dates And Crenau</Button>
        <Button onClick={() => filterByDates(true)}>By Dates Only</Button>
        <Button onClick={() => filterByDates(true)}>By Tags</Button>
      </div>
      <div
        className="horizontal-list wrap"
        style={{ alignItems: "flex-start" }}
      >
        {days.map((day, index) => (
          <SoutenanceDay key={index} date={day} />
        ))}
      </div>
    </div>
  );
}

export default SoutenanceHolder;
