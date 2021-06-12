import {
  Button,
  Collapse,
  DialogActions,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Dialog,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import {
  ArrowRight,
  ExitToApp,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import GetIcon from "./GetIcon";
import SwitchAccount from "./SwitchAccount";

function getChildren(pages, page) {
  return pages.filter((p) => p.parent && p.parent === page.link);
}

function MenuItems(props) {
  const dispatch = useDispatch();
  const { pages, drawerOpen, closeDrawer } = props;
  const history = useHistory();
  const [logoutDialog, setLogoutDialog] = React.useState(false);
  const theme = useTheme();

  const handleLogout = () => {
    if (!drawerOpen) setLogoutDialog(true);
    else {
      history.push("/");
      dispatch({ type: "PURGE" });
    }
  };

  return (
    <List>
      {pages.map(
        (page) =>
          !page.parent && (
            <React.Fragment key={page.link}>
              {/* switch account */}
              {page.link === "/profile" && <SwitchAccount />}
              <Item
                page={page}
                key={page.text}
                children={getChildren(pages, page)}
                drawerOpen={drawerOpen}
                closeDrawer={closeDrawer}
              />
            </React.Fragment>
          )
      )}

      {/* Logout */}
      <ListItem button onClick={handleLogout}>
        <ListItemIcon style={{ color: theme.palette.error.main }}>
          <ExitToApp />
        </ListItemIcon>

        <ListItemText
          primary="Déconnexion"
          style={{ color: theme.palette.error.main }}
        />
      </ListItem>

      <ConfirmLogout
        open={logoutDialog}
        setOpen={setLogoutDialog}
        theme={theme}
        logout={() => {
          history.push("/");
          dispatch({ type: "PURGE" });
        }}
      />
    </List>
  );
}

export default MenuItems;

function getSublink(children, current) {
  return children.find((ch) => ch.link === current);
}

function thisSelected(parent, children, current) {
  if (parent.link === current) return true;
  return children.filter((ch) => ch.link === current).length > 0;
}
function childSelected(child, current) {
  if (child.link === current) return true;
  return false;
}

const Item = (props) => {
  const { page, drawerOpen, children, closeDrawer } = props;
  const current = useSelector((state) => state.users.current);
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const drawerLink = location.pathname;

  const [open, setOpen] = React.useState(false);
  const sublink = getSublink(children, drawerLink);
  const isCurrentLink = thisSelected(page, children, drawerLink);

  const handleDrawerLinkChange = (link) => {
    if (window.innerWidth <= theme.breakpoints.values.sm) closeDrawer();

    if (link === drawerLink) {
      history.replace(link);
      return;
    }

    history.push(link);
  };

  React.useEffect(() => {
    if (!drawerOpen) setOpen(false);
    else {
      if (
        children.filter((child) => childSelected(child, drawerLink)).length > 0
      )
        setOpen(true);
    }
  }, [drawerOpen]);

  return (
    <>
      <ListItem
        key={props.key}
        style={{
          backgroundColor: isCurrentLink
            ? theme.palette.primary.main
            : "inherit",
        }}
        button
        key={page.text}
        onClick={() => handleDrawerLinkChange(page.link)}
      >
        <ListItemIcon>
          <GetIcon iconName={page.text} selected={isCurrentLink} />
        </ListItemIcon>

        <ListItemText
          primary={page.text}
          secondary={sublink && drawerOpen ? sublink.text : ""}
        />

        {children.length > 0 && (
          <IconButton
            size="small"
            style={{ zIndex: "2000" }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>

      <Collapse in={open}>
        {children.map((child) => (
          <ListItem
            button
            key={child.text}
            onClick={() => handleDrawerLinkChange(child.link)}
          >
            <ListItemIcon></ListItemIcon>
            {childSelected(child) ? <ArrowRight /> : null}
            <ListItemText
              primary={child.text}
              style={{ color: theme.palette.text.secondary }}
            />
            <div style={{ flex: 1 }} />
            <div>{child.count > 0 || ""}</div>
          </ListItem>
        ))}
      </Collapse>
      {willRenderDivider(page, current.role) && <Divider />}
    </>
  );
};

const ConfirmLogout = (props) => {
  const { logout, open, setOpen, theme } = props;
  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        <Typography variant="h6">Deconnexion?</Typography>
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Annuler</Button>
        <Button
          variant="contained"
          disableElevation
          style={{ backgroundColor: theme.palette.error.main, color: "white" }}
          onClick={logout}
        >
          Deconnexion
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function willRenderDivider(page, role) {
  if (
    page.text.toLowerCase() === "accueil" ||
    page.text.toLowerCase() === "candidatures" ||
    page.text.toLowerCase() === "profile" ||
    page.text.toLowerCase() === "etudiants" ||
    (page.text.toLowerCase() === "sujets" && role === "president")
  )
    return true;
}
