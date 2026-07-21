// CDLLocationChart.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CommonService from "../../service/CommonService";

// ─── Color helpers ───────────────────────────────────────────────────────────
const rateColor = (pct) =>
  pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";

const rateBg = (pct) =>
  pct >= 80 ? "#dcfce7" : pct >= 60 ? "#fef3c7" : "#fee2e2";

function PctBadge({ pct }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: "7px",
        py: "1px",
        borderRadius: "10px",
        fontSize: 11,
        fontWeight: 600,
        background: rateBg(pct),
        color: rateColor(pct),
      }}
    >
      {pct}%
    </Box>
  );
}

// Helper to check if employee is present
const isPresent = (emp) => emp.inn && emp.inn !== "NR" && emp.inn !== "";

// Normalize row data
const normalizeRow = (item) => ({
  division: (item?.Division || item?.division || "").trim() || "Unknown",
  loc: (item?.Location || item?.location || "").trim() || "Unknown",
  sno: item?.Sno || item?.sno || "",
  repname: item?.Name || item?.name || "",
  des: item?.Desc || item?.des || "",
  inn: item?.CIN || item?.inn || "",
  pout: item?.COUT || item?.pout || "",
  cno: item?.CNO || item?.cno || "",
});

export default function CDLLocationChart() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [divisions, setDivisions] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await CommonService.GetCdllocbaseAttendance();
        const resultSet = response?.data?.ResultSet || [];
        const normalized = resultSet.map(normalizeRow);
        
        if (active) {
          setAllData(normalized);
          
          // Extract unique divisions for dropdown
          const uniqueDivisions = [...new Set(normalized.map(item => item.division))].sort();
          setDivisions(uniqueDivisions);
          
          // Set default selected division (first one)
          if (uniqueDivisions.length > 0) {
            setSelectedDivision(uniqueDivisions[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching CDL location attendance:", err);
        if (active) setError("Failed to load location attendance data.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  // Process data based on selected division
  const chartData = useMemo(() => {
    // Filter by selected division
    let filteredData = allData;
    if (selectedDivision) {
      filteredData = allData.filter(item => item.division === selectedDivision);
    }

    // Group by location
    const locationMap = new Map();

    filteredData.forEach((item) => {
      const location = item.loc;
      if (!locationMap.has(location)) {
        locationMap.set(location, {
          location: location,
          employees: [],
          total: 0,
          present: 0,
        });
      }

      const locData = locationMap.get(location);
      locData.employees.push(item);
      locData.total += 1;
      if (isPresent(item)) {
        locData.present += 1;
      }
    });

    const result = Array.from(locationMap.values())
      .map((item) => ({
        location: item.location,
        total: item.total,
        real: item.present,
        percentage:
          item.total > 0 ? Math.round((item.present / item.total) * 100) : 0,
      }))
      .sort((a, b) => a.location.localeCompare(b.location));

    return result;
  }, [allData, selectedDivision]);

  // Get total employees count for selected division
  const totalEmployees = useMemo(() => {
    const filtered = allData.filter(item => item.division === selectedDivision);
    return filtered.length;
  }, [allData, selectedDivision]);

  // Get total present count for selected division
  const totalPresent = useMemo(() => {
    const filtered = allData.filter(item => 
      item.division === selectedDivision && isPresent(item)
    );
    return filtered.length;
  }, [allData, selectedDivision]);

  const handleDivisionChange = (event) => {
    setSelectedDivision(event.target.value);
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#F4F6FA",
          borderRadius: "20px",
          padding: { xs: "16px", sm: "20px", md: "24px" },
          border: "1px solid #D0D8EC",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} sx={{ color: "#330066" }} />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#F4F6FA",
          borderRadius: "20px",
          padding: { xs: "16px", sm: "20px", md: "24px" },
          border: "1px solid #D0D8EC",
        }}
      >
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ fontSize: 14, color: "#dc2626" }}>
            {error}
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (divisions.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#F4F6FA",
          borderRadius: "20px",
          padding: { xs: "16px", sm: "20px", md: "24px" },
          border: "1px solid #D0D8EC",
        }}
      >
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ fontSize: 14, color: "#94a3b8" }}>
            No data available
          </Typography>
        </Box>
      </Paper>
    );
  }

  const maxTotal = Math.max(...chartData.map((r) => r.total), 0);

  // Calculate division-wise overall attendance percentage
  const overallPercentage = totalEmployees > 0 
    ? Math.round((totalPresent / totalEmployees) * 100) 
    : 0;

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#F4F6FA",
        borderRadius: "20px",
        padding: { xs: "16px", sm: "20px", md: "24px" },
        border: "1px solid #D0D8EC",
        boxShadow: "0 4px 24px rgba(37,99,235,0.07)",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: { xs: "17px", sm: "19px", md: "21px" },
            fontWeight: 700,
            color: "#330066",
            letterSpacing: "-0.01em",
            mb: 1,
          }}
        >
          CDL Location Attendance Overview
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "#64748B",
          }}
        >
          Attendance percentage by location
        </Typography>
      </Box>

      {/* Division Dropdown */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel 
            sx={{ fontSize: 13, color: "#64748b" }}
          >
            Select Division
          </InputLabel>
          <Select
            value={selectedDivision}
            onChange={handleDivisionChange}
            label="Select Division"
            sx={{
              borderRadius: "12px",
              background: "#fff",
              fontSize: 13,
              fontWeight: 500,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e2e8f0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#330066",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#330066",
              },
            }}
          >
            {divisions.map((division) => (
              <MenuItem key={division} value={division}>
                {division}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Chart */}
      {chartData.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography sx={{ fontSize: 14, color: "#94a3b8" }}>
            No locations found for {selectedDivision}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 1,
            p: 2,
            borderRadius: "14px",
            background: "#fff",
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              mb: 2,
            }}
          >
            Locations in {selectedDivision} ({chartData.length} locations)
          </Typography>

          {chartData.map((row) => {
            const barW =
              maxTotal > 0 ? Math.round((row.real / maxTotal) * 100) : 0;

            return (
              <Box
                key={row.location}
                sx={{
                  mb: "12px",
                  "&:last-child": { mb: 0 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: "4px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        fontSize: 14,
                        color: "#330066",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    >
                      {row.location}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#64748b",
                      }}
                    >
                      {row.real}/{row.total}
                    </Typography>

                    <PctBadge pct={row.percentage} />
                  </Box>
                </Box>

                <Box
                  sx={{
                    height: 6,
                    background: "#f1f5f9",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: "10px",
                      width: `${barW}%`,
                      background: rateColor(row.percentage),
                      transition: "width 0.5s ease",
                    }}
                  />
                </Box>
              </Box>
            );
          })}

          {/* Legend */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              pt: "12px",
              mt: "10px",
              borderTop: "0.5px solid #f1f5f9",
            }}
          >
            {[
              { label: "≥80%", color: "#16a34a" },
              { label: "60–79%", color: "#d97706" },
              { label: "<60%", color: "#dc2626" },
            ].map((l) => (
              <Box
                key={l.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "2px",
                    background: l.color,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#64748b",
                  }}
                >
                  {l.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}