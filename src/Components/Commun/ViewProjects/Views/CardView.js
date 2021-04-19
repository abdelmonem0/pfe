import { React } from "react";
import {} from "@material-ui/core";
import ProjectCard from "../ProjectCard";

function CardView(props) {
  const {
    projects,
    openProject,
    setSelectedProject,
    setAddCandidature,
  } = props;

  return (
    <>
      {projects.map((project) => (
        <ProjectCard
          key={project.id_sujet}
          project={project}
          openProject={openProject}
          setSelectedProject={setSelectedProject}
          openCandidature={setAddCandidature}
        />
      ))}
    </>
  );
}

export default CardView;
