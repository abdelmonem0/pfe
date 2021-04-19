const soutenanceReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_SOUTENANCE_PROJECTS":
      state = { ...state, projects: action.payload };
      return state;
    default:
      return state;
  }
};

export default soutenanceReducer;
