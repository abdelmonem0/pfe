import { TextField, Tooltip, Typography, useTheme } from "@material-ui/core";
import { EventAvailable, LocalOffer } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

function Chooser(props) {
  const { saved, available, assigne, president, rapporteur, teacherStats } =
    props;
  const theme = useTheme();
  var teachers = [...available, { id_utilisateur: "0", nom: "" }];

  if (president) {
    for (let i = 0; i < teachers.length; i++)
      if (!teachers[i].president)
        teachers[i] = { ...teachers[i], isAvailable: false };
  }

  teachers.sort((a, b) => {
    return a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1;
  });

  return (
    <div style={{ flex: "1 1 49%" }}>
      <div className="horizontal-list">
        <div style={{ flex: 1 }} />
        {!saved && (
          <Typography
            variant="subtitle2"
            color="textSecondary"
            style={{ fontSize: "12px" }}
          >{`Disponibles ${teachers.filter((av) => av.isAvailable).length}/${
            teachers.length - 1
          }`}</Typography>
        )}
      </div>
      <Autocomplete
        options={teachers}
        disabled={saved}
        getOptionLabel={(option) => option.nom || ""}
        renderOption={(option) => (
          <>
            {option.nom}
            <div style={{ flex: 1 }} />
            {option.matched && option.matched.length > 0 && (
              <Tooltip title={option.matched.length + " matched tags"}>
                <LocalOffer
                  style={{ color: theme.palette.success.light }}
                  fontSize="small"
                />
              </Tooltip>
            )}
            {option.matchedDate && (
              <Tooltip title={"matched date"}>
                <EventAvailable
                  style={{ color: theme.palette.success.light }}
                  fontSize="small"
                />
              </Tooltip>
            )}
          </>
        )}
        onChange={(e, option) =>
          assigne(option, president ? "président" : "rapporteur")
        }
        groupBy={(option) =>
          option.isAvailable ? "Disponibles" : "Non disponibles"
        }
        getOptionDisabled={(option) => !option.isAvailable}
        value={president || rapporteur}
        getOptionSelected={(option, value) =>
          option.id_utilisateur === value.id_utilisateur
        }
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            variant="outlined"
            label={president ? "Président" : "Rapporteur"}
          />
        )}
      />
    </div>
  );
}

export default Chooser;
