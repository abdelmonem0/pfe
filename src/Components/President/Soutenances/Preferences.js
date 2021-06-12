import {
  Button,
  Hidden,
  MobileStepper,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { CheckCircle, Info } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "../../Commun/ConfirmDialog";
import { getStepToShow } from "./SoutenanceLogic";
import Soutenances from "./Soutenances";
import DateSale from "./Steps/DateSale";
import TableView from "./Steps/Projects/TableView";
import Teachers from "./Teachers/Teachers";

const constants = {
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  maxCrenaux: 1,
  sales: "",
  selectedTeachers: [],
  selectedProjects: [],
  presidents: [],
};

function Preferences(props) {
  const values = useSelector((state) => state.soutenance.values);
  const { selectedTeachers, selectedProjects, presidents } =
    values || constants;

  const theme = useTheme();
  const dispatch = useDispatch();

  const setSelectedTeachers = (value) => {
    dispatch({
      type: "UPDATE_VALUES",
      payload: { prop: "selectedTeachers", value },
    });
  };
  const setSelectedProjects = (value) => {
    dispatch({
      type: "UPDATE_VALUES",
      payload: { prop: "selectedProjects", value },
    });
  };
  const setPresidents = (value) => {
    dispatch({ type: "UPDATE_VALUES", payload: { prop: "presidents", value } });
  };

  const [step, setStep] = useState(0);

  const projects = useSelector((state) => state.projects.dataArray);
  // .filter(
  //   (proj) => proj.affecte_a.length > 0
  // );

  const teachers = useSelector((state) => state.soutenance.teachers);

  const handleStep = (willIncrement) => {
    setStep(step + (willIncrement ? 1 : -1));
  };

  const choosePage = () => {
    switch (step) {
      case 0:
        return (
          <TableView
            projects={projects}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
          />
        );
      case 1:
        return (
          <Teachers
            calledFromSoutenances={true}
            selectedTeachers={selectedTeachers}
            setSelectedTeachers={setSelectedTeachers}
            presidents={presidents}
            setPresidents={setPresidents}
          />
        );
      case 2:
        return (
          <Soutenances
            values={values}
            presidents={presidents}
            projects={projects}
            teachers={teachers}
          />
        );
      default:
        return null;
    }
  };

  const [calculatedStep, setCalculatedStep] = useState(-1);
  useEffect(() => {
    const st = getStepToShow(step);
    if (calculatedStep === -1) setStep(st.step);
    setCalculatedStep(st);
  }, [values, step]);

  return (
    (values && projects && teachers && (
      <div style={{ flex: 1 }}>
        <Hidden smDown>
          <Stepper activeStep={step} style={{ backgroundColor: "transparent" }}>
            <Step>
              <StepLabel>
                <Typography>Choisir les sujets</Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Typography>Choisir les enseignants</Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Typography>Générer des soutenances</Typography>
              </StepLabel>
            </Step>
          </Stepper>
          <div className="horizontal-list wrap">
            <Button
              variant="contained"
              color="primary"
              disabled={step <= 0}
              onClick={() => handleStep(false)}
            >
              Précédant
            </Button>

            <ResetValues
              setStep={setStep}
              values={values}
              dispatch={dispatch}
            />
            {calculatedStep.raison !== "success" ? (
              <Tooltip
                style={{ color: theme.palette.warning.main }}
                title={calculatedStep.raison || ""}
              >
                <Info />
              </Tooltip>
            ) : (
              <Tooltip
                title="Términé"
                style={{ color: theme.palette.success.main }}
              >
                <CheckCircle />
              </Tooltip>
            )}
            <div style={{ flex: "1" }} />
            <Button
              variant="contained"
              color="primary"
              disabled={calculatedStep.step <= step || step >= 3}
              onClick={() => handleStep(true)}
            >
              Suivant
            </Button>
          </div>
        </Hidden>

        <div>{choosePage()}</div>
        <Hidden mdUp>
          <MobileStepper
            activeStep={step}
            steps={3}
            position="bottom"
            backButton={
              <Button
                variant="outlined"
                size="small"
                disabled={step <= 0}
                onClick={() => handleStep(false)}
              >
                Précédant
              </Button>
            }
            nextButton={
              <Button
                variant="outlined"
                size="small"
                disabled={calculatedStep.step <= step || step >= 3}
                onClick={() => handleStep(true)}
              >
                Suivant
              </Button>
            }
          />
        </Hidden>
      </div>
    )) || <div>Soutenances - Preferences.js</div>
  );
}

export default Preferences;

const ResetValues = ({ values, dispatch, setStep }) => {
  const _values = { ...values };
  const constants = {
    maxCrenaux: 1,
    sales: "",
    selectedTeachers: [],
    selectedProjects: [],
    presidents: [],
  };

  const disabled = JSON.stringify(_values) === JSON.stringify(constants);

  return (
    <ConfirmDialog
      title="Réinitialiser"
      body="Voulez-vous vraiment réinitialiser les paramètres?"
      onConfirm={() => {
        setStep(0);
        dispatch({ type: "RESET_VALUES" });
      }}
    >
      <Button disabled={disabled} variant="outlined" color="primary">
        Réinitialiser
      </Button>
    </ConfirmDialog>
  );
};
