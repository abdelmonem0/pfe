const candidaturesReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_CANDIDATURES":
      state = action.payload
      return state;
    case "PURGE":
      state = [];
      return state;
    default:
      return state;
  }
};

export default candidaturesReducer;
