import axios from "axios";

const readAuthKey = () => {
  const raw = sessionStorage.getItem("token");
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    return parsed || raw;
  } catch (err) {
    return raw;
  }
};

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const getBannerImages = async () => mockRes();
const GetAccessHeadComponent = async () => mockRes();
const GetUserByServiceNo = async () => mockRes();
const GetToDoList = async () => mockRes();
const GetDailyCollect = async (params = {}) => mockRes();
const GetChaserDailyCollect = async (params = {}) => mockRes();
const PostDailyCollect = async (payload) => mockRes();
const UpdateDailyCollect = async (payload) => mockRes();
const GetCdllocbaseAttendance = async (hadDate) => mockRes();
const GetEmployeeNoPay = async (barcodeNo, currentYear) => mockRes();
const GetEmployeeDetails = async (p_sno) => mockRes();
const GetEmployeeAttSummary = async (p_sno) => mockRes();
const GetEmployeeOtherInfo = async (p_sno) => mockRes();

export default {
  getBannerImages,
  GetAccessHeadComponent,
  GetUserByServiceNo,
  GetToDoList,
  GetDailyCollect,
  PostDailyCollect,
  UpdateDailyCollect,
  GetCdllocbaseAttendance,
  GetEmployeeNoPay,
  GetEmployeeDetails,
  GetEmployeeAttSummary,
  GetEmployeeOtherInfo,
  GetChaserDailyCollect
};
