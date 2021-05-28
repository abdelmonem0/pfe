import {
  Button,
  makeStyles,
  Paper,
  Divider,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getUserByID } from "../../../Commun/Candidature.js/CandidatureLogic";
import { Person, School } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  enterFromLeft: {
    animation: `$effectFromLeft 500ms ${theme.transitions.easing.easeInOut}`,
    transform: "translateX(0)",
    opacity: 1,
  },
  exitToRight: {
    animation: `$effectExitToRight 500ms ${theme.transitions.easing.easeInOut}`,
    transform: "translateX(200%)",
    opacity: 0,
  },
  enterFromRight: {
    animation: `$effectFromRight 500ms ${theme.transitions.easing.easeInOut}`,
    transform: "translateX(0)",
    opacity: 1,
  },
  exitToLeft: {
    animation: `$effectExitToLeft 500ms ${theme.transitions.easing.easeInOut}`,
    transform: "translateX(-200%)",
    opacity: 0,
  },
  "@keyframes effectFromLeft": {
    "0%": {
      opacity: 0,
      transform: "translateX(-200%)",
    },
    "50%": {
      opacity: 0.2,
    },
    "100%": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  "@keyframes effectExitToRight": {
    "0%": {
      opacity: 1,
      transform: "translateX(0)",
    },
    "50%": {
      opacity: 0.5,
    },
    "100%": {
      opacity: 0,
      transform: "translateX(200%)",
    },
  },
  "@keyframes effectFromRight": {
    "0%": {
      opacity: 0,
      transform: "translateX(200%)",
    },
    "50%": {
      opacity: 0.2,
    },
    "100%": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  "@keyframes effectExitToLeft": {
    "0%": {
      opacity: 1,
      transform: "translateX(0)",
    },
    "50%": {
      opacity: 0.5,
    },
    "100%": {
      opacity: 0,
      transform: "translateX(-200%)",
    },
  },
}));

function useInterval(callback, delay) {
  const savedCallback = useRef();
  const intervalID = useRef();
  const [reset, setReset] = useState(false);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    intervalID.current = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(intervalID.current);
  }, [delay, reset]);

  return {
    reset: () => {
      clearInterval(intervalID.current);
      setReset(!reset);
    },
    interval: intervalID,
  };
}

function Swipable(props) {
  const projects = useSelector((state) => state.projects.dataArray);
  const [index, setIndex] = useState(0);
  const [enterFromLeft, setEnterFromLeft] = useState(false);
  const classes = useStyles();

  const handleIndex = (step) => {
    if (enterFromLeft) {
      setEnterFromLeft((enterFromLeft) => !enterFromLeft);
      return;
    }
    setIndex((index) =>
      index + step === projects.length
        ? 0
        : index + step < 0
        ? projects.length - 1
        : index + step
    );
  };

  const { reset, interval } = useInterval(() => {
    handleIndex(1);
  }, 5000);

  useEffect(() => {
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <Paper
      className="vertical-list space-between"
      style={{ flex: "1 1 39%", minHeight: "80vh", padding: "1rem" }}
    >
      <div
        className="vertical-list space-between"
        style={{
          position: "relative",
          overflow: "hidden",
          flex: "1",
          height: "100%",
        }}
      >
        <div
          className={clsx({
            [classes.enterFromRight]: index % 2 === 0 && !enterFromLeft,
            [classes.exitToLeft]: index % 2 === 1 && !enterFromLeft,
            [classes.enterFromLeft]: index % 2 === 0 && enterFromLeft,
            [classes.exitToRight]: index % 2 === 1 && enterFromLeft,
          })}
          style={{
            height: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
          }}
        >
          <Project
            project={
              projects[
                Math.abs(
                  index % 2 === 0
                    ? enterFromLeft
                      ? index - 1 < 0
                        ? projects.length - 1
                        : index - 1
                      : index
                    : enterFromLeft
                    ? index
                    : index - 1 < 0
                    ? projects.length - 1
                    : index - 1
                ) % projects.length
              ]
            }
          />
        </div>
        <div
          className={clsx({
            [classes.enterFromRight]: index % 2 === 1 && !enterFromLeft,
            [classes.exitToLeft]: index % 2 === 0 && !enterFromLeft,
            [classes.enterFromLeft]: index % 2 === 1 && enterFromLeft,
            [classes.exitToRight]: index % 2 === 0 && enterFromLeft,
          })}
          style={{
            height: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
          }}
        >
          <Project
            project={
              projects[
                Math.abs(
                  index % 2 === 1
                    ? enterFromLeft
                      ? index - 1 < 0
                        ? projects.length - 1
                        : index - 1
                      : index
                    : enterFromLeft
                    ? index
                    : index - 1 < 0
                    ? projects.length - 1
                    : index - 1
                ) % projects.length
              ]
            }
          />
        </div>
      </div>
      <div className="horizontal-list space-between">
        <Button
          onClick={() => {
            reset();
            if (!enterFromLeft) {
              setEnterFromLeft((enterFromLeft) => !enterFromLeft);
              return;
            }
            setIndex((index) => index - 1);
          }}
        >
          Précédent
        </Button>
        <Typography>{index + " - " + (index - 1)}</Typography>
        <Button
          onClick={() => {
            reset();
            if (enterFromLeft) {
              setEnterFromLeft((enterFromLeft) => !enterFromLeft);
              return;
            }
            setIndex((index) => index + 1);
          }}
        >
          Suivant
        </Button>
      </div>
    </Paper>
  );
}

export default Swipable;

const Project = ({ project }) => {
  return (
    <div className="vertical-list">
      <Typography variant="h6" color="primary">
        {project.titre}
      </Typography>
      <Divider />
      <div className="horizontal-list wrap">
        {(project.encadrants[0] && (
          <Typography variant="body2" color="textSecondary">
            <Person size="small" /> {project.encadrants[0].nom}{" "}
            {project.encadrants.length > 1 && " - " + project.encadrants[1].nom}
          </Typography>
        )) ||
          (project.id_etudiant && (
            <Typography variant="body2" color="textSecondary">
              <School size="small" /> {getUserByID(project.id_etudiant).nom}{" "}
              {project.id_etudiant_2 &&
                " - " + getUserByID(project.id_etudiant_2).nom}
            </Typography>
          ))}
      </div>
      <div>
        <Typography variant="h6" color="primary">
          Description
        </Typography>
        <Typography>{project.description}</Typography>
      </div>
    </div>
  );
};
