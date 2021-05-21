import {
  Button,
  Checkbox,
  Hidden,
  Typography,
  useTheme,
} from "@material-ui/core";
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
    calledFromSoutenances,
  } = props;
  const theme = useTheme();

  return selected.length === 0 ? (
    <div
      className="table-container"
      style={{
        padding: "1rem 0.5rem",
        gap: "0.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Hidden smDown>
        <Typography variant="h5">Liste des enseignants</Typography>
      </Hidden>
      {!calledFromSoutenances && (
        <>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setShowTags(!showTags)}
            style={{ textTransform: "none" }}
          >
            {showTags ? "Cacher les tags" : "Afficher tout les tags"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => selectTeachersWithoutTags()}
            style={{ textTransform: "none" }}
          >
            Enseignants sans tags
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => selectTeachersWithoutDates()}
            style={{ textTransform: "none" }}
          >
            Enseignants sans dates
          </Button>
        </>
      )}
    </div>
  ) : (
    <div
      className="table-container"
      style={{
        padding: "1rem 0.5rem",
        gap: "0.25rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.palette.primary.light,
      }}
    >
      <Typography variant="h5">Séléctionnés {selected.length}</Typography>

      <Button
        variant="outlined"
        size="small"
        style={{ textTransform: "none" }}
        onClick={() => setSelectedTeachers([])}
      >
        Deséléctionner
      </Button>
      {!calledFromSoutenances && (
        <>
          <Button
            variant="outlined"
            size="small"
            style={{ textTransform: "none" }}
            onClick={() => notify(true)}
          >
            Notifier pour ajouter des Tags
          </Button>
          <Button
            variant="outlined"
            size="small"
            style={{ textTransform: "none" }}
            onClick={() => notify(false)}
          >
            Notifier pour ajouter des Préférences
          </Button>
        </>
      )}
    </div>
  );
}
