import {
  Button,
  makeStyles,
  Paper,
  Divider,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getUserByID } from "../../../Commun/Candidature.js/CandidatureLogic";
import { Person, School } from "@material-ui/icons";
import { getAllProjects } from "../../../redirectLogic";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  enterFromLeft: {
    height: "100%",
    animation: `$effectFromLeft 500ms ${theme.transitions.easing.easeInOut}`,
    transform: "translateX(0)",
    opacity: 1,
  },
  exitToRight: {
    height: "100%",
    animation: `$effectExitToRight 500ms ${theme.transitions.easing.easeInOut}`,
    transform: "translateX(200%)",
    opacity: 0,
  },
  enterFromRight: {
    height: "100%",
    animation: `$effectFromRight 500ms ${theme.transitions.easing.easeInOut}`,
    transform: "translateX(0)",
    opacity: 1,
  },
  exitToLeft: {
    height: "100%",
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
  const projects = getAllProjects()._public;
  const [index, setIndex] = useState(0);
  const [enterFromLeft, setEnterFromLeft] = useState(false);
  const classes = useStyles();

  const handleIndex = (step) => {
    if (enterFromLeft) {
      setEnterFromLeft(false);
      return;
    }
    const nextIndex = calculateIndex(index, step, projects.length);
    setIndex(nextIndex);
  };

  const { reset, interval } = useInterval(() => {
    handleIndex(1);
  }, 3000);
  const theme = useTheme();

  useEffect(() => {
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    projects &&
    projects.length > 0 && (
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
              setIndex(calculateIndex(index, -1, projects.length));
            }}
          >
            Précédent
          </Button>
          <div className="horizontal-list">
            {projects.map((p, i) => (
              <div
                onClick={() => {
                  reset();
                  if (i < index) setEnterFromLeft(true);
                  else setEnterFromLeft(false);
                  setIndex(i);
                }}
                style={{
                  height: "10px",
                  width: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    index === i ? "gray" : theme.palette.background.default,
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              />
            ))}
          </div>
          <Button
            onClick={() => {
              reset();
              if (enterFromLeft) {
                setEnterFromLeft((enterFromLeft) => !enterFromLeft);
                return;
              }
              setIndex(calculateIndex(index, 1, projects.length));
            }}
          >
            Suivant
          </Button>
        </div>
      </Paper>
    )
  );
}

export default Swipable;

const Project = ({ project }) => {
  return (
    <Link
      to={`?pid=${project.id_sujet}`}
      className="vertical-list link-style"
      style={{ height: "100%" }}
    >
      <div className="vertical-list">
        <Typography variant="h6" color="primary">
          {project.titre}
        </Typography>
        <Divider />
        <div className="horizontal-list wrap">
          {(project.encadrants[0] && (
            <Typography variant="body2" color="textSecondary">
              <Person size="small" /> {project.encadrants[0].nom}{" "}
              {project.encadrants.length > 1 &&
                " - " + project.encadrants[1].nom}
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
      </div>
      <div
        className="vertical-list"
        style={{ flex: "1 1 100%", justifyContent: "space-around" }}
      >
        <div>
          <Typography variant="h6" color="primary">
            Description
          </Typography>
          <Typography>{project.description}</Typography>
        </div>

        <div>
          <Typography variant="h6" color="primary">
            Travail
          </Typography>
          <Typography>{project.travail}</Typography>
        </div>
      </div>
    </Link>
  );
};

function calculateIndex(current, step, projectsCount) {
  var nextStep = current + step;
  if (nextStep >= projectsCount) nextStep = 0;
  if (nextStep < 0) nextStep = projectsCount - 1;

  return nextStep;
}
