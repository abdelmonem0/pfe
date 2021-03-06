import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Login from "./Components/Login";
import { Button, Hidden } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Redirect from "./Components/Redirect";
import { useHistory, useLocation } from "react-router-dom";
import NotificationBar from "./Components/Commun/Notification/NotificationBar";
import { Brightness4, Brightness7, ExitToApp } from "@material-ui/icons";
import MenuItems from "./Components/MenuItems";
import RedirectPage from "./Components/RedirectPage";
import { canAddProject } from "./Components/Commun/Constraints";
import SwitchAccount from "./Components/MenuItems/SwitchAccount";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  menuButton: {
    marginRight: 36,
    [theme.breakpoints.down("sm")]: {
      marginRight: "0",
    },
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarMini: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
}));

function MainDrawer(props) {
  const { themeType, setThemeType } = props;
  const classes = useStyles();
  const theme = useTheme();

  const current = useSelector((state) => state.users.current);
  const pages = useSelector((state) => state.pages.pages);
  const dispatch = useDispatch();

  const history = useHistory();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const [authorized, setAuthorized] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    const pathname = location.pathname;
    const pagesLinks = pages.map((page) => page.link);
    const auth =
      pagesLinks.indexOf(pathname) > -1 ||
      pathname === "/" ||
      (pathname === "/modifier" && canAddProject());
    setAuthorized(auth);
  }, [current, pages, location.pathname]);

  return authorized ? (
    <div className={classes.root}>
      <CssBaseline />
      {current && (
        <>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                {current.nom}
              </Typography>
              <Hidden smDown>
                <div style={{ margin: "0 0.5rem" }}>
                  <SwitchAccount button={true} />
                </div>
              </Hidden>
              <div style={{ flex: 1 }} />
              {current.role !== "admin" && (
                <>
                  <IconButton onClick={() => setThemeType()}>
                    {themeType === "dark" ? (
                      <Brightness7 />
                    ) : (
                      <Brightness4 style={{ fill: "white" }} />
                    )}
                  </IconButton>
                  <NotificationBar />
                </>
              )}
              <Hidden smDown>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: theme.palette.error.main,
                    color: "white",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  disableElevation
                  onClick={() => {
                    history.replace("/");
                    dispatch({ type: "PURGE" });
                  }}
                  endIcon={<ExitToApp />}
                >
                  Deconnexion
                </Button>
              </Hidden>
            </Toolbar>
          </AppBar>

          <Hidden smDown>
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              })}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                }),
              }}
            >
              <div
              // onMouseEnter={handleDrawerOpen}
              // onMouseLeave={handleDrawerOpen}
              >
                <div className={classes.toolbar}>
                  <IconButton onClick={handleDrawerOpen}>
                    {theme.direction === "rtl" ? (
                      <ChevronRightIcon />
                    ) : (
                      <ChevronLeftIcon />
                    )}
                  </IconButton>
                </div>
                <Divider />
                <MenuItems
                  drawerOpen={open}
                  pages={pages}
                  closeDrawer={handleDrawerOpen}
                />
              </div>
            </Drawer>
          </Hidden>
          <Hidden mdUp>
            <Drawer
              anchor="left"
              open={open}
              classes={{ paper: classes.drawerOpen }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              onClose={handleDrawerOpen}
            >
              <div
                className={
                  "horizontal-list space-between " + classes.toolbarMini
                }
                style={{ paddingLeft: "1rem" }}
              >
                <Typography variant="h6" color="primary">
                  {current.nom}
                </Typography>
                <IconButton onClick={handleDrawerOpen}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </div>
              <Divider />
              <MenuItems
                drawerOpen={open}
                pages={pages}
                closeDrawer={handleDrawerOpen}
              />
            </Drawer>
          </Hidden>
        </>
      )}

      <Main current={current} classes={classes} themeType={themeType} />
    </div>
  ) : (
    <RedirectPage setAuthorized={setAuthorized} />
  );
}

export default MainDrawer;

const Main = React.memo((props) => {
  return (
    <div className={props.classes.content}>
      <div className={props.current ? props.classes.toolbar : ""} />

      {props.current ? <Redirect current={props.current} /> : <Login />}
    </div>
  );
});
