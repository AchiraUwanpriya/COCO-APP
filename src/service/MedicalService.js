import axios from "axios";

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const GetUserMedicalDetails = async (year) => mockRes();
const GetMedicalIndoorUsageDetails = async (year) => mockRes();
const GetMedicalOutdoorUsageDetails = async (year) => mockRes();

export default {
    GetUserMedicalDetails,
    GetMedicalIndoorUsageDetails,
    GetMedicalOutdoorUsageDetails,
};