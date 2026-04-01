import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { Dispatch } from "redux";

export const USERNAME = "USERNAME";
export const STORE_TOKEN = "STORE_TOKEN";
export const STORE_USER_DETAILS = "STORE_USER_DETAILS";
export const FIRST_VISIT = "FIRST_VISIT";
export const USER_LOGOUT = "USER_LOGOUT";
export const EMAIL_VERIFIED = "EMAIL_VERIFIED";
export const MOBILE_VERIFIED = "MOBILE_VERIFIED";
export const STORE_DESIGN = "STORE_DESIGN";
export const STORE_MATERIAL = "STORE_MATERIAL";
export const STORE_IMAGES = "STORE_IMAGES";
export const CLEAR_DESIGN = "CLEAR_DESIGN";
export const STORE_TOP_ID = "STORE_TOP_ID";
export const STORE_TOP_OBJ = "STORE_TOP_OBJ";
export const AUDIO_RECORDING = "AUDIO_RECORDING";
export const FILE_PATH = "FILE_PATH";
export const GROUP_ID = "GROUP_ID";
export const LOGIN_DETAILS = "LOGIN_DETAILS";

export const storeToken = (token: any) => (dispatch: Dispatch) => {
  dispatch({
    type: STORE_TOKEN,
    payload: token,
  });
};

export const userLogout = () => (dispatch: Dispatch) => {
  dispatch({
    type: USER_LOGOUT,
  });
};

export const username = (token: any) => (dispatch: Dispatch) => {
  dispatch({
    type: USERNAME,
    payload: token,
  });
};

export const firstVisit = (data: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: FIRST_VISIT,
    payload: data,
  });
};

export const userDetails = (data: any) => (dispatch: Dispatch) => {
  // console.log("USER DETAILS ==>", data)
  dispatch({
    type: STORE_USER_DETAILS,
    payload: data,
  });
};

export const loginDetails = (data: any) => (dispatch: Dispatch) => {
  // console.log("USER DETAILS ==>", data)
  dispatch({
    type: LOGIN_DETAILS,
    payload: data,
  });
};

export const storeDesign = (data: any) => (dispatch: Dispatch) => {
  dispatch({
    type: STORE_DESIGN,
    payload: data,
  });
};
export const storeTopId = (data: any) => (dispatch: Dispatch) => {
  dispatch({
    type: STORE_TOP_ID,
    payload: data,
  });
};
export const storeTopObj = (data: any) => (dispatch: Dispatch) => {
  dispatch({
    type: STORE_TOP_OBJ,
    payload: data,
  });
};

export const storeMaterial = (data: any) => (dispatch: Dispatch) => {
  dispatch({
    type: STORE_MATERIAL,
    payload: data,
  });
};

export const storeImages = (data: any) => (dispatch: Dispatch) => {
  dispatch({
    type: STORE_IMAGES,
    payload: data,
  });
};

export const clearDesign = () => (dispatch: Dispatch) => {
  dispatch({
    type: CLEAR_DESIGN,
  });
};
export const filePath = (data: any) => (dispatch: Dispatch) => {
  dispatch({
    type: FILE_PATH,
    payload: data,
  });
};
// export const audioRecording = (data: any)=>(dispatch: Dispatch)=>{
//     console.log("first")
//     dispatch({
//         type: AUDIO_RECORDING,
//         payload: data,
//     })
// }

export const audioRecording = (data: any) => {
  console.log("first");
  return {
    type: AUDIO_RECORDING,
    payload: data,
  };
};

export const groupId = (data: any) => {
  // console.log("group ID", data);
  return {
    type: GROUP_ID,
    payload: data,
  };
};
