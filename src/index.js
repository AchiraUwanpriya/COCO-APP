import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import axios from "axios";
import { AuthContextProvider } from "./context/AuthContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A5D28",
      dark: "#13461E",
      light: "#4C8C58",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#13461E",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#13461E",
          },
        },
        containedPrimary: {
          backgroundColor: "#1A5D28",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#13461E",
          },
        },
        outlinedPrimary: {
          borderColor: "#1A5D28",
          color: "#1A5D28",
          "&:hover": {
            borderColor: "#13461E",
            backgroundColor: "rgba(26, 93, 40, 0.08)",
          },
        },
        textPrimary: {
          color: "#1A5D28",
          "&:hover": {
            backgroundColor: "rgba(26, 93, 40, 0.08)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(26, 93, 40, 0.08)",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        primary: {
          backgroundColor: "#1A5D28",
          "&:hover": {
            backgroundColor: "#13461E",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#1A5D28",
            fontWeight: 700,
          },
          "&:hover": {
            backgroundColor: "rgba(26, 93, 40, 0.08)",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#1A5D28",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#1A5D28",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#1A5D28",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#1A5D28",
            "& + .MuiSwitch-track": {
              backgroundColor: "#1A5D28",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1A5D28",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1A5D28",
          },
        },
      },
    },
  },
});

axios.defaults.baseURL = "https://coco.dockyardsoftware.com";

axios.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const isAllowedLogin = url.toLowerCase().includes("login/");
    const isAllowedAttendance =
      url.toLowerCase().includes("attendence/getattendencedetails") ||
      url.toLowerCase().includes("attendance/getattendencedetails");

    if (!isAllowedLogin && !isAllowedAttendance) {
      config.adapter = () => {
        return Promise.resolve({
          data: { StatusCode: 200, ResultSet: [], Count: 0 },
          status: 200,
          statusText: "OK",
          headers: {},
          config: config,
        });
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

serviceWorkerRegistration.register();
reportWebVitals();
