import React from "react";
import { Box, Typography } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const BRAND = "#1A5D28";
const TEXT = "#101828";
const SUBTEXT = "#667085";
const SURFACE = "#ffffff";
const BORDER = "#e4e7ec";

const Notifications = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "70vh",
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          backgroundColor: "#eef3ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
        }}
      >
        <ConstructionIcon sx={{ fontSize: 34, color: BRAND }} />
      </Box>

      <Typography fontSize={17} fontWeight={700} color={TEXT} sx={{ mb: 0.75 }}>
        Messages — Under Development
      </Typography>
      <Typography fontSize={13} fontWeight={500} color={SUBTEXT} sx={{ maxWidth: 300 }}>
        This section is being rebuilt and isn't available yet. Please check back soon.
      </Typography>

      <Box
        sx={{
          mt: 3,
          px: 2,
          py: 1,
          borderRadius: "999px",
          backgroundColor: SURFACE,
          border: `1px solid ${BORDER}`,
        }}
      >
        <Typography fontSize={11.5} fontWeight={600} color={BRAND}>
          Coming soon
        </Typography>
      </Box>
    </Box>
  );
};

export default Notifications;