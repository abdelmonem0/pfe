import usersReducer from "./users";
import projectsReducer from "./projects";
import pagesReducer from "./pages";
import candidaturesReducer from "./candidatures";

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import filesReducer from "./files";
import likesReducer from "./likes";
import constantsReducer from "./constants";
import tagsReducer from "./tags";
import soutenanceReducer from "./soutenance";
import notificationsReducer from "./notifications";
import datesReducer from "./dates";
import avisReducer from "./avis";

const persistConfig = {
  key: "root",
  storage,
  whiteliste: [
    "users",
    "projects",
    "candidatures",
    "soutenance",
    "likes",
    "tags",
    "notifications",
  ],
};

const allReducers = combineReducers({
  users: usersReducer,
  projects: projectsReducer,
  pages: pagesReducer,
  candidatures: candidaturesReducer,
  files: filesReducer,
  constants: constantsReducer,
  avis: avisReducer,
  likes: likesReducer,
  tags: tagsReducer,
  soutenance: soutenanceReducer,
  notifications: notificationsReducer,
  dates: datesReducer,
});

export default persistReducer(persistConfig, allReducers);
