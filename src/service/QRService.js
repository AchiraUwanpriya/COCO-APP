import axios from "axios";

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const GetEWODetails = async (ewoNo) => mockRes();
const RecieveEWODetails = async (formData) => mockRes();
const SendEWODetails = async (requestBody) => mockRes();
const GetEmployeeDetails = async () => mockRes();
const LoadResDetailsByServiceNo = async () => mockRes();

export default {
  GetEWODetails,
  RecieveEWODetails,
  SendEWODetails,
  GetEmployeeDetails,
  LoadResDetailsByServiceNo,
};
