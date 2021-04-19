const soutenanceReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_SOUTENANCE_PROJECTS":
      state = { ...state, projects: action.payload };
      return state;
    case "SET_TEACHERS_DATES":
      state = { ...state, dates: action.payload };
      return state;
    case "SET_TEACHERS_TAGS":
      state = { ...state, tags: action.payload };
      return state;
    default:
      return state;
  }
};

export default soutenanceReducer;
