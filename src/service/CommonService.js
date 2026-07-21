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

const getBannerImages = async () => mockRes();
const GetAccessHeadComponent = async () => mockRes();
const GetUserByServiceNo = async () => Promise.resolve({ data: { StatusCode: 200, ResultSet: mockUserProfile } });
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
