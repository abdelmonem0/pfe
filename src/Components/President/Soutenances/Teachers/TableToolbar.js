import { Button, Checkbox, Typography } from "@material-ui/core";
import React from "react";

export default function TableToolbar(props) {
  const {
    selected,
    setShowTags,
    showTags,
    notify,
    selectTeachersWithoutDates,
    selectTeachersWithoutTags,
    setSelectedTeachers,
  } = props;

  return selected.length === 0 ? (
    <div
      style={{
        padding: "1rem 0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h5">Liste des enseignants</Typography>
      <Button
        siez="small"
        variant="outlined"
        onClick={() => setShowTags(!showTags)}
        style={{ textTransform: "none" }}
      >
        {showTags ? "Cacher les tags" : "Afficher tout les tags"}
      </Button>
      <Button
        siez="small"
        variant="outlined"
        onClick={() => selectTeachersWithoutTags()}
        style={{ textTransform: "none" }}
      >
        Enseignants sans tags
      </Button>
      <Button
        siez="small"
        variant="outlined"
        onClick={() => selectTeachersWithoutDates()}
        style={{ textTransform: "none" }}
      >
        Enseignants sans dates
      </Button>
    </div>
  ) : (
    <div
      style={{
        padding: "1rem 0.5rem",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "pink",
      }}
    >
      <Typography variant="h5">Séléctionnés {selected.length}</Typography>

      <Button
        variant="outlined"
        style={{ textTransform: "none" }}
        onClick={() => setSelectedTeachers([])}
      >
        Deséléctionner
      </Button>
      <Button
        variant="outlined"
        style={{ textTransform: "none" }}
        onClick={() => notify(true)}
      >
        Notifier pour ajouter des Tags
      </Button>
      <Button
        variant="outlined"
        style={{ textTransform: "none" }}
        onClick={() => notify(false)}
      >
        Notifier pour ajouter des Préférences
      </Button>
      <Typography variant="h6">Grade </Typography>
    </div>
  );
}
