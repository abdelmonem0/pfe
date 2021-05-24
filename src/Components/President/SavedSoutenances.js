import { Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Soutenances from "./Soutenances/Soutenances";

export default function SavedSoutenances(props) {
  const savedValues = useSelector((state) => state.savedSoutenance.values);

  return (
    <div style={{ flex: 1 }}>
      <Typography variant="h4" paragraph>
        Soutenances enregistrés
      </Typography>
      <Soutenances values={savedValues} saved={true} />
    </div>
  );
}
