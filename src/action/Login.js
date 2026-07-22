// import {
//   LOGIN_SUCCESS,
//   LOGIN_FAIL,
//   LOGIN_REQUEST,
//   VERIFICATION_REQUEST,
//   VERIFICATION_FAIL,
//   VERIFICATION_SUCCESS,
//   LOGOUT_SUCCESS,
// } from "../constants/userConstants";

// import {
//   GET_USER_REQUEST,
//   GET_USER_FAIL,
//   GET_USER_SUCCESS,
// } from "../constants/commonContant";

// import AuthService from "../service/AuthService";
// import CommonService from "../service/CommonService";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const getDeviceInfo = () => {
//   const userAgent = navigator.userAgent;
//   let device = "Unknown Device";

//   if (/Android/i.test(userAgent)) {
//     device = "Android Mobile";
//   } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
//     device = "iOS Device";
//   } else if (/Windows/i.test(userAgent)) {
//     device = "Windows PC";
//   } else if (/Mac/i.test(userAgent)) {
//     device = "Mac Computer";
//   } else if (/Linux/i.test(userAgent)) {
//     device = "Linux Computer";
//   }

//   if (/Chrome/i.test(userAgent)) {
//     device += " (Chrome)";
//   } else if (/Firefox/i.test(userAgent)) {
//     device += " (Firefox)";
//   } else if (/Safari/i.test(userAgent)) {
//     device += " (Safari)";
//   } else if (/Edge/i.test(userAgent)) {
//     device += " (Edge)";
//   }

//   return device;
// };

// const getIPAddress = async () => {
//   try {
//     const response = await fetch("https://api.ipify.org?format=json");
//     const data = await response.json();
//     return data.ip || "Unknown IP";
//   } catch (error) {
//     console.error("Failed to get IP address:", error);
//     return "Unknown IP";
//   }
// };

// export const login = (service_no, password, navigate) => async (dispatch) => {
//   dispatch({
//     type: LOGIN_REQUEST,
//   });

//   try {
//     const device = getDeviceInfo();
//     const ip = await getIPAddress();

//     return await AuthService.login(service_no, password, device, ip).then(
//       (data) => {
//         if (data.data.StatusCode === 200) {
//           localStorage.setItem("logId", data.data.LogId);
//           dispatch({
//             type: VERIFICATION_REQUEST,
//             payload: {
//               number: service_no,
//               password,
//               useData: data.data.UserDetails,
//               token: data.data.Token,
//               OTP: data.data.OTP,
//               device: device,
//               logId: data.data.LogId,
//               ip: ip,
//             },
//           });
//           navigate(`/Verification`);
//         } else {
//           dispatch({
//             type: LOGIN_FAIL,
//             payload: {
//               msg: "Your User ID or Password is incorrect",
//             },
//           });
//           toast.error("Your User ID or Password is incorrect");
//         }
//         return Promise.resolve();
//       },
//       (error) => {
//         const message =
//           (error.response &&
//             error.response.data &&
//             error.response.data.message) ||
//           error.message ||
//           error.toString();
//         dispatch({
//           type: LOGIN_FAIL,
//           payload: {
//             msg: message,
//           },
//         });
//         toast.error(message);
//         return Promise.reject();
//       },
//     );
//   } catch (error) {
//     dispatch({
//       type: LOGIN_FAIL,
//       payload: {
//         msg: "Failed to get device information",
//       },
//     });
//     toast.error("Failed to get device information");
//     return Promise.reject();
//   }
// };

// export const OTPVerify = (useData, token, navigate) => async (dispatch) => {
//   console.log(token);
//   if (token) {
//     dispatch({
//       type: VERIFICATION_SUCCESS,
//       payload: {
//         user: useData,
//         Token: token,
//       },
//     });
//     dispatch({
//       type: LOGIN_SUCCESS,
//       payload: {
//         //  data: data.data.UserDetails,
//       },
//     });
//     localStorage.setItem("token", JSON.stringify(token));

//     navigate("/dashboard");
//     window.location.reload();
//   } else {
//     dispatch({
//       type: VERIFICATION_FAIL,
//       payload: {
//         msg: "Invalid OTP. Please try again!",
//       },
//     });
//     toast.error("Invalid OTP. Please try again!");
//   }
// };

// export const loadUser = () => async (dispatch) => {
//   dispatch({
//     type: LOGIN_REQUEST,
//   });
//   dispatch({
//     type: GET_USER_REQUEST,
//   });
//   return await CommonService.GetUserByServiceNo().then(
//     (data) => {
//       if (data.data.StatusCode === 200) {
//         dispatch({
//           type: GET_USER_SUCCESS,
//           payload: {
//             data: data.data.ResultSet,
//           },
//         });
//         dispatch({
//           type: LOGIN_SUCCESS,
//           payload: {
//             data: data.data.ResultSet,
//           },
//         });
//       } else {
//         dispatch({
//           type: GET_USER_FAIL,
//           payload: {
//             msg: "Failed to load user details",
//           },
//         });
//         dispatch({
//           type: LOGIN_FAIL,
//           payload: {
//             msg: "Failed to load user details",
//           },
//         });
//       }
//       return Promise.resolve();
//     },
//     (error) => {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       dispatch({
//         type: GET_USER_FAIL,
//         payload: {
//           msg: message,
//         },
//       });
//     },
//   );
// };

// export const logOut = (navigate) => async (dispatch) => {
//   localStorage.clear();
//   dispatch({
//     type: LOGOUT_SUCCESS,
//   });
//   navigate("/");
//   setTimeout(() => {
//     window.location.reload(true);
//   }, 100);
// };






//------------------------- Biometrics -------------------------

import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  VERIFICATION_REQUEST,
  VERIFICATION_FAIL,
  VERIFICATION_SUCCESS,
  LOGOUT_SUCCESS,
} from "../constants/userConstants";

import {
  GET_USER_REQUEST,
  GET_USER_FAIL,
  GET_USER_SUCCESS,
} from "../constants/commonContant";

import AuthService from "../service/AuthService";
import CommonService from "../service/CommonService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let device = "Unknown Device";

  if (/Android/i.test(userAgent)) {
    device = "Android Mobile";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    device = "iOS Device";
  } else if (/Windows/i.test(userAgent)) {
    device = "Windows PC";
  } else if (/Mac/i.test(userAgent)) {
    device = "Mac Computer";
  } else if (/Linux/i.test(userAgent)) {
    device = "Linux Computer";
  }

  if (/Chrome/i.test(userAgent)) {
    device += " (Chrome)";
  } else if (/Firefox/i.test(userAgent)) {
    device += " (Firefox)";
  } else if (/Safari/i.test(userAgent)) {
    device += " (Safari)";
  } else if (/Edge/i.test(userAgent)) {
    device += " (Edge)";
  }

  return device;
};

const getIPAddress = async () => {
  return "127.0.0.1";
};

export const login = (service_no, password, navigate, isBiometric = false) => async (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
  });

  try {
    return await AuthService.userLogin(service_no, password).then(
      (data) => {
        if (data.data.StatusCode === 200) {
          const authKey = data.data.AuthKey;

          sessionStorage.setItem("token", JSON.stringify(authKey));
          axios.defaults.headers.common["auth-key"] = authKey;

          dispatch({
            type: LOGIN_SUCCESS,
            payload: {},
          });

          navigate("/home");
        } else {
          dispatch({
            type: LOGIN_FAIL,
            payload: {
              msg: "Your Service No or Password is incorrect",
            },
          });
          toast.error("Your Service No or Password is incorrect");
        }
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch({
          type: LOGIN_FAIL,
          payload: {
            msg: message,
          },
        });
        toast.error(message);
        return Promise.reject();
      },
    );
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: {
        msg: "Login failed. Please try again.",
      },
    });
    toast.error("Login failed. Please try again.");
    return Promise.reject();
  }
};

export const phoneLogin = (mobileNumber, navigate) => async (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
  });

  try {
    const response = await AuthService.phoneLogin(mobileNumber);
    const data = response.data;
    console.log("Phone login API response:", data);

    const isSuccess =
      data.StatusCode === 200 ||
      data.StatusCode === "200" ||
      data.statusCode === 200 ||
      (response.status === 200 && data.StatusCode !== 400 && data.StatusCode !== 500);

    const extractedToken =
      data.Token ||
      data.AuthKey ||
      data.token ||
      data.authKey ||
      data.ResultSet?.Token ||
      data.ResultSet?.AuthKey ||
      data.ResultSet?.token ||
      data.ResultSet?.authKey ||
      (Array.isArray(data.ResultSet) && (data.ResultSet[0]?.AuthKey || data.ResultSet[0]?.Token || data.ResultSet[0]?.authKey || data.ResultSet[0]?.token)) ||
      data.UserDetails?.Token ||
      data.UserDetails?.AuthKey ||
      data.UserDetails?.token ||
      data.UserDetails?.authKey ||
      (Array.isArray(data.UserDetails) && (data.UserDetails[0]?.AuthKey || data.UserDetails[0]?.Token || data.UserDetails[0]?.authKey || data.UserDetails[0]?.token)) ||
      data.Data?.Token ||
      data.Data?.AuthKey ||
      data.Data?.token ||
      data.Data?.authKey ||
      null;

    if (isSuccess) {
      dispatch({
        type: VERIFICATION_REQUEST,
        payload: {
          number: mobileNumber,
          msg: data.Message || "Verification code sent successfully",
          useData: data.UserDetails || data.ResultSet || null,
          token: extractedToken,
          encryptedOTP: data.EncryptedOTP || data.OTP || data.EncryptedOtp || null,
          plainOTP:
            data.OTP?.toString() ||
            data.Otp?.toString() ||
            data.otp?.toString() ||
            data.EncryptedOTP?.toString() ||
            data.EncryptedOtp?.toString() ||
            null,
        },
      });
      navigate("/Verification");
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: {
          msg: data.Message || "Failed to send verification code",
        },
      });
      toast.error(data.Message || "Failed to send verification code");
    }
    return Promise.resolve();
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: LOGIN_FAIL,
      payload: {
        msg: message,
      },
    });
    toast.error(message);
    return Promise.reject();
  }
};

export const OTPVerify = (useData, token, navigate) => async (dispatch) => {
  console.log("OTPVerify called, token:", token);

  const originalToken =
    token ||
    useData?.Token ||
    useData?.AuthKey ||
    useData?.token ||
    useData?.authKey ||
    (Array.isArray(useData) && (useData[0]?.AuthKey || useData[0]?.Token || useData[0]?.authKey || useData[0]?.token)) ||
    "";

  // Always dispatch success — OTP was already validated locally before this is called
  dispatch({
    type: VERIFICATION_SUCCESS,
    payload: {
      user: useData,
      Token: originalToken,
    },
  });
  dispatch({
    type: LOGIN_SUCCESS,
    payload: {
      data: useData,
      token: originalToken,
    },
  });

  if (originalToken) {
    sessionStorage.setItem("token", JSON.stringify(originalToken));
    axios.defaults.headers.common["auth-key"] = originalToken;
  }

  navigate("/home");
};

export const loadUser = () => async (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
  });
  dispatch({
    type: GET_USER_REQUEST,
  });
  return await CommonService.GetUserByServiceNo().then(
    (data) => {
      if (data.data.StatusCode === 200) {
        dispatch({
          type: GET_USER_SUCCESS,
          payload: {
            data: data.data.ResultSet,
          },
        });
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            data: data.data.ResultSet,
          },
        });
      } else {
        dispatch({
          type: GET_USER_FAIL,
          payload: {
            msg: "Failed to load user details",
          },
        });
        dispatch({
          type: LOGIN_FAIL,
          payload: {
            msg: "Failed to load user details",
          },
        });
      }
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: GET_USER_FAIL,
        payload: {
          msg: message,
        },
      });
    },
  );
};

export const logOut = (navigate) => async (dispatch) => {
  const biometricKeys = ["biometric_credentials", "biometric_crypto_key", "biometric_enrolled", "biometric_credential_id", "biometric_token"];
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!biometricKeys.includes(key)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  dispatch({
    type: LOGOUT_SUCCESS,
  });

  sessionStorage.clear();

  // Flag that the user explicitly logged out so we don't auto-prompt biometrics on the login page immediately
  sessionStorage.setItem("explicit_logout", "true");

  navigate("/");
  setTimeout(() => {
    window.location.reload(true);
  }, 100);
};
