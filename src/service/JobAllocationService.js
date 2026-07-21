import axios from "axios";

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const GetJobCard = async (date) => mockRes();
const GetUnAssignedList = async (date) => mockRes();

export default {
    GetJobCard,
    GetUnAssignedList,
};
