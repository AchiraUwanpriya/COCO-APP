import axios from "axios";

const GetEmployees = async () => {
  const config = {
    method: "get",
    url: "/EMP/GetEmployees",
  };

  return axios.request(config).then((response) => {
    const d = response.data || {};
    const StatusCode = d.StatusCode ?? d.statusCode ?? 200;
    const ResultSet = d.ResultSet ?? d.resultSet ?? [];
    return { ...response, data: { ...d, StatusCode, ResultSet } };
  });
};

// Single employee by HED_EMPLOYEE_ID → /EMP/GetEmployeebyID?p_hedEmployeeId=<id>
const GetEmployeeById = async (employeeId) => {
  const config = {
    method: "get",
    url: "/EMP/GetEmployeebyID",
    params: { p_hedEmployeeId: employeeId },
  };

  return axios.request(config).then((response) => {
    const d = response.data || {};
    const StatusCode = d.StatusCode ?? d.statusCode ?? 200;
    const ResultSet = d.ResultSet ?? d.resultSet ?? d.Result ?? d.result ?? [];
    return { ...response, data: { ...d, StatusCode, ResultSet } };
  });
};

export default {
  GetEmployees,
  GetEmployeeById,
};