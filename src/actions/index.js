export const setUsers = (users) => {
  return {
    type: "SET_USERS",
    payload: users,
  };
};

export const setCurrentUser = (user) => {
  return {
    type: "SET_CURRENT_USER",
    payload: user,
  };
};
