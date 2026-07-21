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
    <BrowserRouter>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </Provider>
);

serviceWorkerRegistration.register();
reportWebVitals();
