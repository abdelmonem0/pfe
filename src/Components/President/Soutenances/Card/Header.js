import {
  Checkbox,
  Divider,
  Tooltip,
  Typography,
  useTheme,
  IconButton,
  TextField,
} from "@material-ui/core";
import { Room, Done, Cached, Delete } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "../../../Commun/ConfirmDialog";
import { checkSoutenanceValid, setSoutenanceSale } from "../SoutenanceLogic";

function Header(props) {
  const { soutenance, setShowStudents, showStudents, buttonsVisible } = props;
  const theme = useTheme();
  var { sales } = useSelector((state) => state.soutenance.values);
  sales = sales.replace(" ", "").split(",");
  const dispatch = useDispatch();

  const handleDeleteSoutenance = () => {
    dispatch({ type: "DELETE_SOUTENANCE", payload: soutenance.id });
  };

  const handleChangeSale = (o, v) => {
    setSoutenanceSale(soutenance, v);
  };

  return (
    <>
      {soutenance.id_sujet === "" ? (
        <IconButton size="small" onClick={handleDeleteSoutenance}>
          <Delete />
        </IconButton>
      ) : (
        <div className="horizontal-list space-between">
          <div className="horizontal-list wrap">
            {buttonsVisible || soutenance.sale === "" ? (
              <Autocomplete
                options={sales}
                onChange={handleChangeSale}
                getOptionLabel={(option) => option}
                value={soutenance.sale}
                getOptionSelected={(option, value) => option === value}
                style={{ padding: 0 }}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                <Room /> {`Sale ${soutenance.sale}`}
              </Typography>
            )}
            {buttonsVisible && (
              <ConfirmDialog
                title="Supprimer une soutenance"
                body="Voulez-vous vraiment supprimer cette soutenance?"
                onConfirm={handleDeleteSoutenance}
              >
                <IconButton style={{ padding: 0 }}>
                  <Delete style={{ color: theme.palette.error.main }} />
                </IconButton>
              </ConfirmDialog>
            )}
          </div>

          <div
            className="horizontal-list"
            onClick={() => setShowStudents(!showStudents)}
          >
            <Divider orientation="vertical" flexItem />
            <Typography
              variant="body2"
              color={showStudents ? "secondary" : "textSecondary"}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              <Checkbox
                size="small"
                style={{ padding: "0", paddingRight: "0.5rem" }}
                checked={showStudents}
              />
              Afficher les étudiants
            </Typography>
            <Divider orientation="vertical" flexItem />
            {checkSoutenanceValid(soutenance) ? (
              <Done style={{ color: theme.palette.success.light }} />
            ) : (
              <Tooltip title="Soutenance non verifiée encore">
                <div className="rotation">
                  <Cached style={{ color: theme.palette.warning.light }} />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      )}
      <Divider />
    </>
  );
}

export default Header;

{
  /* <Typography
          variant="body2"
          color="textSecondary"
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <Checkbox
            size="small"
            style={{ padding: "0", paddingRight: "0.5rem" }}
          />
          Afficher les étudiants
        </Typography> */
}
