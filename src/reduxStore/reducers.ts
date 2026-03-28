import {
  STORE_TOKEN,
  STORE_USER_DETAILS,
  FIRST_VISIT,
  USER_LOGOUT,
  STORE_DESIGN,
  CLEAR_DESIGN,
  STORE_MATERIAL,
  STORE_IMAGES,
  STORE_TOP_ID,
  STORE_TOP_OBJ,
  FILE_PATH,
  AUDIO_RECORDING,
  GROUP_ID,
  LOGIN_DETAILS,
} from "./actions";

interface initialState {
  auth_token: string;
  userDetails: any;
  firstVisit: boolean;
  loginDetails :any;
}

interface designState {
  designDetails: {
    shankId: string;
    baseId: string;
    gemsetId: string;
    headId: string;
    baseObj: string;
    headObj: string;
  };
  topId: string;
  topObj: string;
  groupId: string;
  savedMaterial: {
    color: number;
    metalness: number;
    roughness: number;
  };
  images: {
    thumbnail: string | Blob;
    topView: string | Blob;
    image: string | Blob;
  };
}

interface initialPath {
  path: string;
  audio: string;
}

const initialPathState: initialPath = {
  path: "",
  audio: "",
};

const initialUserState: initialState = {
  auth_token: "",
  userDetails: {},
  firstVisit: true,
};

const initialDesignState: designState = {
  designDetails: {
    shankId: "",
    baseId: "",
    gemsetId: "",
    headId: "",
    baseObj: "",
    headObj: "",
  },
  groupId: "",
  topId: "",
  topObj: "",
  savedMaterial: {
    color: 0,
    metalness: 0,
    roughness: 0,
  },
  images: {
    thumbnail: "",
    topView: "",
    image: "",
  },
};

export function userReducer(state = initialUserState, action: any) {
  switch (action.type) {
    case STORE_TOKEN:
      return { ...state, auth_token: action.payload };
    case STORE_USER_DETAILS:
      return { ...state, userDetails: action.payload };
    case LOGIN_DETAILS:
      return { ...state, loginDetails: action.payload };
    case FIRST_VISIT:
      return { ...state, firstVisit: action.payload };
    case USER_LOGOUT:
      return initialUserState;
    default:
      return state;
  }
}

export function designReducer(state = initialDesignState, action: any) {
  switch (action.type) {
    case STORE_DESIGN:
      return { ...state, designDetails: action.payload };
    case STORE_TOP_ID:
      return { ...state, topId: action.payload };
    case STORE_TOP_OBJ:
      return { ...state, topObj: action.payload };
    case STORE_MATERIAL:
      return { ...state, savedMaterial: action.payload };
    case STORE_IMAGES:
      return { ...state, images: action.payload };
    case CLEAR_DESIGN:
      return initialDesignState;
    case GROUP_ID:
      return { ...state, groupId: action.payload };
    default:
      return state;
  }
}

export function pathReducer(state = initialPathState, action: any) {
  // console.log(action.payload);
  switch (action.type) {
    case FILE_PATH:
      return { ...state, path: action.payload };
    case AUDIO_RECORDING:
      return { ...state, audio: action.payload };
    default:
      return state;
  }
}
