import axios from "axios";

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const getCheckDetails = async () => mockRes();
const markCheckStatus = async (reservationNo, checkStatus) => mockRes();
const addCaretFeedback = async (reservationNo, caretReport, caretStatus) => mockRes();
const getCaretFeedbackDetails = async (reservationNo) => mockRes();

export default {
  getCheckDetails,
  markCheckStatus,
  addCaretFeedback,
  getCaretFeedbackDetails,
};