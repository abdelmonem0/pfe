import React from "react";
import { useSelector } from "react-redux";
import SoutenanceDay from "./SoutenanceDay";
import { getDays } from "./SoutenanceLogic";

function SoutenanceHolder(props) {
  const { values, saved } = props;
  const generatedSoutenances = useSelector(
    (state) => state.soutenance.soutenances
  );
  const savedSoutenances = useSelector(
    (state) => state.savedSoutenance.soutenances
  );
  const soutenances = saved ? savedSoutenances : generatedSoutenances;
  const days = getDays(soutenances, values);

  return (
    <div>
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
