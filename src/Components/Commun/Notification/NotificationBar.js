import {
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@material-ui/core";
import { Notifications, NotificationsActive } from "@material-ui/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { checkNotification, getNotifications } from "../../../functions";
import { getNotificationText, sort_notifications } from "./logic";

export default function NotificationBar(props) {
  const [anchor, setAnchor] = useState(null);
  const dispatch = useDispatch();
  var notifications = useSelector((state) => state.notifications);
  notifications = sort_notifications(notifications);
  const [uncheckedNots, setUnchekedNots] = useState(
    notifications.filter((not) => !not.checked)
  );

  const handleOpenMenu = (event) => {
    if (anchor === null) {
      setAnchor(event.currentTarget);
      if (uncheckedNots.length > 0) {
        setUnchekedNots([]);
        checkNotification(notifications).catch((err) => console.error(err));
      }
    } else {
      setAnchor(null);
      dispatch({ type: "CHECK_NOTIFICATIONS" });
    }
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
          <React.Fragment key={idx}>
            <Notification
              notification={el}
              divider={idx + 1 < notifications.length}
            />
          </React.Fragment>
        ))}
        {shownNots < notifications.length && (
          <MenuItem
            key={"show more"}
            onClick={() => setShownNots(shownNots + 5)}
          >
            <div style={{ width: "100%", alignItems: "center" }}>
              <Typography variant="subtitle2" color="textSecondary">
                Afficher plus
              </Typography>
            </div>
          </MenuItem>
        )}
        {notifications.length === 0 && (
          <MenuItem
            key={"end not"}
            button={false}
            style={{ minWidth: "20rem" }}
          >
            Pas de notifications
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

const Notification = (props) => {
  const { notification, divider } = props;
  const users = useSelector((state) => state.users.all);

  const text = getNotificationText(notification);

  return (
    <Link
      className="link-style"
      to={`?pid=${notification.id_objet}&cid=${notification.id_objet}?`}
      key={notification.id_notification}
    >
      <MenuItem style={{ whiteSpace: "normal", maxWidth: "20rem" }}>
        <Box>
          <Typography variant="body1">{text}</Typography>
          <div className="horizontal-list space-between">
            <Typography variant="body2" color="textSecondary">
              {new Date(notification.date).toLocaleString("fr-FR")}
            </Typography>
            {notification.checked == 0 && (
              <Typography color="primary" variant="subtitle2">
                nouveau
              </Typography>
            )}
          </div>
        </Box>
      </MenuItem>
      {divider && <Divider />}
    </Link>
  );
};
