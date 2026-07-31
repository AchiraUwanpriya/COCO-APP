import React, { useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  strength:       "#13461E",   // Dark Forest Green (Actual Strength)
  attendance:     "#4C8C58",   // Medium Sage Green (Attendance)
  accent:         "#82C491",   // Light Green Accent
  cardBg:         "#f8faf9",   // Soft Light Green/White Tint
  cardBorder:     "#C2E2C9",   // Mint Green Border
  cardShadow:     "0 4px 24px rgba(26,93,40,0.07)",
  titleColor:     "#13461E",   // Deep Green Title
  subtitleColor:  "#475569",   // Slate Subtitle Text
  axisColor:      "#64748b",   // Muted Axis Label
  gridColor:      "#E2F0E5",   // Light Green Grid Line
};

const CATEGORY_ORDER = [
  "INDUSTRIAL",
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

  const {
    cdplcData: reduxCdplcData,
    loading,
    msg,
  } = useSelector((state) => state.attendanceCard || {});

  const apiData =
    reduxCdplcData && reduxCdplcData.length > 0
      ? reduxCdplcData
      : propCdplcData;

  useEffect(() => {
    const dateToFetch = hadDate || new Date().toISOString().split("T")[0];
    dispatch(GetCDLCategoryAtt(dateToFetch));
  }, [dispatch, hadDate]);

  const transformedCdplc = apiData
    ? apiData
        .filter((item) => item.Type && item.Type.toUpperCase() !== "TOTAL")
        .map((item) => {
          const rawType = (item.Type || "").trim();
          const typeUpper = rawType.toUpperCase();
          const formattedName =
            rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();

          const attendance = parseInt(item.Attendance || 0) || 0;
          const strength =
            parseInt(
              item.EligibleStrength || item.Strength || item.ActualStrength || 0
            ) || 0;
          const absent = Math.max(0, strength - attendance);

          let pct = 0;
          if (item.ActualPercentage != null && item.ActualPercentage !== "") {
            pct = Math.round(parseFloat(item.ActualPercentage));
          } else if (
            item.EligiblePercentage != null &&
            item.EligiblePercentage !== ""
          ) {
            pct = Math.round(parseFloat(item.EligiblePercentage));
          } else if (strength > 0) {
            pct = Math.round((attendance / strength) * 100);
          }

          return { name: formattedName, typeUpper, attendance, absent, strength, pct };
        })
        .sort((a, b) => {
          const idxA = CATEGORY_ORDER.indexOf(a.typeUpper);
          const idxB = CATEGORY_ORDER.indexOf(b.typeUpper);
          return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
        })
    : [];

  const formatNumber = (value) => {
    if (!value || value === 0) return "";
    return Number(value).toLocaleString();
  };

  if (loading && (!apiData || apiData.length === 0)) {
    return (
      <Box
        sx={{
          backgroundColor: GREEN_THEME.cardBg,
          borderRadius: "20px",
          padding: "24px",
          border: `1px solid ${GREEN_THEME.cardBorder}`,
          boxShadow: GREEN_THEME.cardShadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "350px",
        }}
      >
        <Typography sx={{ color: GREEN_THEME.subtitleColor }}>
          Loading chart data...
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
          padding: { xs: "16px", sm: "20px", md: "24px" },
          boxShadow: GREEN_THEME.cardShadow,
          border: `1px solid ${GREEN_THEME.cardBorder}`,
        }}
      >
        {/* Header */}
        <Box sx={{ marginBottom: { xs: "14px", sm: "20px" } }}>
          <Typography
            sx={{
              fontSize: { xs: "17px", sm: "19px", md: "21px" },
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
              fontSize: { xs: "11px", sm: "12px" },
              color: GREEN_THEME.subtitleColor,
            }}
          >
            Stacked view — actual strength vs attendance per employee type
          </Typography>
        </Box>

        {/* Chart */}
        <Box
          sx={{
            height: { xs: "260px", sm: "300px" },
            width: "100%",
            marginBottom: "14px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformedCdplc}
              layout="vertical"
              margin={{
                top: 5,
                right: isMobile ? 40 : 60,
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
                axisLine={false}
                tickLine={false}
                tick={{ fill: GREEN_THEME.axisColor, fontSize: 11 }}
                tickFormatter={(value) => Number(value).toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={isMobile ? 80 : 100}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: GREEN_THEME.titleColor,
                  fontSize: isMobile ? 11 : 13,
                  fontWeight: 600,
                }}
              />
              <Tooltip content={<CDPLCCustomTooltip />} />

              {/* STACKED 1: Dark Forest Green — Actual Strength */}
              <Bar
                dataKey="absent"
                name="Actual Strength"
                fill={GREEN_THEME.strength}
                stackId="stack"
                radius={[4, 0, 0, 4]}
                barSize={isMobile ? 16 : 22}
              >
                <LabelList
                  dataKey="absent"
                  position="center"
                  style={{ fill: "#ffffff" }}
                  fontSize={11}
                  fontWeight={700}
                  formatter={(v) => (v > 30 ? formatNumber(v) : "")}
                />
              </Bar>

              {/* STACKED 2: Medium Sage Green — Attendance */}
              <Bar
                dataKey="attendance"
                name="Attendance"
                fill={GREEN_THEME.attendance}
                stackId="stack"
                radius={[0, 6, 6, 0]}
                barSize={isMobile ? 16 : 22}
              >
                <LabelList
                  dataKey="attendance"
                  position="center"
                  style={{ fill: "#ffffff" }}
                  fontSize={11}
                  fontWeight={700}
                  formatter={(v) => (v > 30 ? formatNumber(v) : "")}
                />
                {/* Percentage label right of bar */}
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