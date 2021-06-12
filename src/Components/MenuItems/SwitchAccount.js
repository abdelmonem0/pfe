import {
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  Button,
} from "@material-ui/core";
import { Cached } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import ConfirmDialog from "../Commun/ConfirmDialog";

export default function SwitchAccount(props) {
  const button = props.button;
  const theme = useTheme();
  const canSwitch = useSelector((state) => state.constants.canSwitch);
  const current = useSelector((state) => state.users.current);
  const firstRole = useSelector((state) => state.users.firstRole);
  const history = useHistory();
  const dispatch = useDispatch();

  const _switch = () => {
    history.replace("/");
    dispatch({ type: "SWITCH_ROLE" });
  };

  return (
    (canSwitch && (
      <ConfirmDialog
        title="Changer le rôle"
        body={`Changer le rôle de ${current.role} à ${
          current.role === firstRole ? "enseignant" : firstRole
        }.`}
        onConfirm={_switch}
      >
        {!button ? (
          <ListItem button>
            <ListItemIcon style={{ color: theme.palette.primary.main }}>
              <Cached />
            </ListItemIcon>

            <ListItemText
              primary="Changer le role"
              style={{ color: theme.palette.primary.main }}
            />
          </ListItem>
        ) : (
          <Button
            style={{
              color: theme.palette.getContrastText(theme.palette.primary.main),
              borderColor: theme.palette.getContrastText(
                theme.palette.primary.main
              ),
            }}
            size="small"
            variant="outlined"
          >
            {current.role}
          </Button>
        )}
      </ConfirmDialog>
    )) ||
    null
  );
}
