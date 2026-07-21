import axios from "axios";

const mockRes = () => Promise.resolve({ data: { StatusCode: 200, ResultSet: [] } });

const getGetBudgetShopPriceList = async () => mockRes();
const SearchBudgetShop = async (key) => mockRes();

export default {
  getGetBudgetShopPriceList,
  SearchBudgetShop,
};
