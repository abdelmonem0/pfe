import {
  Button,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Project_States } from "../../../Constants";

function FiltreProjects(props) {
  const [expand, setExpand] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const { projects, setProjects, fetchedProjects } = props;

  function resetAll() {
    setSelectedTags([]);
  }

  function getTags() {
    var tagsArray = [];
    fetchedProjects.forEach((proj) => {
      var projTags = [];
      proj.tags.forEach((t) => projTags.push(t.id_tag.replace(" ", "")));
      tagsArray = tagsArray.concat(projTags);
    });

    tagsArray = tagsArray.filter((el, idx) => tagsArray.indexOf(el) === idx);
    tagsArray = tagsArray.sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
    return tagsArray;
  }
  const tags = getTags();

  function handleTagClick(tag) {
    var sTags = selectedTags;
    if (selectedTags.indexOf(tag) === -1) sTags = [...sTags, tag];
    else sTags = sTags.filter((el) => el !== tag);

    setSelectedTags(sTags);
  }

  function tagIsSelected(tag) {
    return selectedTags.indexOf(tag) !== -1;
  }

  function filterByTag(p) {
    var filtered = p.filter(
      (el) =>
        el.tags.filter((el1) => selectedTags.indexOf(el1.id_tag) !== -1)
          .length > 0
    );
    if (selectedTags.length === 0) filtered = fetchedProjects;

    return filtered;
  }

  function sort(p) {
    p.sort((a, b) => {
      return a.etat > b.etat;
    });
    p.sort((a, b) => {
      return a.affecte_a.length > b.affecte_a.length;
    });
    for (let pr of p) console.log(pr.etat, pr.affecte_a.length > 0);
  }

  useEffect(() => {
    var temp = filterByTag(fetchedProjects);

    if (temp.length < 1) temp = fetchedProjects;
    sort(temp);
    setProjects(temp);
  }, [selectedTags]);

  return (
    <Paper style={{ padding: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Filtrer les sujets</Typography>
        <IconButton onClick={() => setExpand(!expand)}>
          {expand ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Button size="small" onClick={() => resetAll()}>
          Reset
        </Button>
      </div>
      <Collapse in={expand}>
        <div style={{ padding: "0.5rem" }}>
          <Typography gutterBottom>Par categories</Typography>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <Chip
                color={tagIsSelected(tag) ? "primary" : "default"}
                variant={tagIsSelected(tag) ? "default" : "outlined"}
                onClick={() => handleTagClick(tag)}
                size="small"
                label={tag}
                key={tag}
              />
            ))}
          </div>
        </div>
      </Collapse>
    </Paper>
  );
}

export default FiltreProjects;
