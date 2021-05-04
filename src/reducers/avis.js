const avisReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_AVIS":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export default avisReducer;
