import { AccountCircle, DoneOutlined, Unarchive } from "@material-ui/icons";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import EventNoteIcon from "@material-ui/icons/EventNote";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import SchoolIcon from "@material-ui/icons/School";
import TuneIcon from "@material-ui/icons/Tune";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import HomeIcon from "@material-ui/icons/Home";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import React from "react";

const GetIcon = React.memo((props) => {
  switch (props.iconName.toLowerCase()) {
    case "profile":
      return <AccountCircle style={{ fill: props.selected ? "white" : "" }} />;
    case "proposer":
      return <Unarchive style={{ fill: props.selected ? "white" : "" }} />;
    case "sujets":
      return (
        <AccountTreeIcon style={{ fill: props.selected ? "white" : "" }} />
      );
    case "ajouter":
      return <LibraryAddIcon style={{ fill: props.selected ? "white" : "" }} />;
    case "préférences":
      return <TuneIcon style={{ fill: props.selected ? "white" : "" }} />;
    case "candidatures":
      return (
        <MoveToInboxIcon style={{ fill: props.selected ? "white" : "" }} />
      );
    case "soutenances":
      return (
        <MeetingRoomIcon style={{ fill: props.selected ? "white" : "" }} />
      );
    case "dates":
      return <EventNoteIcon style={{ fill: props.selected ? "white" : "" }} />;
    case "etudiants":
      return (
        <SupervisorAccountIcon
          style={{ fill: props.selected ? "white" : "" }}
        />
      );
    case "enseignants":
      return <SchoolIcon style={{ fill: props.selected ? "white" : "" }} />;
    case "accueil":
      return <HomeIcon style={{ fill: props.selected ? "white" : "" }} />;
    default:
      return <DoneOutlined style={{ fill: props.selected ? "white" : "" }} />;
  }
});

export default GetIcon;
