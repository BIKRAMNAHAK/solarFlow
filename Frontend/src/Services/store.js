import { applyMiddleware, compose, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";
import rootReducer from "./Reducers/combineReducer";

// Safe WebStorage implementation for Vite / ESM compatibility
const storage = {
  getItem: (key) => {
    return Promise.resolve(
      typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    );
  },
  setItem: (key, item) => {
    return Promise.resolve(
      typeof window !== "undefined" ? window.localStorage.setItem(key, item) : null
    );
  },
  removeItem: (key) => {
    return Promise.resolve(
      typeof window !== "undefined" ? window.localStorage.removeItem(key) : null
    );
  },
};

const composeEnhancers =
  (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["states"], // sirf states reducer persist hoga
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
export default store;