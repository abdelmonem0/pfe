import {
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import {
  DateRange,
  ExpandLess,
  ExpandMore,
  School,
  SupervisorAccount,
} from "@material-ui/icons";
import React from "react";
import { getCandidatureState, getUsernameByID } from "./CandidatureLogic";

function CandidatureHeader(props) {
  const { candidature, open, setOpen } = props;
  const theme = useTheme();
  const people = getUsernameByID(candidature);
  const state = getCandidatureState(candidature, theme);
  return (
    <div className="vertical-list">
      <div>
        <div className="horizontal-list space-between">
          <CandidatureState state={state} />
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
        <CandidaturePeople candidature={candidature} people={people} />
      </div>
    </div>
  );
}

export default CandidatureHeader;

const CandidatureState = (props) => {
  const { state } = props;

  return (
    <Typography variant="h5" style={{ color: state.color }}>
      {state.etat}
    </Typography>
  );
};

const CandidaturePeople = (props) => {
  const { people, candidature } = props;

  return (
    <div className="name-list-container">
      <div className="name-list">
        <DateRange />
        <Typography variant="body2">
          {new Date(candidature.date).toLocaleDateString("fr-FR")}
        </Typography>
      </div>
      {people.others.length > 0 && (
        <Tooltip title={people.type}>
          <div className="name-list">
            <SupervisorAccount />
            {people.others.map((name) => (
              <Typography variant="body2" key={name} color="textSecondary">
                {name}
              </Typography>
            ))}
          </div>
        </Tooltip>
      )}
      {people.partner.length > 0 && (
        <Tooltip title="Partner">
          <div className="name-list">
            <School />
            {people.partner.map((name) => (
              <Typography variant="body2" key={name} color="textSecondary">
                {name}
              </Typography>
            ))}
          </div>
        </Tooltip>
      )}
    </div>
  );
};
