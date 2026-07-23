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

const mockCdllocbaseAttendance = [
  { Division: "SHIP REPAIR", Location: "Head Office / Dock 1", Sno: "0004086", Name: "A.B. Perera", Desc: "Senior Engineer", CIN: "07:45 AM", COUT: "04:30 PM", CNO: "C-101" },
  { Division: "SHIP REPAIR", Location: "Head Office / Dock 1", Sno: "0002810", Name: "M.N. Silva", Desc: "Supervisor", CIN: "07:50 AM", COUT: "", CNO: "C-102" },
  { Division: "SHIP REPAIR", Location: "Head Office / Dock 2", Sno: "0003112", Name: "K.D. Gunaratne", Desc: "Technician", CIN: "08:00 AM", COUT: "05:00 PM", CNO: "C-103" },
  { Division: "SHIP BUILDING", Location: "Yard 2 Berth", Sno: "0003595", Name: "K.L. Fernando", Desc: "Technician", CIN: "07:30 AM", COUT: "", CNO: "C-201" },
  { Division: "SHIP BUILDING", Location: "Yard 2 Workshop", Sno: "0004120", Name: "P.R. Kumara", Desc: "Fabricator", CIN: "07:40 AM", COUT: "04:30 PM", CNO: "C-202" },
  { Division: "OFFSHORE & ENG", Location: "Offshore Site A", Sno: "0001890", Name: "H.M. Wickramasinghe", Desc: "Project Engineer", CIN: "08:10 AM", COUT: "", CNO: "C-301" }
];

const getBannerImages = async () => mockRes();
const GetAccessHeadComponent = async () => mockRes();
const GetUserByServiceNo = async () => Promise.resolve({ data: { StatusCode: 200, ResultSet: mockUserProfile } });
const GetToDoList = async () => mockRes();
const GetDailyCollect = async (params = {}) => mockRes();
const GetChaserDailyCollect = async (params = {}) => mockRes();
const PostDailyCollect = async (payload) => mockRes();
const UpdateDailyCollect = async (payload) => mockRes();
const GetCdllocbaseAttendance = async (hadDate) => Promise.resolve({ data: { StatusCode: 200, ResultSet: mockCdllocbaseAttendance } });
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
