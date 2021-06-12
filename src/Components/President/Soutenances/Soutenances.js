import {
  Button,
  Checkbox,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
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
import { ExpandLess, ExpandMore } from "@material-ui/icons";

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
  const savedSoutenances = useSelector(
    (state) => state.savedSoutenance.soutenances
  );
  const dispatch = useDispatch();

  const setMaxCrenaux = (value) => {
    dispatch({ type: "UPDATE_VALUES", payload: { prop: "maxCrenaux", value } });
  };
  const setSales = (value) => {
    dispatch({ type: "UPDATE_VALUES", payload: { prop: "sales", value } });
  };

  const [parameters, setParameters] = useState({
    fullTeachers: false,
    saturday: false,
  });
  const [feedback, setFeedback] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [collapse, setCollapse] = useState(true);

  const create = () => {
    console.time("soutenances start");
    const { _soutenances, message } = createSoutenances({
      selectedTeachers,
      selectedProjects,
      startDate,
      endDate,
      maxCrenaux,
      sales,
      presidents,
      saturday: parameters.saturday,
    });
    console.timeEnd("soutenances start");
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
    console.time("assign teachers");
    const fBack = assignTeachers(
      parameters.tags || false,
      parameters.dates || false
    );
    setFeedback({ ...feedback, assignedTeachers: fBack });
    setShowFeedback(true);
    console.timeEnd("assign teachers");
  };

  React.useEffect(() => {
    if (soutenances && soutenances.length) setCollapse(false);
  }, [soutenances]);

  return (
    <div style={{ paddingBottom: "10rem", paddingTop: "1rem" }}>
      {!saved ? (
        <>
          <Paper variant="outlined" style={{ padding: "0.5rem" }}>
            <div className="horizontal-list space-between">
              <Typography
                variant="h6"
                color="primary"
                style={{ flex: "1 1 100%" }}
              >
                Paramètres des soutenances
              </Typography>
              <IconButton size="small" onClick={() => setCollapse(!collapse)}>
                {collapse ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </div>
            <Collapse in={collapse}>
              <div className="horizontal-list wrap">
                <DateSale
                  maxCrenaux={maxCrenaux}
                  setMaxCrenaux={setMaxCrenaux}
                  sales={sales}
                  setSales={setSales}
                  saturday={parameters.saturday}
                />
                <div style={{ flex: "1 1 100%" }}>
                  <Parameter
                    text="Inclure les samedis"
                    parameters={parameters}
                    currentParameter="saturday"
                    setParameters={setParameters}
                  />
                </div>
                <Parameter
                  text="Affecter rapporteurs et présidents"
                  parameters={parameters}
                  currentParameter="fullTeachers"
                  setParameters={setParameters}
                />
                <Parameter
                  text="N'affecte que lorsque les Tags correspondent"
                  parameters={parameters}
                  currentParameter="tags"
                  setParameters={setParameters}
                />
                <Parameter
                  text="N'affecte que lorsque les Dates correspondent"
                  parameters={parameters}
                  currentParameter="dates"
                  setParameters={setParameters}
                />

                <div style={{ flex: "1 1 100%" }} />
                <Button variant="contained" color="primary" onClick={create}>
                  Générer
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAssignTeachers}
                >
                  Affecter des enseignants
                </Button>
                <Button color="primary" onClick={teachersStatistics}>
                  Statistiques des enseignants
                </Button>
                <div style={{ flex: 1 }} />
                <div className="horizontal-list">
                  {savedSoutenances && (
                    <ConfirmDialog
                      title="Charger les soutenances"
                      body="Vous allez perdre les soutenances générées dans cette page en chargeant celles enrégistrées dans la base de données"
                      onConfirm={() =>
                        load_saved_soutenances(savedSoutenances, true)
                      }
                    >
                      <Button variant="contained" color="secondary">
                        Charger
                      </Button>
                    </ConfirmDialog>
                  )}
                  {soutenances && (
                    <ConfirmDialog
                      title="Enrégistrer les soutenances"
                      body="S'il y a des soutenances enrégistrées, vous les perderez en enrégistrant ces unes."
                      onConfirm={() => saveSoutenances()}
                    >
                      <Button variant="contained" color="primary">
                        Enrégistrer
                      </Button>
                    </ConfirmDialog>
                  )}
                </div>

                {showFeedback && (
                  <Feedback
                    showFeedback={showFeedback}
                    setShowFeedback={setShowFeedback}
                    assignedTeachers={feedback.assignedTeachers}
                  />
                )}
              </div>
              <Infos
                sales={sales}
                maxCrenaux={maxCrenaux}
                selectedTeachers={selectedTeachers}
                selectedProjects={selectedProjects}
                presidents={presidents}
                projects={projects}
                teachers={teachers}
              />
            </Collapse>
          </Paper>
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
          saturday={parameters.saturday}
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
