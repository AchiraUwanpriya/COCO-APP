import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Popover,
  IconButton,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import CloseIcon from "@mui/icons-material/Close";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { GetCDLCategoryAtt } from "../../action/Attendance";

// Green Theme Color Palette
const GREEN_THEME = {
  strength:       "#e07b39",   
  attendance:     "#4472c4",   
  accent:         "#82C491",   // Light Green Accent
  cardBg:         "#f8faf9",   // Soft Light Green/White Tint
  cardBorder:     "#C2E2C9",   // Mint Green Border
  cardShadow:     "0 4px 24px rgba(26,93,40,0.07)",
  titleColor:     "#13461E",   // Deep Green Title
  subtitleColor:  "#475569",   // Slate Subtitle Text
  axisColor:      "#64748b",   // Muted Axis Label
  gridColor:      "#E2F0E5",  // Light Green Grid Line
};

const CATEGORY_ORDER = [
  "INDUSTRIAL",
  "CONTRACT",
  "DAILY WAGES",
  "TRAINEE",
  "CLERICAL",
  "SUPERVISORY",
  "EXECUTIVE",
];

const CDPLCCustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: `1px solid ${GREEN_THEME.cardBorder}`,
          padding: "12px 16px",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(19, 70, 30, 0.12)",
          minWidth: 180,
        }}
      >
        <Typography
          sx={{
            color: GREEN_THEME.titleColor,
            fontWeight: 700,
            marginBottom: "8px",
            fontSize: "13px",
            borderBottom: `1px solid ${GREEN_THEME.cardBorder}`,
            pb: 0.8,
          }}
        >
          {data.name}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box sx={{ width: 9, height: 9, borderRadius: "3px", backgroundColor: GREEN_THEME.strength }} />
              <Typography sx={{ color: "#334155", fontSize: "12px" }}>Actual Strength:</Typography>
            </Box>
            <Typography sx={{ color: GREEN_THEME.strength, fontWeight: 700, fontSize: "12px" }}>
              {Number(data.strength || 0).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box sx={{ width: 9, height: 9, borderRadius: "3px", backgroundColor: GREEN_THEME.attendance }} />
              <Typography sx={{ color: "#334155", fontSize: "12px" }}>Attendance:</Typography>
            </Box>
            <Typography sx={{ color: GREEN_THEME.attendance, fontWeight: 700, fontSize: "12px" }}>
              {Number(data.attendance || 0).toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              pt: "6px",
              mt: "2px",
              borderTop: `1px solid ${GREEN_THEME.cardBorder}`,
            }}
          >
            <Typography sx={{ color: "#475569", fontSize: "12px" }}>Rate:</Typography>
            <Typography
              sx={{
                color: GREEN_THEME.titleColor,
                fontWeight: 700,
                fontSize: "12px",
                backgroundColor: "rgba(26,93,40,0.1)",
                px: "6px",
                py: "1px",
                borderRadius: "4px",
              }}
            >
              {data.pct}%
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
  return null;
};

export function CDPLCBreakdown({
  cdplcData: propCdplcData,
  hadDate,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const [isFetching, setIsFetching] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const initialDate = (() => {
    if (!hadDate) return todayStr;
    if (typeof hadDate === "string") return hadDate.split("T")[0];
    if (hadDate instanceof Date) return hadDate.toISOString().split("T")[0];
    return todayStr;
  })();

  // This card owns its own date filter now — it no longer depends on a
  // dashboard-wide date picker, since the date only ever affected this chart.
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Date-picker popover (pill button + panel, rather than a raw native
  // date input sitting in the card header)
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [tempDate, setTempDate] = useState(initialDate);
  const dateMenuOpen = Boolean(dateAnchorEl);

  const openDateMenu = (e) => {
    setTempDate(selectedDate);
    setDateAnchorEl(e.currentTarget);
  };
  const closeDateMenu = () => setDateAnchorEl(null);
  const applyDate = () => {
    setSelectedDate(tempDate || todayStr);
    closeDateMenu();
  };
  const quickPick = (dateStr) => {
    setTempDate(dateStr);
    setSelectedDate(dateStr);
    closeDateMenu();
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Select date";
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const {
    cdplcData: reduxCdplcData,
  } = useSelector((state) => state.attendanceCard || {});

  const apiData =
    reduxCdplcData && reduxCdplcData.length > 0
      ? reduxCdplcData
      : propCdplcData;

  useEffect(() => {
    let isMounted = true;

    setIsFetching(true);
    const actionResult = dispatch(GetCDLCategoryAtt(selectedDate));

    if (actionResult && typeof actionResult.then === "function") {
      actionResult.finally(() => {
        if (isMounted) setIsFetching(false);
      });
    } else {
      // Fallback if dispatch is synchronous
      setTimeout(() => {
        if (isMounted) setIsFetching(false);
      }, 300);
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, selectedDate]);

  const normalizeApiData = (raw) => {
    if (!raw) return [];
    let data = raw;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch (e) { return []; }
    }
    if (Array.isArray(data)) return data;
    if (typeof data === "object" && data !== null) {
      const list =
        data.ResultSet ||
        data.resultSet ||
        data.Data ||
        data.data ||
        data.Result ||
        data.result ||
        data.CategoryList ||
        data.categoryList ||
        data.list ||
        data.items;
      if (Array.isArray(list)) return list;
      if (typeof list === "object" && list !== null) {
        return Object.values(list).filter((x) => x && typeof x === "object");
      }
      return Object.values(data).filter((item) => item && typeof item === "object");
    }
    return [];
  };

  const getCategoryName = (item) => {
    if (typeof item === "string") return item;
    if (!item || typeof item !== "object") return "";
    return (
      item.EMPLOYMENT_CATEGORY ||
      item.employment_category ||
      item.Employment_Category ||
      item.EmploymentCategory ||
      item.Type ||
      item.TYPE ||
      item.type ||
      item.Category ||
      item.CATEGORY ||
      item.category ||
      item.CategoryName ||
      item.CATEGORY_NAME ||
      item.categoryName ||
      item.Category_Name ||
      item.CategoryDesc ||
      item.CATEGORY_DESC ||
      item.categoryDesc ||
      item.EmployeeType ||
      item.EMPLOYEE_TYPE ||
      item.employeeType ||
      item.Title ||
      item.TITLE ||
      item.Name ||
      item.NAME ||
      item.name ||
      ""
    ).toString().trim();
  };

  const getAttendanceCount = (item) => {
    if (!item || typeof item !== "object") return 0;
    const val =
      item.ATTENDANCE ??
      item.Attendance ??
      item.attendance ??
      item.Present ??
      item.PRESENT ??
      item.present ??
      item.Att ??
      item.ATT ??
      item.att ??
      item.Attend ??
      item.ATTEND ??
      item.AttendanceCount ??
      item.ATTENDANCE_COUNT ??
      item.PresentCount ??
      item.PRESENT_COUNT ??
      0;
    return parseInt(val, 10) || 0;
  };

  const getStrengthCount = (item) => {
    if (!item || typeof item !== "object") return 0;
    const val =
      item.ACTUAL_STRENGTH ??
      item.ActualStrength ??
      item.actualStrength ??
      item.ELIGIBLE_STRENGTH ??
      item.EligibleStrength ??
      item.eligibleStrength ??
      item.STRENGTH ??
      item.Strength ??
      item.strength ??
      item.Eligible ??
      item.ELIGIBLE ??
      item.eligible ??
      item.Count ??
      item.COUNT ??
      item.count ??
      item.Total ??
      item.TOTAL ??
      item.total ??
      0;
    return parseInt(val, 10) || 0;
  };

  const getPercentageValue = (item, attendance, strength) => {
    if (!item || typeof item !== "object") return strength > 0 ? Math.round((attendance / strength) * 100) : 0;
    const val =
      item.ATTENDANCE_PERCENTAGE ??
      item.AttendancePercentage ??
      item.attendancePercentage ??
      item.ACTUAL_PERCENTAGE ??
      item.ActualPercentage ??
      item.actualPercentage ??
      item.ELIGIBLE_PERCENTAGE ??
      item.EligiblePercentage ??
      item.eligiblePercentage ??
      item.PERCENTAGE ??
      item.Percentage ??
      item.percentage ??
      item.RATE ??
      item.Rate ??
      item.rate ??
      item.PCT ??
      item.Pct ??
      item.pct;

    if (val != null && val !== "") {
      const num = parseFloat(val);
      if (!isNaN(num)) return Math.round(num);
    }
    return strength > 0 ? Math.round((attendance / strength) * 100) : 0;
  };

  const rawList = normalizeApiData(apiData);
  const transformedCdplc = rawList
    .filter((item) => {
      const catName = getCategoryName(item);
      return !catName || catName.toUpperCase() !== "TOTAL";
    })
    .map((item, idx) => {
      const rawType = getCategoryName(item) || `Category ${idx + 1}`;
      const typeUpper = rawType.toUpperCase();
      
      // Preserve category name casing if formatted e.g. "Daily Wages", "Contract", "Executive"
      const formattedName =
        rawType === rawType.toUpperCase() && rawType.length > 3
          ? rawType.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
          : rawType;

      const attendance = getAttendanceCount(item);
      const strength = getStrengthCount(item);

      let absent = Math.max(0, strength - attendance);
      if (item && item.ABSENT != null && item.ABSENT !== "") {
        const parsedAbsent = parseInt(item.ABSENT, 10);
        if (!isNaN(parsedAbsent)) absent = Math.max(0, parsedAbsent);
      }

      const pct = getPercentageValue(item, attendance, strength);

      return { name: formattedName, typeUpper, attendance, absent, strength, pct };
    })
    .sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a.typeUpper);
      const idxB = CATEGORY_ORDER.indexOf(b.typeUpper);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

  const formatNumber = (value) => {
    if (!value || value === 0) return "";
    return Number(value).toLocaleString();
  };

  // Shared X-axis domain for both the background (strength) and overlay
  // (attendance) charts — they must match exactly or the overlay bar won't
  // line up with the background bar underneath it.
  const maxStrengthValue = Math.max(
    1,
    ...transformedCdplc.map((d) => d.strength || 0)
  );
  const xDomain = [0, Math.ceil(maxStrengthValue * 1.15)];

  if (isFetching) {
    return (
      <Box
        sx={{
          backgroundColor: GREEN_THEME.cardBg,
          borderRadius: "20px",
          padding: "24px",
          border: `1px solid ${GREEN_THEME.cardBorder}`,
          boxShadow: GREEN_THEME.cardShadow,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "350px",
          gap: 2,
        }}
      >
        <CircularProgress size={38} sx={{ color: GREEN_THEME.strength }} />
        <Typography sx={{ color: GREEN_THEME.titleColor, fontWeight: 600, fontSize: "13px" }}>
          Loading overview data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        animation: "fadeInUp 0.5s ease-out 0.2s forwards",
        opacity: 0,
        "@keyframes fadeInUp": {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          backgroundColor: GREEN_THEME.cardBg,
          borderRadius: "20px",
          padding: { xs: "14px", sm: "20px", md: "24px" },
          boxShadow: GREEN_THEME.cardShadow,
          border: `1px solid ${GREEN_THEME.cardBorder}`,
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
                color: GREEN_THEME.titleColor,
                letterSpacing: "-0.01em",
                marginBottom: "2px",
              }}
            >
              Employee Strength &amp; Attendance Overview
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "10.5px", sm: "12px" },
                color: GREEN_THEME.subtitleColor,
              }}
            >
              Actual strength (orange) with attendance (blue) overlaid inside it
            </Typography>
          </Box>

          {/* This chart is the only thing that's date-specific, so the date
              picker lives here instead of in the dashboard's global header. */}
          <Button
            onClick={openDateMenu}
            startIcon={<CalendarTodayRoundedIcon sx={{ fontSize: 15 }} />}
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              justifyContent: "flex-start",
              textTransform: "none",
              fontSize: "12.5px",
              fontWeight: 700,
              color: GREEN_THEME.titleColor,
              backgroundColor: "#ffffff",
              border: `1px solid ${GREEN_THEME.cardBorder}`,
              borderRadius: "10px",
              px: 1.5,
              height: 36,
              minWidth: { xs: "100%", sm: 165 },
              "&:hover": {
                backgroundColor: "#fdf3ec",
                borderColor: GREEN_THEME.strength,
              },
            }}
          >
            {formatDateDisplay(selectedDate)}
          </Button>

          <Popover
            open={dateMenuOpen}
            anchorEl={dateAnchorEl}
            onClose={closeDateMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "right" }}
            transformOrigin={{ vertical: "top", horizontal: isMobile ? "center" : "right" }}
            PaperProps={{
              sx: {
                p: 2.25,
                mt: 0.75,
                borderRadius: "16px",
                minWidth: 270,
                boxShadow: "0 8px 32px rgba(19,70,30,0.16)",
                border: `1px solid ${GREEN_THEME.cardBorder}`,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "13.5px", color: GREEN_THEME.titleColor }}>
                Filter by date
              </Typography>
              <IconButton size="small" onClick={closeDateMenu}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 1.5, borderColor: GREEN_THEME.cardBorder }} />

            <TextField
              type="date"
              size="small"
              fullWidth
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                mb: 1.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "13px",
                  "& fieldset": { borderColor: GREEN_THEME.cardBorder },
                  "&:hover fieldset": { borderColor: GREEN_THEME.strength },
                  "&.Mui-focused fieldset": { borderColor: GREEN_THEME.titleColor },
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 0.75, mb: 1.75 }}>
              {[
                { label: "Today", value: todayStr },
                {
                  label: "Yesterday",
                  value: new Date(Date.now() - 86400000).toISOString().split("T")[0],
                },
              ].map((opt) => (
                <Chip
                  key={opt.label}
                  label={opt.label}
                  size="small"
                  onClick={() => quickPick(opt.value)}
                  sx={{
                    fontSize: "11.5px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    backgroundColor: selectedDate === opt.value ? "#fdf3ec" : "#f7f9f7",
                    color: selectedDate === opt.value ? GREEN_THEME.strength : GREEN_THEME.subtitleColor,
                    border: `1px solid ${selectedDate === opt.value ? GREEN_THEME.strength : GREEN_THEME.cardBorder}`,
                  }}
                />
              ))}
            </Box>

            <Button
              fullWidth
              onClick={applyDate}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                color: "#ffffff",
                backgroundColor: GREEN_THEME.titleColor,
                borderRadius: "10px",
                height: 38,
                "&:hover": { backgroundColor: "#0e3618" },
              }}
            >
              Apply
            </Button>
          </Popover>
        </Box>

        {/* Chart — orange bar is the full Actual Strength; the blue bar is
            overlaid on top of it (same scale) so its length shows what
            portion of that strength actually attended. */}
        <Box
          sx={{
            position: "relative",
            height: { xs: "230px", sm: "300px" },
            width: "100%",
            marginBottom: "14px",
          }}
        >
          {/* Background layer — Actual Strength (full length, orange) */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformedCdplc}
              layout="vertical"
              margin={{
                top: 5,
                right: isMobile ? 30 : 60,
                left: isMobile ? 0 : 8,
                bottom: 10,
              }}
              barCategoryGap={isMobile ? "18%" : "25%"}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GREEN_THEME.gridColor}
                horizontal={false}
                vertical={true}
              />
              <XAxis
                type="number"
                domain={xDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fill: GREEN_THEME.axisColor, fontSize: 11 }}
                tickFormatter={(value) => Number(value).toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={isMobile ? 72 : 100}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: GREEN_THEME.titleColor,
                  fontSize: isMobile ? 11 : 13,
                  fontWeight: 600,
                }}
              />
              <Tooltip content={<CDPLCCustomTooltip />} cursor={{ fill: "rgba(224,123,57,0.06)" }} />

              <Bar
                dataKey="strength"
                name="Actual Strength"
                fill={GREEN_THEME.strength}
                radius={[6, 6, 6, 6]}
                barSize={isMobile ? 18 : 24}
              >
                <LabelList
                  dataKey="strength"
                  position="insideRight"
                  style={{ fill: "#ffffff" }}
                  fontSize={11}
                  fontWeight={700}
                  formatter={(v) => formatNumber(v)}
                />
                {/* Percentage label at the row's right edge (end of the full strength bar) */}
                <LabelList
                  dataKey="pct"
                  position="right"
                  content={(props) => {
                    const { x, y, width, height, index } = props;
                    const item = transformedCdplc[index];
                    if (!item) return null;
                    return (
                      <text
                        x={x + width + 8}
                        y={y + height / 2 + 4}
                        fill={GREEN_THEME.titleColor}
                        fontSize={isMobile ? 11 : 12}
                        fontWeight={700}
                      >
                        {`${item.pct}%`}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Overlay layer — Attendance (blue), nested inside the strength bar */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transformedCdplc}
                layout="vertical"
                margin={{
                  top: 5,
                  right: isMobile ? 30 : 60,
                  left: isMobile ? 0 : 8,
                  bottom: 10,
                }}
                barCategoryGap={isMobile ? "18%" : "25%"}
              >
                <XAxis
                  type="number"
                  domain={xDomain}
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={isMobile ? 72 : 100}
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                />
                <Bar
                  dataKey="attendance"
                  name="Attendance"
                  fill={GREEN_THEME.attendance}
                  radius={[5, 5, 5, 5]}
                  barSize={isMobile ? 9 : 12}
                >
                  <LabelList
                    dataKey="attendance"
                    position="insideRight"
                    style={{ fill: "#ffffff" }}
                    fontSize={9.5}
                    fontWeight={700}
                    formatter={(v) => (v > 30 ? formatNumber(v) : "")}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
            paddingTop: "14px",
            borderTop: `1px solid ${GREEN_THEME.cardBorder}`,
          }}
        >
          {[
            { label: "Actual Strength", color: GREEN_THEME.strength },
            { label: "Attendance", color: GREEN_THEME.attendance },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  backgroundColor: item.color,
                }}
              />
              <Typography sx={{ fontSize: "12px", color: GREEN_THEME.subtitleColor, fontWeight: 600 }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default CDPLCBreakdown;