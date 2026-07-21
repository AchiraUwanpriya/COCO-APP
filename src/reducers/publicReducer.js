import {
  BANNER_REQUEST,
  BANNER_SUCCESS,
  BANNER_FAIL,
  GET_USER_FAIL,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
} from "../constants/commonContant";
import {
  HEAD_ACCESS_FAIL,
  HEAD_ACCESS_REQUEST,
  HEAD_ACCESS_SUCCESS,
} from "../constants/HeadAccessContant";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

export const getBannerImages = (state = initialState, action) => {
  switch (action.type) {
    case BANNER_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
      };
    case BANNER_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: null,
      };
    case BANNER_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        responseBody: [],
      };
    default:
      return state;
  }
};

const HeadComponentInitialState = {
  headComponent: [],
  error: null,
  msg: null,
  loading: false,
};

export const GetAccessHeadComponent = (
  state = HeadComponentInitialState,
  action
) => {
  switch (action.type) {
    case HEAD_ACCESS_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
      };
    case HEAD_ACCESS_SUCCESS:
      return {
        ...state,
        loading: false,
        headComponent: action.payload.headComponent,
        msg: null,
      };
    case HEAD_ACCESS_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        headComponent: [],
      };
    default:
      return state;
  }
};

const mockUserProfile = [
  {
    ServiceNo: "2004867",
    ReportName: "R.I.P Dissanayake",
    Designation: "Senior Software Engineer",
    MobileNo: "+94 77 123 4567",
    Email: "rip.dissanayake@dockyardsoftware.com",
    Division: "Information Technology",
    Department: "Software Development",
    Location: "Colombo Head Office",
    RecruitmentDate: "2018-05-15",
    PermanantDate: "2018-11-15",
    RetirementDate: "2048-05-15",
    ReportingOfficerDetails: {
      ReportName: "H.M.R Sriyantha",
      ServiceNo: "2004866",
      Designation: "Head of Information Technology",
    },
  },
];

const userInitialState = {
  data: mockUserProfile,
  loading: false,
};

export const GetUserByServiceNo = (state = userInitialState, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data && action.payload.data.length > 0 ? action.payload.data : mockUserProfile,
      };
    case GET_USER_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        data: mockUserProfile,
      };
    default:
      return state;
  }
};
