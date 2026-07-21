import axios from "axios";

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const GetLeaveBalance = async (month) => mockRes();
const GetNotEnteredLeave = async (month) => mockRes();
const GetPunctuality = async (month) => mockRes();
const GetLeaveSummary = async (month) => mockRes();

export default {
  GetLeaveBalance,
  GetNotEnteredLeave,
  GetPunctuality,
  GetLeaveSummary,
};
