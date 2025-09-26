import {
  SWITCH_LANGUAGE,
  CHANGE_COLLAPSED,
  GET_SETTINGS,
  GET_ALL_FETCH_FAIL,
} from "../types";
// import { API_URL } from "../../../config";
import axios from "axios";
export function switchLanguage(locale) {
  return {
    type: SWITCH_LANGUAGE,
    payload: locale,
  };
}

export function changeCollapsed_r(collapsed) {
  return {
    type: CHANGE_COLLAPSED,
    payload: collapsed,
  };
}

export const settings_r = () => async (dispatch) => {
  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/settingspublic`)
    .then((res) => {
      dispatch({
        type: GET_SETTINGS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ALL_FETCH_FAIL,
        payload:
          err.message +
          ": " +
          err.config.url.replace(`${process.env.NEXT_PUBLIC_API_URL}/api`),
      });
    });
};
