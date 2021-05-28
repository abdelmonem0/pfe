import {
  Button,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close, ExpandLess, ExpandMore, Search } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import {
  handle_filter_button,
  getFilters,
  sortByDate,
  get_matched_search_projects,
} from "./filterLogic";

function FiltreProjects(props) {
  const [expand, setExpand] = useState(false);
  const [currentFilter, setCurrentFilter] = useState([]);
  const [multiFilters, setMultiFilters] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [textValue, setTextValue] = useState("");
  const { projects, setProjects, fetchedProjects } = props;

  const filters = getFilters();
  function resetAll() {}

  const handleFilterButtonClick = (event) => {
    handle_filter_button(
      event,
      setProjects,
      fetchedProjects,
      currentFilter,
      setCurrentFilter,
      filters
    );
  };

  const handleSerachFielChange = (event) => {
    const value = event.target.value;
    setTextValue(value);
    if (value.length > 0) {
      const _projects = multiFilters ? projects : fetchedProjects;
      const matched = get_matched_search_projects(_projects, value);
      setSearchResults(matched);
    } else {
      setSearchResults(null);
    }
  };

  return (
    <Paper style={{ padding: "0.5rem" }}>
      <div
        className="horizontal-list space-between wrap"
        style={{ paddingBottom: "0.5rem" }}
      >
        <div className="horizontal-list">
          <IconButton size="small" onClick={() => setExpand(!expand)}>
            {expand ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Typography>Filtrer et trier</Typography>

          {(multiFilters || expand) && (
            <div
              className="horizontal-list pointer"
              onClick={() => setMultiFilters(!multiFilters)}
            >
              <Checkbox checked={multiFilters} />
              <Typography color={multiFilters ? "secondary" : "textPrimary"}>
                Filtres multiples
              </Typography>
            </div>
          )}
        </div>
        <div className="horizontal-list">
          {textValue.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              disabled={searchResults && searchResults.length < 1}
              style={{ textTransform: "none" }}
              onClick={() => setProjects(searchResults)}
            >
              {searchResults.length + " résultats"}
            </Button>
          )}
          <TextField
            size="small"
            placeholder="   Rechercher"
            variant="outlined"
            value={textValue}
            onChange={handleSerachFielChange}
            InputProps={{
              startAdornment: <Search />,
              endAdornment: textValue.length > 0 && (
                <InputAdornment>
                  <IconButton size="small" onClick={() => setTextValue("")}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <Collapse in={expand}>
        <div className="horizontal-list wrap">
          {Object.keys(filters).map((key) => (
            <React.Fragment key={key}>
              {(filters[key].length > 0 && (
                <Button
                  onClick={handleFilterButtonClick}
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
                null}
            </React.Fragment>
          ))}
        </div>
      </Collapse>
    </Paper>
  );
}

export default FiltreProjects;
