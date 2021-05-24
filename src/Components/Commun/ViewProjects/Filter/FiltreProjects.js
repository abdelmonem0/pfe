import {
  Button,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { store } from "../../../..";
import { Project_States } from "../../../../Constants";
import { sortByDate } from "../logic";
import Filter from "./Filter";

function FiltreProjects(props) {
  const [expand, setExpand] = useState(false);
  const [currentFilter, setCurrentFilter] = useState([]);
  const [multiFilters, setMultiFilters] = useState(false);
  const { projects, setProjects, fetchedProjects } = props;

  const filters = getFilters();
  function resetAll() {}

  const handleFilterButton = (event) => {
    const filter = event.target.innerHTML;
    var filtered = fetchedProjects;
    var _filters = [...currentFilter];
    if (_filters.indexOf(filter) < 0) _filters = [...currentFilter, filter];
    else _filters = currentFilter.filter((f) => f !== filter);
    setCurrentFilter(_filters);

    if (_filters.indexOf(filters.with_cahier) > -1)
      filtered = filtered.filter(
        (project) =>
          project.fichiers.length > 0 &&
          project.fichiers.filter(
            (f) => f.type.toLowerCase().indexOf("cahier") > -1
          ).length > 0
      );

    if (_filters.indexOf(filters.affected) > -1)
      filtered = filtered.filter((project) => project.affecte_a.length > 0);

    if (_filters.indexOf(filters.not_affected) > -1)
      filtered = filtered.filter((project) => project.affecte_a.length === 0);

    if (_filters.indexOf(filters.accepted) > -1)
      filtered = filtered.filter(
        (project) => project.etat === Project_States.accepted
      );

    if (_filters.indexOf(filters.refused) > -1)
      filtered = filtered.filter(
        (project) => project.etat === Project_States.refused
      );

    if (_filters.indexOf(filters.waiting) > -1)
      filtered = filtered.filter(
        (project) => project.etat === Project_States.waiting
      );

    setProjects(filtered);
  };

  return (
    <Paper style={{ padding: "0.5rem" }}>
      <div className="horizontal-list">
        <Typography variant="h6">Filtrer les sujets</Typography>
        <IconButton onClick={() => setExpand(!expand)}>
          {expand ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Button size="small">Reset</Button>
      </div>
      <Collapse in={expand}>
        <div
          className="horizontal-list pointer"
          onClick={() => setMultiFilters(!multiFilters)}
        >
          <Checkbox checked={multiFilters} />
          <Typography color={multiFilters ? "secondary" : "textPrimary"}>
            Filtres multiples
          </Typography>
        </div>
        <div className="horizontal-list wrap">
          {Object.keys(filters).map((key) => {
            return (
              (filters[key].length > 0 && (
                <Button
                  onClick={handleFilterButton}
                  color={
                    currentFilter.indexOf(filters[key]) > -1
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  style={{ textTransform: "none" }}
                  variant="outlined"
                >
                  {filters[key]}
                </Button>
              )) ||
              null
            );
          })}
        </div>
      </Collapse>
    </Paper>
  );
}

export default FiltreProjects;

const getFilters = () => {
  const state = store.getState();
  const role = state.users.current.role;
  return {
    liked: role === "etudiant" ? "Sujets aimés" : "",
    personal: role === "etudiant" || role === "enseignant" ? "Mes sujets" : "",
    with_cahier: role === "president" ? "Sujets avec cahier de charge" : "",
    affected: "Sujets affectés",
    not_affected: "Sujets non affectés",
    accepted: "Sujets acceptés",
    refused: role === "president" ? "Sujets réfusées" : "",
    waiting: "Sujets en instance",
  };
};
