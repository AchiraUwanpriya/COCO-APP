import {
  BIOMETRIC_CHECK_REQUEST,
  BIOMETRIC_AVAILABLE,
  BIOMETRIC_NOT_AVAILABLE,
  BIOMETRIC_LOGIN_REQUEST,
  BIOMETRIC_LOGIN_SUCCESS,
  BIOMETRIC_LOGIN_FAIL,
  BIOMETRIC_ENROLL_SUCCESS,
  BIOMETRIC_ENROLL_FAIL,
} from "../constants/biometricConstants";

import {
  VERIFICATION_SUCCESS,
  LOGIN_SUCCESS,
} from "../constants/userConstants";

import AuthService from "../service/AuthService";
import BiometricService from "../service/BiometricService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

/**
 * Helper to display custom styled themed toasts matching Colombo Dockyard corporate design
 */
const showThemedToast = (message, type = "success") => {
  let themeColor = "#0049AF"; // Colombo Dockyard corporate blue
  let icon = "ℹ";

  if (type === "success") {
    themeColor = "#10B981"; // Success Green
    icon = "✓";
  } else if (type === "error") {
    themeColor = "#EF4444"; // Error Red
    icon = "✕";
  } else if (type === "warn") {
    themeColor = "#F59E0B"; // Warn Orange
    icon = "⚠";
  } else if (type === "info") {
    themeColor = "#0049AF"; // Info Blue
    icon = "ℹ";
  }

  toast(
    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "Roboto, sans-serif" }}>
      <div style={{
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        backgroundColor: themeColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "12px",
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ fontSize: "13px", fontWeight: "500", color: "#374151", lineHeight: "1.4" }}>
        {message}
      </div>
    </div>,
    {
      style: {
        borderLeft: `5px solid ${themeColor}`,
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        padding: "10px 12px"
      },
      closeButton: false,
      autoClose: 2500, // 2.5 seconds auto close duration
      draggable: true,
      draggablePercent: 60 // Allow smooth swipe-to-dismiss behavior
    }
  );
};

/**
 * Check if biometric authentication is available on the current device
 * and if credentials have been enrolled
 */
export const checkBiometricAvailability = () => async (dispatch) => {
  dispatch({
    type: BIOMETRIC_CHECK_REQUEST,
  });

  try {
    const isAvailable = await BiometricService.isBiometricAvailable();
    const hasCredentials = BiometricService.hasEnrolledCredentials();

    if (isAvailable && hasCredentials) {
      dispatch({
        type: BIOMETRIC_AVAILABLE,
      });
    } else {
      dispatch({
        type: BIOMETRIC_NOT_AVAILABLE,
      });
    }
  } catch (error) {
    dispatch({
      type: BIOMETRIC_NOT_AVAILABLE,
    });
  }
};

/**
 * Perform biometric login - triggers device biometric prompt,
 * decrypts stored credentials, then calls the existing login flow
 */
export const biometricLogin = (navigate) => async (dispatch) => {
  dispatch({
    type: BIOMETRIC_LOGIN_REQUEST,
  });

  try {
    showThemedToast("Awaiting biometric authentication...", "info");
    const credentials = await BiometricService.authenticateWithBiometric();

    if (credentials && credentials.serviceNo && credentials.password) {
      const response = await AuthService.userLogin(
        credentials.serviceNo,
        credentials.password
      );
      const data = response.data;

      if (data.StatusCode === 200) {
        const authKey = data.AuthKey;

        sessionStorage.setItem("token", JSON.stringify(authKey));
        axios.defaults.headers.common["auth-key"] = authKey;

        dispatch({ type: BIOMETRIC_LOGIN_SUCCESS });
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {},
        });

        showThemedToast("Biometric authentication successful! Logging you in...", "success");
        navigate("/home");
      } else {
        dispatch({
          type: BIOMETRIC_LOGIN_FAIL,
          payload: { msg: "Your Service No or Password is incorrect" },
        });
        showThemedToast("Your Service No or Password is incorrect", "error");
      }
    } else {
      dispatch({
        type: BIOMETRIC_LOGIN_FAIL,
        payload: { msg: "Failed to retrieve credentials" },
      });
      showThemedToast("Biometric login failed. Please sign in manually.", "error");
    }
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      "Biometric authentication failed";

    dispatch({
      type: BIOMETRIC_LOGIN_FAIL,
      payload: { msg: message },
    });

    if (error.message === "Biometric authentication was cancelled or denied") {
      showThemedToast("Biometric authentication cancelled.", "warn");
    } else {
      showThemedToast(message, "error");
    }
  }
};

export const enrollBiometric = (serviceNo, password) => async (dispatch) => {
  try {
    await BiometricService.enrollBiometric(serviceNo, password);
    dispatch({
      type: BIOMETRIC_ENROLL_SUCCESS,
    });
    showThemedToast("Biometric login enabled successfully!", "success");
  } catch (error) {
    dispatch({
      type: BIOMETRIC_ENROLL_FAIL,
      payload: {
        msg: error.message || "Failed to enable biometric login",
      },
    });
    if (error.message === "Biometric enrollment was cancelled or denied") {
      showThemedToast("Biometric enrollment cancelled.", "warn");
    } else {
      showThemedToast(error.message || "Failed to enable biometric login.", "error");
    }
  }
};

/**
 * Remove biometric enrollment
 */
export const removeBiometric = () => async (dispatch) => {
  try {
    BiometricService.clearBiometricData();
    dispatch({
      type: BIOMETRIC_NOT_AVAILABLE,
    });
    showThemedToast("Biometric login has been disabled.", "success");
  } catch (error) {
    showThemedToast("Failed to disable biometric login.", "error");
  }
};
