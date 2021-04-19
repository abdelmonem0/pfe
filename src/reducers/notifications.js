const notificationsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export default notificationsReducer;
