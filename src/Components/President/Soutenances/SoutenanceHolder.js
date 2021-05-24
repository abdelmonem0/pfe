import { Button } from "@material-ui/core";
import React from "react";
import SoutenanceDay from "./SoutenanceDay";
import { equalizeCrenaux, getDays, filterByDates } from "./SoutenanceLogic";

function SoutenanceHolder(props) {
  const { soutenances, values, saved } = props;
  const days = getDays(soutenances, values);

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
          <SoutenanceDay saved={saved} key={index} date={day} />
        ))}
      </div>
    </div>
  );
}

export default SoutenanceHolder;
