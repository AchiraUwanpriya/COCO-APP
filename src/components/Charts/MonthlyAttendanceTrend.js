import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, MenuItem, Select, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import AttendanceService from "../../service/AttendanceService";

// ---------------------------------------------------------------------------
// This chart is built entirely from the existing day/month attendance
// endpoint (/Attendence/GetFilterdAttendenceDetails) — there is no dedicated
// "monthly summary" API yet, so:
//   - Monthly view  → ONE call for the whole month (sno empty, year+month)
//   - Yearly view   → 12 calls, one per month of the selected year
// and the attendance count per day/month is derived client-side by counting
// distinct employees (the "Name" field — which, per the backend's
// swapped fields, actually holds the real service number) that have a
// non-empty InTime on that date.
// ---------------------------------------------------------------------------

const THEME = {
  bar: "#4472c4",
  line: "#1A5D28",
  cardBg: "#f8faf9",
  cardBorder: "#C2E2C9",
  cardShadow: "0 4px 24px rgba(26,93,40,0.07)",
  titleColor: "#13461E",
  subtitleColor: "#475569",
  axisColor: "#64748b",
  gridColor: "#E2F0E5",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const extractList = (resData) => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  const list =
    resData.resultSet ||
    resData.ResultSet ||
    resData.Data ||
    resData.data ||
    resData.Result ||
    resData.result ||
    [];
  return Array.isArray(list) ? list : [];
};

// Real employee id lives in the "Name" field (backend swap) — fall back to
// ServiceNo/DeviceID combinations if it's ever missing.
const recordEmployeeId = (r) =>
  r.Name || r.name || r.ServiceNo || r.serviceNo || `${r.DeviceID || ""}-${r.InTime || ""}`;

const recordDate = (r) => r.AttDate || r.attDate || r.Date || r.date || "";
const recordHasIn = (r) => Boolean((r.InTime || r.inTime || "").trim());

// Count distinct employees with an InTime, per AttDate, from a flat list of
// punch records covering one month.
const countByDay = (records) => {
  const byDay = {}; // "YYYY-MM-DD" -> Set(employeeId)
  records.forEach((r) => {
    const date = recordDate(r);
    if (!date || !recordHasIn(r)) return;
    const key = date.split("T")[0];
    if (!byDay[key]) byDay[key] = new Set();
    byDay[key].add(recordEmployeeId(r));
  });
  return byDay;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const count = payload[0]?.value ?? 0;
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: `1px solid ${THEME.cardBorder}`,
          borderRadius: "10px",
          padding: "10px 14px",
          boxShadow: "0 4px 16px rgba(19,70,30,0.12)",
        }}
      >
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: THEME.titleColor, mb: 0.3 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "12px", color: THEME.bar, fontWeight: 700 }}>
          {count} {count === 1 ? "employee" : "employees"} attended
        </Typography>
      </Box>
    );
  }
  return null;
};

export function MonthlyAttendanceTrend() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const today = dayjs();
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" | "yearly"
  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedMonth, setSelectedMonth] = useState(today.month() + 1); // 1-12
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]); // [{ day, label, count }]
  const [yearlyData, setYearlyData] = useState([]); // [{ month, label, avg }]

  const yearOptions = useMemo(() => {
    const start = today.year() - 4;
    return Array.from({ length: 5 }, (_, i) => start + i);
  }, [today]);

  // ---- Monthly fetch: one call for the whole month ----
  useEffect(() => {
    if (viewMode !== "monthly") return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const mm = String(selectedMonth).padStart(2, "0");
    AttendanceService.GetAttendenceDetails({ year: String(selectedYear), month: mm, sno: "" })
      .then((res) => {
        if (cancelled) return;
        const records = extractList(res?.data);
        const byDay = countByDay(records);
        const daysInMonth = dayjs(`${selectedYear}-${mm}-01`).daysInMonth();
        const isCurrentMonth = today.year() === selectedYear && today.month() + 1 === selectedMonth;
        const lastDay = isCurrentMonth ? today.date() : daysInMonth;

        const rows = [];
        for (let d = 1; d <= daysInMonth; d++) {
          const key = `${selectedYear}-${mm}-${String(d).padStart(2, "0")}`;
          rows.push({
            day: d,
            label: `${d} ${MONTH_SHORT[selectedMonth - 1]}`,
            count: d <= lastDay ? (byDay[key] ? byDay[key].size : 0) : null,
          });
        }
        setMonthlyData(rows);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load monthly attendance data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedYear, selectedMonth]);

  // ---- Yearly fetch: 12 calls, one per month ----
  useEffect(() => {
    if (viewMode !== "yearly") return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const isCurrentYear = today.year() === selectedYear;
    const monthsToFetch = isCurrentYear ? today.month() + 1 : 12;

    const requests = Array.from({ length: monthsToFetch }, (_, i) => {
      const mm = String(i + 1).padStart(2, "0");
      return AttendanceService.GetAttendenceDetails({ year: String(selectedYear), month: mm, sno: "" })
        .then((res) => ({ month: i + 1, records: extractList(res?.data) }))
        .catch(() => ({ month: i + 1, records: [] }));
    });

    Promise.all(requests)
      .then((results) => {
        if (cancelled) return;
        const rows = MONTH_SHORT.map((label, idx) => {
          const monthNum = idx + 1;
          const matched = results.find((r) => r.month === monthNum);
          if (!matched) return { month: monthNum, label, avg: null };

          const mm = String(monthNum).padStart(2, "0");
          const byDay = countByDay(matched.records);
          const daysInMonth = dayjs(`${selectedYear}-${mm}-01`).daysInMonth();
          const isCurrentMonth = today.year() === selectedYear && today.month() + 1 === monthNum;
          const elapsedDays = isCurrentMonth ? today.date() : daysInMonth;

          const total = Object.values(byDay).reduce((sum, s) => sum + s.size, 0);
          const avg = elapsedDays > 0 ? Math.round(total / elapsedDays) : 0;
          return { month: monthNum, label, avg };
        });
        setYearlyData(rows);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load yearly attendance data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedYear]);

  const chartData = viewMode === "monthly"
    ? monthlyData.map((d) => ({ label: d.label, value: d.count }))
    : yearlyData.map((d) => ({ label: d.label, value: d.avg }));

  return (
    <Box
      sx={{
        backgroundColor: THEME.cardBg,
        borderRadius: "20px",
        padding: { xs: "14px", sm: "20px", md: "24px" },
        boxShadow: THEME.cardShadow,
        border: `1px solid ${THEME.cardBorder}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "flex-start" },
          justifyContent: "space-between",
          gap: 1.25,
          marginBottom: { xs: "14px", sm: "20px" },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "15.5px", sm: "19px", md: "21px" },
              fontWeight: 700,
              color: THEME.titleColor,
              letterSpacing: "-0.01em",
              marginBottom: "2px",
            }}
          >
            Attendance Trend
          </Typography>
          <Typography sx={{ fontSize: { xs: "10.5px", sm: "12px" }, color: THEME.subtitleColor }}>
            {viewMode === "monthly"
              ? `Employees present each day — ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`
              : `Average daily attendance per month — ${selectedYear}`}
          </Typography>
        </Box>

        {/* Controls — stack full-width on mobile, inline on larger screens */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 0.75,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#eef1ee",
              borderRadius: "9px",
              p: "3px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {["monthly", "yearly"].map((mode) => (
              <Box
                key={mode}
                onClick={() => setViewMode(mode)}
                sx={{
                  flex: { xs: 1, sm: "initial" },
                  textAlign: "center",
                  cursor: "pointer",
                  px: 1.5,
                  py: 0.6,
                  borderRadius: "7px",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  color: viewMode === mode ? "#ffffff" : THEME.subtitleColor,
                  backgroundColor: viewMode === mode ? THEME.line : "transparent",
                  transition: "all 0.15s ease",
                }}
              >
                {mode}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 0.75, width: { xs: "100%", sm: "auto" } }}>
            {viewMode === "monthly" && (
              <Select
                size="small"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                sx={{
                  flex: { xs: 1, sm: "initial" },
                  fontSize: "12px",
                  height: 32,
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                }}
              >
                {MONTH_NAMES.map((m, idx) => (
                  <MenuItem key={m} value={idx + 1} sx={{ fontSize: "12px" }}>
                    {isMobile ? MONTH_SHORT[idx] : m}
                  </MenuItem>
                ))}
              </Select>
            )}

            <Select
              size="small"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              sx={{
                flex: { xs: 1, sm: "initial" },
                fontSize: "12px",
                height: 32,
                backgroundColor: "#fff",
                borderRadius: "8px",
              }}
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y} sx={{ fontSize: "12px" }}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ height: { xs: "220px", sm: "280px" }, width: "100%", position: "relative" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(248,250,249,0.7)",
              zIndex: 2,
              borderRadius: "12px",
            }}
          >
            <CircularProgress size={28} sx={{ color: THEME.bar }} />
          </Box>
        )}

        {!loading && error && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography sx={{ fontSize: "12.5px", color: "#c1121f", textAlign: "center", px: 2 }}>{error}</Typography>
          </Box>
        )}

        {!loading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: isMobile ? 6 : 12, left: isMobile ? -22 : -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={THEME.gridColor} vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                interval={
                  viewMode === "monthly"
                    ? Math.ceil(chartData.length / (isMobile ? 5 : 10)) - 1
                    : isMobile
                    ? 1
                    : 0
                }
                tick={{ fill: THEME.axisColor, fontSize: isMobile ? 9.5 : 10.5 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: THEME.axisColor, fontSize: isMobile ? 9.5 : 10.5 }}
                allowDecimals={false}
                width={isMobile ? 26 : 34}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(68,114,196,0.06)" }} />
              <Bar
                dataKey="value"
                name="Attendance"
                fill={THEME.bar}
                radius={[4, 4, 0, 0]}
                barSize={viewMode === "yearly" ? (isMobile ? 16 : 26) : isMobile ? 5 : 8}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={THEME.line}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}

export default MonthlyAttendanceTrend;