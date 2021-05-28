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
    dispatch({ type: "DELETE_SOUTENANCE", payload: soutenance.id_soutenance });
  };

  const handleChangeSale = (o, v) => {
    setSoutenanceSale(soutenance, v);
  };

  const soutenanceValid = checkSoutenanceValid(soutenance);

  return (
    <>
      {soutenance.id_sujet === "" ? (
        <Tooltip title="Supprimer le soutenance">
          <IconButton size="small" onClick={handleDeleteSoutenance}>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : (
        <div className="horizontal-list space-between">
          <div className="horizontal-list wrap">
            {buttonsVisible || soutenance.sale === "" ? (
              <Tooltip title="Changer la sale">
                <Autocomplete
                  options={sales}
                  onChange={handleChangeSale}
                  getOptionLabel={(option) => option}
                  value={soutenance.sale}
                  getOptionSelected={(option, value) => option === value}
                  style={{ padding: 0 }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Sale">
                <Typography variant="body2" color="textSecondary">
                  <Room /> {soutenance.sale}
                </Typography>
              </Tooltip>
            )}
            {buttonsVisible && (
              <Tooltip title="Supprimer la soutenance">
                <div>
                  <ConfirmDialog
                    title="Supprimer une soutenance"
                    body="Voulez-vous vraiment supprimer cette soutenance?"
                    onConfirm={handleDeleteSoutenance}
                  >
                    <IconButton style={{ padding: 0 }}>
                      <Delete style={{ color: theme.palette.error.main }} />
                    </IconButton>
                  </ConfirmDialog>
                </div>
              </Tooltip>
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
            {soutenanceValid ? (
              <Tooltip title="Soutenance valide">
                <Done style={{ color: theme.palette.success.light }} />
              </Tooltip>
            ) : (
              <Tooltip title="Soutenance non valide (vérifiez les invités et la sale)">
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
