import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "./reducers";

// const store = createStore(
//   reducers,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;

function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );

  return store;
}

export default configureStore;
