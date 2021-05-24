const notificationsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      state = action.payload;
      return state;
    case "CHECK_NOTIFICATIONS":
      var nots = [...state];
      for (let i = 0; i < nots.length; i++) nots[i].checked = true;
      state = nots;
      return state;
    default:
      return state;
  }
};

export default notificationsReducer;
