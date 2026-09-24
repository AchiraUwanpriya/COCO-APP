import React from "react";
import { Box } from "@mui/material";
import EmployeeSection from "../../components/Cards/EmployeeSection";

const Employees = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        marginLeft: 1,
        marginRight: 1,
        overflow: "auto",
        paddingBottom: { md: "100px" },
      }}
    >
      <EmployeeSection />
    </Box>
  );
};

export default Employees;