import React, { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import AttendanceCard from "../../components/Cards/AttendanceCard";
import dayjs from "dayjs";
import { GetAttendenceDetails } from "../../action/Attendance";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetAttendenceDetails(selectedDate));
  }, [dispatch, selectedDate]);

  const handleDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mx: 2,
          gap: 2,
        }}
      >
        {/* Left Side - Date Input */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            label="Attendance Date"
            type="date"
            size="small"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 170,
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "36px",
                fontSize: "13px",
              },
            }}
          />
        </Box>

        {/* Right Side - Back Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ textTransform: "none", height: "32px" }}
        >
          Back
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginLeft: 1,
          marginRight: 1,
          marginBottom: "70px",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          <AttendanceCard />
        </Box>
      </Box>
    </Box>
  );
};
export default Attendance;