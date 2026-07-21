import axios from 'axios';

const BASE_URL = 'KPI_Dashboard';

export const fetchDashboardDetails = async (year) => {
    return [];
};

export const checkPdfExists = async (year, serialNo) => {
    return false;
};

export const getPdfUrl = (year, serialNo) =>
    `${BASE_URL}/ViewPDF?PDFName=${year}_${serialNo}`;