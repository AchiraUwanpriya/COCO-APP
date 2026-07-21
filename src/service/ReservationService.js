import axios from "axios";
import { method } from "lodash";

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const GetResDetailsHistory = async () => mockRes();
const GetLoadResDetails = async () => mockRes();
const UpdateCaretakerReport = async (data) => mockRes();
const GetGuestFeeDetails = async (reservationNo) => mockRes();
const GetPriorityListByDate = async (bungalowId, date) => mockRes();
const PostResvationLog = async () => mockRes();
const UpdateResStatus = async () => mockRes();



export default {
    GetResDetailsHistory,
    GetLoadResDetails,
    GetGuestFeeDetails,
    UpdateCaretakerReport ,
    GetPriorityListByDate,
    PostResvationLog,
    UpdateResStatus
};