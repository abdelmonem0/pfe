import { React, useEffect, useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ProjectCard from "../ProjectCard";

function CardView(props) {
  const {
    projects,
    openProject,
    setSelectedProject,
    setAddCandidature,
  } = props;

  const [page, setPage] = useState(1);
  const [elPerPage, setElPerPage] = useState(5);
  const [willScrollToTop, setWillScrollToTop] = useState(false);
  const pagesCount = Math.ceil(projects.length / elPerPage);

  const sliceStart = (page - 1) * elPerPage;
  const sliceEnd = sliceStart + elPerPage;

  const handlePageChange = (e, v) => {
    setPage(v);
    window.scrollTo(0, 0);
  };
  return (
    <>
      <Pagination
        count={pagesCount}
        defaultPage={1}
        page={page}
        color="primary"
        onChange={handlePageChange}
      />
      {projects.slice(sliceStart, sliceEnd).map((project) => (
        <ProjectCard
          key={project.id_sujet}
          project={project}
          openProject={openProject}
          setSelectedProject={setSelectedProject}
          openCandidature={setAddCandidature}
        />
      ))}
      <Pagination
        count={pagesCount}
        defaultPage={1}
        page={page}
        color="primary"
        onChange={handlePageChange}
      />
    </>
  );
}

export default CardView;
