const projectsReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_PROJECTS":
      state = action.payload;
      return state;
    case "PURGE":
      state = {};
      return state;
    default:
      console.log("projectsReducer Unknown action!");
      return state;
  }
};

export default projectsReducer;
