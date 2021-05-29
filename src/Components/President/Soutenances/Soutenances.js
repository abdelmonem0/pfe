import { Button, Checkbox, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Infos from "./Infos";
import {
  assignTeachers,
  createSoutenances,
  load_saved_soutenances,
  saveSoutenances,
  teachersStatistics,
} from "./SoutenanceLogic";
import SoutenanceHolder from "./SoutenanceHolder";
import { useDispatch, useSelector } from "react-redux";
import Feedback from "./Feedback";
import ConfirmDialog from "../../Commun/ConfirmDialog";
import DateSale from "./Steps/DateSale";

function Soutenances(props) {
  const { saved, values, projects, teachers } = props;
  const {
    startDate,
    endDate,
    sales,
    maxCrenaux,
    selectedTeachers,
    selectedProjects,
    presidents,
  } = values;
  const soutenances = useSelector((state) => state.soutenance.soutenances);
  const dispatch = useDispatch();

  const setMaxCrenaux = (value) => {
    dispatch({ type: "UPDATE_VALUES", payload: { prop: "maxCrenaux", value } });
  };
  const setSales = (value) => {
    dispatch({ type: "UPDATE_VALUES", payload: { prop: "sales", value } });
  };

  const [parameters, setParameters] = useState({ fullTeachers: false });
  const [feedback, setFeedback] = useState({});
  const [saturday, setSaturday] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const create = () => {
    const { _soutenances, message } = createSoutenances({
      selectedTeachers,
      selectedProjects,
      startDate,
      endDate,
      maxCrenaux,
      sales,
      presidents,
      saturday,
    });
    dispatch({ type: "SET_SOUTENANCES", payload: _soutenances });
    dispatch({
      type: "OPEN_SNACK",
      payload: {
        message: message.length
          ? message
          : _soutenances.length + " soutenances sont générées.",
        type: message.length ? "warning" : "success",
      },
    });
  };

  const handleAssignTeachers = () => {
    const fBack = assignTeachers(
      parameters.tags || false,
      parameters.dates || false
    );
    setFeedback({ ...feedback, assignedTeachers: fBack });
    setShowFeedback(true);
  };

  return (
    <div style={{ paddingBottom: "10rem" }}>
      {!saved ? (
        <>
          <Typography>
            <Checkbox
              checked={saturday}
              onChange={() => setSaturday(!saturday)}
            />{" "}
            Inclure les samedis
          </Typography>
          <DateSale
            maxCrenaux={maxCrenaux}
            setMaxCrenaux={setMaxCrenaux}
            sales={sales}
            setSales={setSales}
            saturday={saturday}
          />
          <Infos
            sales={sales}
            maxCrenaux={maxCrenaux}
            selectedTeachers={selectedTeachers}
            selectedProjects={selectedProjects}
            presidents={presidents}
            projects={projects}
            teachers={teachers}
          />
          <Paper
            variant="outlined"
            className="horizontal-list wrap"
            style={{ padding: "0.5rem" }}
          >
            <Typography
              variant="h6"
              color="primary"
              style={{ flex: "1 1 100%" }}
            >
              Paramètres des soutenances
            </Typography>
            <Parameter
              text="Affecter rapporteurs et présidents"
              parameters={parameters}
              currentParameter="fullTeachers"
              setParameters={setParameters}
            />
            <Parameter
              text="Strict tags"
              parameters={parameters}
              currentParameter="tags"
              setParameters={setParameters}
            />
            <Parameter
              text="Strict dates"
              parameters={parameters}
              currentParameter="dates"
              setParameters={setParameters}
            />

            <div style={{ flex: "1 1 100%" }} />
            <Button onClick={create}>Générer</Button>
            <Button onClick={handleAssignTeachers}>Assign teachers</Button>
            <Button onClick={teachersStatistics}>Teachers stats</Button>
            <Button onClick={() => load_saved_soutenances(soutenances)}>
              Load
            </Button>
            {showFeedback && (
              <Feedback
                showFeedback={showFeedback}
                setShowFeedback={setShowFeedback}
                assignedTeachers={feedback.assignedTeachers}
              />
            )}
          </Paper>
          <Button onClick={() => saveSoutenances()}>save</Button>{" "}
        </>
      ) : (
        <ConfirmDialog
          title="Modifiers les soutenances"
          text="En continuant, vous allez perdre tout paramètres et soutenances dans la page Soutenance."
        >
          <Button variant="outlined">Modifier les soutenances</Button>
        </ConfirmDialog>
      )}
      {soutenances && (
        <SoutenanceHolder
          saved={saved}
          soutenances={soutenances}
          values={values}
          saturday={saturday}
        />
      )}
    </div>
  );
}

export default Soutenances;

const Parameter = (props) => {
  const { text, setParameters, parameters, currentParameter } = props;

  return (
    <div
      className="horizontal-list"
      style={{ alignItems: "center" }}
      onClick={() =>
        setParameters({
          ...parameters,
          [currentParameter]: !parameters[currentParameter],
        })
      }
      style={{ cursor: "pointer" }}
    >
      <Checkbox style={{ padding: 0 }} checked={parameters[currentParameter]} />
      <Typography
        color={parameters[currentParameter] ? "secondary" : "textPrimary"}
      >
        {text}
      </Typography>
    </div>
  );
};
