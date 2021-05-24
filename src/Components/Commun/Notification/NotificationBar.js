import {
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  Comment,
  Notifications,
  NotificationsActive,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkNotification, getNotifications } from "../../../functions";
import { getNotificationText } from "./logic";

export default function NotificationBar(props) {
  const [anchor, setAnchor] = useState(null);
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const uncheckedNots = notifications.filter((not) => !not.checked);

  const handleOpenMenu = (event) => {
    if (anchor === null) {
      setAnchor(event.currentTarget);
      if (uncheckedNots.length > 0) {
        dispatch({ type: "CHECK_NOTIFICATIONS" });
        checkNotification(notifications).catch((err) => console.error(err));
      }
    } else setAnchor(null);
  };

  return (
    <>
      <NotificationsMenu
        anchor={anchor}
        close={handleOpenMenu}
        notifications={notifications}
      />
      <IconButton onClick={(event) => handleOpenMenu(event)}>
        <Badge color="secondary" badgeContent={uncheckedNots.length}>
          {uncheckedNots.length > 0 ? (
            <NotificationsActive style={{ fill: "white" }} />
          ) : (
            <Notifications style={{ fill: "white" }} />
          )}
        </Badge>
      </IconButton>
    </>
  );
}

const NotificationsMenu = (props) => {
  const { close, anchor, notifications } = props;
  const [shownNots, setShownNots] = useState(5);

  const handleClose = () => {
    close(null);
    setShownNots(5);
  };

  return (
    <Menu
      autoFocus
      open={anchor !== null}
      id="menu-appbar"
      anchorEl={anchor}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleClose}
    >
      <MenuList>
        {notifications.slice(0, shownNots).map((el, idx) => (
          <Notification
            notification={el}
            index={idx}
            divider={idx + 1 < notifications.length}
          />
        ))}
        {shownNots < notifications.length && (
          <MenuItem onClick={() => setShownNots(shownNots + 5)}>
            <div style={{ width: "100%", alignItems: "center" }}>
              <Typography variant="subtitle2" color="textSecondary">
                Afficher plus
              </Typography>
            </div>
          </MenuItem>
        )}
        {notifications.length === 0 && (
          <MenuItem button={false} style={{ minWidth: "20rem" }}>
            Pas de notifications
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

const Notification = (props) => {
  const { notification, index, divider } = props;
  const users = useSelector((state) => state.users.all);

  const text = getNotificationText(notification);

  return (
    <>
      <MenuItem key={index} style={{ whiteSpace: "normal", maxWidth: "20rem" }}>
        <Box>
          <Typography variant="subtitle1">{text}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {new Date(notification.date).toLocaleString("fr-FR")}
          </Typography>
        </Box>
      </MenuItem>
      {divider && <Divider />}
    </>
  );
};
