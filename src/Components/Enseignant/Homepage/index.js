import { Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import SoutenancesDetails from "../../Commun/Soutenances";
import { getUserSoutenances } from "../../Commun/Soutenances/logic";
import SoutenancesTable from "../../Commun/SoutenancesTable";
import ViewDates from "../../President/Dates/ViewDates";

function Homepage() {
  const current = useSelector((state) => state.users.current);
  const soutenances = getUserSoutenances();
  return (
    <div style={{ flex: 1 }}>
      <div className="vertical-list">
        <ViewDates />

        <SoutenancesTable soutenances={soutenances} />
      </div>
    </div>
  );
}

export default Homepage;
