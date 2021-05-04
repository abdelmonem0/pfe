import { AccountCircle, DoneOutlined } from "@material-ui/icons";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import TuneIcon from "@material-ui/icons/Tune";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import HomeIcon from "@material-ui/icons/Home";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import React from "react";

const GetIcon = React.memo((props) => {
  switch (props.iconName.toLowerCase()) {
    case "profile":
      return <AccountCircle />;
    case "sujets":
      return <AccountTreeIcon />;
    case "ajouter":
      return <LibraryAddIcon />;
    case "préférences":
      return <TuneIcon />;
    case "candidatures":
      return <MoveToInboxIcon />;
    case "soutenances":
      return <MeetingRoomIcon />;
    case "enseignants":
      return <SupervisorAccountIcon />;
    case "accueil":
      return <HomeIcon />;
    default:
      return <DoneOutlined />;
  }
});

export default GetIcon;
