const projectsReducer = (state = { dataArray: [] }, action) => {
  switch (action.type) {
    case "SET_PROJECTS":
      state = { ...state, dataArray: action.payload };
      return state;
    case "SET_CAHIER":
      var projects = [...state.dataArray];
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id_sujet === action.payload.attache_a) {
          projects[i] = {
            ...projects[i],
            fichiers: [...projects[i].fichiers, action.payload],
          };
          console.log(projects[i].fichiers);
        }
      }
      state = { ...state, dataArray: projects };
      return state;
    case "PURGE":
      state = { dataArray: [] };
      return state;
    default:
      return state;
  }
};

export default projectsReducer;
