// import { useState, useContext, useEffect } from "react";
// import { Box, Card, Container, Typography } from "@mui/material";
// import TextField from "@mui/material/TextField";
// import { useSelector } from "react-redux";
// import imge from "../../../assets/images/NewBGImage.jpg";
// import Textlogo from "../../../assets/images/Textlogo.png";
// import LoadingButton from "@mui/lab/LoadingButton";
// import LoginIcon from "@mui/icons-material/Login";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../../../context/AuthContext";

// const SignIn = () => {
//   const [serviceNo, setserviceNo] = useState("");
//   const [password, setpassword] = useState("");
//   const { loading } = useSelector((state) => state.auth);
//   const { handleLogin } = useAuth();

//   useEffect(() => {
//     const metaThemeColor = document.querySelector('meta[name="theme-color"]');
//     metaThemeColor.setAttribute("content", "#004AAD");
//   }, []);

//   const getDeviceInfo = () => {
//     const userAgent = navigator.userAgent;
//     let device = "Unknown Device";
    
//     // Detect device type
//     if (/Android/i.test(userAgent)) {
//       device = "Android Mobile";
//     } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
//       device = "iOS Device";
//     } else if (/Windows/i.test(userAgent)) {
//       device = "Windows PC";
//     } else if (/Mac/i.test(userAgent)) {
//       device = "Mac Computer";
//     } else if (/Linux/i.test(userAgent)) {
//       device = "Linux Computer";
//     }
    
//     // Add browser info
//     if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
//       device += " (Chrome)";
//     } else if (/Firefox/i.test(userAgent)) {
//       device += " (Firefox)";
//     } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
//       device += " (Safari)";
//     } else if (/Edg/i.test(userAgent)) {
//       device += " (Edge)";
//     }
    
//     return device;
//   };

//   const getIPAddress = async () => {
//     try {
//       const response = await fetch('https://api.ipify.org?format=json');
//       const data = await response.json();
//       return data.ip || "Unknown IP";
//     } catch (error) {
//       console.error("Failed to get IP address:", error);
//       return "Unknown IP";
//     }
//   };

//   const validate = () => {
//     let isValid = true;
//     if (serviceNo.trim() === "" || password.trim() === "") {
//       isValid = false;
//       toast.error("Please Enter Valid UserID & Password.");
//     }
//     return isValid;
//   };

//   const handleButtonClick = async (e) => {
//     if (validate() && !loading) {
//       try {
//         // Get device and IP information
//         const device = getDeviceInfo();
//         const ip = await getIPAddress();
        
//         // Pass device and IP to handleLogin
//         handleLogin(serviceNo, password, device, ip);
//       } catch (error) {
//         toast.error("Failed to get device information");
//       }
//     }
//   };

//   const onServiceNoChanged = (e) => {
//     setserviceNo(e.target.value);
//   };

//   const onPasswordChanged = (e) => {
//     setpassword(e.target.value);
//   };

//   return (
//     <Container
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#F8F9FA",
//         backgroundImage: `url(${imge})`,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//       }}
//     >
//       <Box
//         component="img"
//         sx={{
//           height: "20%",
//           width: "50%",
//           maxHeight: { xs: 233, md: 167 },
//           maxWidth: { xs: 350, md: 250 },
//         }}
//         src={Textlogo}
//       />
//       <Typography
//         variant="h5"
//         fontWeight={300}
//         sx={{ my: 2, color: "#fff", marginBottom: "30%" }}
//       >
//         Corporate Mobile App
//       </Typography>

//       <Card sx={{ borderRadius: 5, boxShadow: 8 }}>
//         <Box p={3} textAlign="center">
//           <Typography variant="h4" fontWeight={600} sx={{ my: 2 }}>
//             Sign in
//           </Typography>
//         </Box>
//         <Box px={2} pb={3} textAlign="center">
//           <Typography
//             variant="h6"
//             color="#646464"
//             fontWeight={500}
//             sx={{ mb: 3 }}
//           >
//             Enter your registered User Id & Password
//           </Typography>
//           <Box>
//             <Box mb={1}>
//               <TextField
//                 id="outlined-basic"
//                 label="User ID"
//                 variant="outlined"
//                 InputProps={{ sx: { borderRadius: 3 } }}
//                 sx={{
//                   input: { textAlign: "center", fontSize: 20 },
//                   label: {
//                     right: "1.75rem",
//                     transformOrigin: "center",
//                     fontSize: "1rem",
//                   },
//                   legend: { textAlign: "center", fontSize: "0.7rem" },
//                 }}
//                 fullWidth
//                 type="text"
//                 onChange={onServiceNoChanged}
//               />
//             </Box>
//             <Box mb={1}>
//               <TextField
//                 id="outlined-basic"
//                 label="Password"
//                 variant="outlined"
//                 InputProps={{ sx: { borderRadius: 3 } }}
//                 sx={{
//                   input: { textAlign: "center", fontSize: 20 },
//                   label: {
//                     right: "1.75rem",
//                     transformOrigin: "center",
//                     fontSize: "1rem",
//                   },
//                   legend: { textAlign: "center", fontSize: "0.7rem" },
//                 }}
//                 fullWidth
//                 type="password"
//                 onChange={onPasswordChanged}
//               />
//             </Box>
//             <Box mt={4} mb={1}>
//               <LoadingButton
//                 onClick={handleButtonClick}
//                 endIcon={<LoginIcon />}
//                 loading={loading}
//                 loadingPosition="center"
//                 variant="contained"
//                 sx={{
//                   width: "90%",
//                   maxWidth: { xs: 350, md: 250 },
//                   backgroundColor: "#0049AF",
//                   textTransform: "capitalize",
//                   borderRadius: 3,
//                 }}
//               >
//                 <span style={{ color: "#fff", fontSize: 18, fontWeight: 400 }}>
//                   Sign In
//                 </span>
//               </LoadingButton>
//             </Box>
//           </Box>
//         </Box>
//       </Card>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "flex-end",
//           alignItems: "center",
//           marginTop: 10,
//         }}
//       >
//         <Typography
//           variant="h8"
//           color="#646464"
//           fontWeight={500}
//           textAlign={"center"}
//           paddingLeft={3}
//           paddingRight={3}
//         >
//           Copyrights © Colombo Dockyard PLC.
//         </Typography>
//         <Typography variant="h7" color="#646464" fontWeight={500}>
//           All Rights Reserved.
//         </Typography>
//         <Typography fontSize={8} color="#646464" fontWeight={500}>
//           Powered By Dockyard Total Solution (Pvt) Ltd.
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

import { useState, useContext, useEffect } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  IconButton,
  Button,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import bgArc from "../../../assets/images/bg-arc.png";
import nutrinutsLogo from "../../../assets/images/nutrinuts-logo.png";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { checkBiometricAvailability, biometricLogin } from "../../../action/Biometric";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("serviceNo");
  const [phoneNo, setPhoneNo] = useState("");
  const [serviceNo, setserviceNo] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasPromptedBiometric, setHasPromptedBiometric] = useState(false);
  
  const { loading, biometricAvailable, biometricLoading } = useSelector((state) => state.auth);
  const { handleLogin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#1A5D28");
    }
  }, []);

  useEffect(() => {
    dispatch(checkBiometricAvailability());
  }, [dispatch]);

  const handleBiometricLogin = () => {
    sessionStorage.removeItem("explicit_logout");
    dispatch(biometricLogin(navigate));
  };

  useEffect(() => {
    const isExplicitLogout = sessionStorage.getItem("explicit_logout") === "true";
    if (biometricAvailable && !hasPromptedBiometric && !isExplicitLogout) {
      setHasPromptedBiometric(true);
      handleBiometricLogin();
    }
  }, [biometricAvailable, hasPromptedBiometric]);

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let device = "Unknown Device";
    
    if (/Android/i.test(userAgent)) {
      device = "Android Mobile";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      device = "iOS Device";
    } else if (/Windows/i.test(userAgent)) {
      device = "Windows PC";
    } else if (/Mac/i.test(userAgent)) {
      device = "Mac Computer";
    } else if (/Linux/i.test(userAgent)) {
      device = "Linux Computer";
    }
    
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
      device += " (Chrome)";
    } else if (/Firefox/i.test(userAgent)) {
      device += " (Firefox)";
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      device += " (Safari)";
    } else if (/Edg/i.test(userAgent)) {
      device += " (Edge)";
    }
    
    return device;
  };

  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || "Unknown IP";
    } catch (error) {
      console.error("Failed to get IP address:", error);
      return "Unknown IP";
    }
  };

  const validate = () => {
    let isValid = true;
    if (activeTab === "serviceNo") {
      if (serviceNo.trim() === "" || password.trim() === "") {
        isValid = false;
        toast.error("Please enter valid Service No & Password.");
      }
    } else {
      if (phoneNo.trim() === "") {
        isValid = false;
        toast.error("Please enter a valid Mobile Number.");
      }
    }
    return isValid;
  };

  const handleButtonClick = async (e) => {
    if (validate() && !loading) {
      try {
        sessionStorage.removeItem("explicit_logout");

        const device = getDeviceInfo();
        const ip = await getIPAddress();
        
        const loginId = activeTab === "serviceNo" ? serviceNo : phoneNo;
        handleLogin(loginId, password, device, ip);
      } catch (error) {
        toast.error("Failed to get device information");
      }
    }
  };

  const onServiceNoChanged = (e) => {
    setserviceNo(e.target.value);
  };

  const onPasswordChanged = (e) => {
    setpassword(e.target.value);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        backgroundImage: `url(${bgArc})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        py: 4,
      }}
    >
      <Box
        component="img"
        sx={{
          height: "auto",
          width: "60%",
          maxHeight: { xs: 180, md: 150 },
          maxWidth: { xs: 340, md: 280 },
          objectFit: "contain",
          mb: 2,
        }}
        src={nutrinutsLogo}
        alt="Nutrinuts COCO"
      />

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          width: "100%",
          maxWidth: 420,
          p: { xs: 2.5, sm: 3.5 },
          backgroundColor: "#ffffff",
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight={700} sx={{ color: "#111111", mb: 0.5 }}>
            Welcome..!
          </Typography>
          <Typography variant="body2" color="#666666" fontWeight={400}>
            Sign in to continue to your account
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            backgroundColor: "#F5F6F8",
            borderRadius: 3,
            p: 0.5,
            mb: 3,
            border: "1px solid #EAEAEA",
          }}
        >
          <Button
            fullWidth
            onClick={() => setActiveTab("phone")}
            startIcon={<PhoneIcon />}
            sx={{
              borderRadius: 2.5,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              backgroundColor: activeTab === "phone" ? "#1A5D28" : "transparent",
              color: activeTab === "phone" ? "#ffffff" : "#666666",
              "&:hover": {
                backgroundColor: activeTab === "phone" ? "#13461E" : "#EBEBEB",
              },
            }}
          >
            Phone
          </Button>
          <Button
            fullWidth
            onClick={() => setActiveTab("serviceNo")}
            startIcon={<BadgeIcon />}
            sx={{
              borderRadius: 2.5,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              backgroundColor: activeTab === "serviceNo" ? "#1A5D28" : "transparent",
              color: activeTab === "serviceNo" ? "#ffffff" : "#666666",
              "&:hover": {
                backgroundColor: activeTab === "serviceNo" ? "#13461E" : "#EBEBEB",
              },
            }}
          >
            Service No
          </Button>
        </Box>

        <Box>
          {activeTab === "phone" ? (
            <Box mb={2}>
              <TextField
                fullWidth
                id="phone-input"
                placeholder="Enter mobile number"
                variant="outlined"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#1A5D28" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, backgroundColor: "#FAFAFA" },
                }}
                sx={{
                  input: { fontSize: 16, caretColor: "#1A5D28" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#1A5D28",
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="service-no-input"
                  placeholder="Service Number"
                  variant="outlined"
                  value={serviceNo}
                  onChange={onServiceNoChanged}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: "#1A5D28" }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, backgroundColor: "#FAFAFA" },
                  }}
                  sx={{
                    input: { fontSize: 16, caretColor: "#1A5D28" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#1A5D28",
                      },
                    },
                  }}
                />
              </Box>

              <Box mb={1.5}>
                <TextField
                  fullWidth
                  id="password-input"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={onPasswordChanged}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#1A5D28" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, backgroundColor: "#FAFAFA" },
                  }}
                  sx={{
                    input: { fontSize: 16, caretColor: "#1A5D28" },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#1A5D28",
                      },
                    },
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" mb={2} ml={0.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "#1A5D28",
                        "&.Mui-checked": { color: "#1A5D28" },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="#555555" fontWeight={500}>
                      Remember me
                    </Typography>
                  }
                />
              </Box>
            </>
          )}

          <Box mt={2.5} mb={2}>
            <LoadingButton
              onClick={handleButtonClick}
              endIcon={<ArrowForwardIcon />}
              loading={loading}
              loadingPosition="center"
              variant="contained"
              fullWidth
              sx={{
                py: 1.4,
                backgroundColor: "#1A5D28",
                "&:hover": {
                  backgroundColor: "#13461E",
                },
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: 1,
                borderRadius: 3,
                fontSize: "0.95rem",
              }}
            >
              <span style={{ color: "#fff" }}>SIGN IN</span>
            </LoadingButton>
          </Box>

          {biometricAvailable && (
            <Box mt={2} mb={1} textAlign="center">
              <IconButton
                onClick={handleBiometricLogin}
                disabled={loading || biometricLoading}
                sx={{
                  color: "#1A5D28",
                  "&:hover": {
                    backgroundColor: "rgba(26, 93, 40, 0.08)",
                  },
                }}
              >
                <FingerprintIcon sx={{ fontSize: 44 }} />
              </IconButton>
              <Typography variant="body2" color="#646464" fontWeight={500}>
                Use Biometrics
              </Typography>
            </Box>
          )}

          <Box mt={3} pt={2} borderTop="1px solid #F0F0F0" textAlign="center">
            <Typography variant="caption" color="#777777" display="block">
              Having trouble signing in?
            </Typography>
            <Box mt={0.5} display="flex" justifyContent="center" gap={1}>
              <Typography
                variant="caption"
                sx={{
                  color: "#1A5D28",
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Reset password
              </Typography>
              <Typography variant="caption" color="#888888">
                •
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#1A5D28",
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Contact support
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 6,
        }}
      >
        <Typography
          variant="caption"
          color="#646464"
          fontWeight={500}
          textAlign={"center"}
          paddingLeft={3}
          paddingRight={3}
        >
          Copyrights © Colombo Dockyard PLC.
        </Typography>
        <Typography variant="caption" color="#646464" fontWeight={500}>
          All Rights Reserved.
        </Typography>
        <Typography fontSize={8} color="#646464" fontWeight={500}>
          Powered By Dockyard Total Solution (Pvt) Ltd.
        </Typography>
      </Box>
    </Container>
  );
};

export default SignIn;