// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Tooltip,
//   CircularProgress,
//   Alert,
//   Divider,
//   InputAdornment,
//   Toolbar,
//   Avatar,
//   Badge,
//   useMediaQuery,
//   useTheme,
//   Link,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Refresh as RefreshIcon,
//   Search as SearchIcon,
//   Edit as EditIcon,
//   Done as DoneIcon,
//   BuildCircle as BuildCircleIcon,
//   HomeWork as HomeWorkIcon,
//   FilterList as FilterListIcon,
//   Assignment as AssignmentIcon,
//   Construction as ConstructionIcon,
//   CheckCircle as CheckCircleIcon,
//   HourglassEmpty as HourglassEmptyIcon,
// } from "@mui/icons-material";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Loader from "../../components/Utility/Loader";

// const statusMap = {
//   "G": { label: "Good", color: "success", icon: <CheckCircleIcon fontSize="small" /> },
//   "B": { label: "Bad", color: "error", icon: <ConstructionIcon fontSize="small" /> },
//   "P": { label: "Pending", color: "warning", icon: <HourglassEmptyIcon fontSize="small" /> },
//   "C": { label: "Complete", color: "success", icon: <DoneIcon fontSize="small" /> },
//   "A": { label: "Accept", color: "info", icon: <AssignmentIcon fontSize="small" /> },
//   "D": { label: "Complete Done", color: "primary", icon: <DoneIcon fontSize="small" /> },
//   "I": { label: "In Process", color: "secondary", icon: <BuildCircleIcon fontSize="small" /> },
// };

// const bungalowTypeMap = {
//   "1": "Main",
//   "2": "Family",
// };

// const MaintenancePage = () => {
//   const [feedbackData, setFeedbackData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showOnlyPending, setShowOnlyPending] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [maintenanceStatus, setMaintenanceStatus] = useState("");
//   const [maintenanceComment, setMaintenanceComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [tabValue, setTabValue] = useState('all');
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const [isLoading, setIsLoading] = useState(false);
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const ReadMoreText = ({ text, wordLimit = 20 }) => {
//     const [isExpanded, setIsExpanded] = useState(false);

//     if (!text) return "N/A";

//     const words = text.split(' ');

//     if (words.length <= wordLimit) {
//       return text;
//     }

//     const toggleExpand = (e) => {
//       e.preventDefault();
//       setIsExpanded(!isExpanded);
//     };

//     return isExpanded ? (
//       <span>
//         {text}{' '}
//         <Link
//           href="#"
//           onClick={toggleExpand}
//           sx={{
//             color: '#1976d2',
//             fontSize: '11px',
//             fontWeight: 500,
//             ml: 0.5
//           }}
//         >
//           See less
//         </Link>
//       </span>
//     ) : (
//       <span>
//         {words.slice(0, wordLimit).join(' ')}{' '}
//         <Link
//           href="#"
//           onClick={toggleExpand}
//           sx={{
//             color: '#1976d2',
//             fontSize: '11px',
//             fontWeight: 500,
//             ml: 0.5
//           }}
//         >
//           See more
//         </Link>
//       </span>
//     );
//   };

//   useEffect(() => {
//     fetchFeedbackData();
//   }, []);

//   useEffect(() => {
//     if (feedbackData) {
//       let filtered = [...feedbackData];

//       if (tabValue !== 'all') {
//         filtered = filtered.filter(item => item.Feed_Banglowid === tabValue);
//       }

      
//       if (searchTerm) {
//         filtered = filtered.filter(item =>
//           item.Res_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (item.Feed_MatReport && item.Feed_MatReport.toLowerCase().includes(searchTerm.toLowerCase()))
//         );
//       }

      
//       if (showOnlyPending) {
//         filtered = filtered.filter(item => item.Feed_MatStatus === "P");
//       }

//       setFilteredData(filtered);
//     }
//   }, [feedbackData, searchTerm, showOnlyPending, tabValue]);

//   const fetchFeedbackData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get("Reservation/GetFeedbackDetails");
//       if (response.data.StatusCode === 200) {
//         const maintenanceItems = response.data.ResultSet.filter(item => item.Feed_MatReport);
//         setFeedbackData(maintenanceItems);
//         setFilteredData(maintenanceItems);
//       } else {
//         throw new Error("Failed to fetch feedback data");
//       }
//     } catch (err) {
//       console.error("Error fetching feedback data:", err);
//     //  setError("Failed to load maintenance data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenDialog = (feedback) => {
//     setSelectedFeedback(feedback);
//     setMaintenanceStatus(feedback.Feed_MatStatus);
//     setMaintenanceComment(feedback.Feed_MatComm || "");
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedFeedback(null);
//     setMaintenanceComment("");
//   };

//   const handleUpdateMaintenance = async () => {
//     if (!selectedFeedback) return;

//     setIsSubmitting(true);
//     try {
//       const updateUrl = `Reservation/AddMatcFeedback?P_MATC_STATUS=${maintenanceStatus}&P_MATC_COMMENT=${encodeURIComponent(maintenanceComment)}&P_IWO_NO=1233&P_RESERVATION_NO=${selectedFeedback.Res_no}&P_FEEDBACK_ID=${selectedFeedback.Feed_Id}`;

//       const response = await axios.get(updateUrl);

//       if (response.data && response.data.StatusCode === 200) {
//         const updatedData = feedbackData.map(item => {
//           if (item.Feed_Id === selectedFeedback.Feed_Id) {
//             return {
//               ...item,
//               Feed_MatStatus: maintenanceStatus,
//               Feed_MatComm: maintenanceComment
//             };
//           }
//           return item;
//         });

//         setFeedbackData(updatedData);

//         Swal.fire({
//           icon: "success",
//           title: "Updated Successfully",
//           text: "Maintenance status has been updated.",
//           confirmButtonColor: "#1976d2",
//           timer: 2000,
//           showConfirmButton: false,
//           backdrop: false
//         });
//       } else {
//         throw new Error("API returned an unsuccessful status code");
//       }
//     } catch (error) {
//       console.error("Error updating maintenance status:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: "Failed to update maintenance status. Please try again.",
//         confirmButtonColor: "#1976d2",
//       });
//     } finally {
//       handleCloseDialog();
//       setIsSubmitting(false);
//     }
//   };

//   const togglePendingFilter = () => {
//     setShowOnlyPending(!showOnlyPending);
//   };

//   const handleRefresh = () => {
//     fetchFeedbackData();
//   };

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <div>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <Box sx={{ p: isMobile ? 1 : 3 }}>
//           <Paper sx={{
//             p: isMobile ? 1 : 3,
//             borderRadius: 2,
//             boxShadow: isMobile ? 'none' : theme.shadows[3]
//           }}>
//             {/* Header Section */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 mb: 2,
//                 flexDirection: "row",
//                 width: "100%"
//               }}
//             >
//               {/* Left: Avatar + Title */}
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Avatar
//                   sx={{
//                     bgcolor: "primary.main",
//                     mr: 2,
//                     width: isMobile ? 40 : 48,
//                     height: isMobile ? 40 : 48
//                   }}
//                 >
//                   <BuildCircleIcon fontSize={isMobile ? "medium" : "large"} />
//                 </Avatar>
//                 <Typography
//                   variant={isMobile ? "h6" : "h5"}
//                   component="h1"
//                   fontWeight="bold"
//                 >
//                   Maintenance Reports
//                 </Typography>
//               </Box>

//               {/* Right: Back Button */}
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => navigate(-1)}
//                 sx={{
//                   textTransform: "none",
//                   height: "40px",
//                   minWidth: isMobile ? "auto" : "100px"
//                 }}
//                 size={isMobile ? "small" : "medium"}
//               >
//                 Back
//               </Button>
//             </Box>

//             <Divider sx={{ mb: 3 }} />
//             <Toolbar
//               sx={{
//                 p: 0,
//                 mb: 2,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: 2
//               }}
//             >
//               <TextField
//                 placeholder="Search by Reservation # or Issue"
//                 variant="outlined"
//                 size="small"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 sx={{
//                   width: { xs: "100%", sm: "auto", flexGrow: 1, maxWidth: "500px" },
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2
//                   }
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//             </Toolbar>
//             {/* Tabs */}


//             <Box sx={{
//               borderBottom: 1,
//               borderColor: 'divider',
//               mb: 2,
//               position: 'relative',
//               '&::after': {
//                 content: '""',
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 height: '1px',
//                 backgroundColor: 'rgba(0, 0, 0, 0.08)'
//               }
//             }}>
//               <Tabs
//                 value={tabValue}
//                 onChange={handleTabChange}
//                 variant={isMobile ? "scrollable" : "standard"}
//                 scrollButtons={isMobile ? "auto" : false}
//                 allowScrollButtonsMobile
//                 aria-label="Accommodation types"
//                 sx={{
//                   '& .MuiTabs-indicator': {
//                     height: 3,
//                     backgroundColor: 'primary.main',
//                     borderRadius: '3px 3px 0 0'
//                   }
//                 }}
//               >
//                 <Tab
//                   label="All"
//                   value="all"
//                   sx={{
//                     fontSize: '0.8rem',
//                     textTransform: 'none',
//                     minHeight: 48,
//                     '&.Mui-selected': {
//                       color: 'primary.main',
//                       fontWeight: 600
//                     }
//                   }}
//                 />
//                 <Tab
//                   label="Main Bungalow"
//                   value="1"
//                   sx={{
//                     fontSize: '0.8rem',
//                     textTransform: 'none',
//                     minHeight: 48,
//                     '&.Mui-selected': {
//                       color: 'primary.main',
//                       fontWeight: 600
//                     }
//                   }}
//                 />
//                 {/* <Tab
//                   label="Lower Garden Suite"
//                   value="2"
//                   sx={{
//                     fontSize: '0.8rem',
//                     textTransform: 'none',
//                     minHeight: 48,
//                     '&.Mui-selected': {
//                       color: 'primary.main',
//                       fontWeight: 600
//                     }
//                   }}
//                 /> */}
//               </Tabs>
//             </Box>



//             {error && (
//               <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             {loading ? (
//               <Box sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 minHeight: '200px'
//               }}>
//                 <CircularProgress size={isMobile ? 40 : 60} />
//               </Box>
//             ) : filteredData.length === 0 ? (
//               <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
//                 No maintenance reports found. {searchTerm && "Try adjusting your search."}
//               </Alert>
//             ) : (
//               /* Data Table */
//               <TableContainer
//                 component={Paper}
//                 sx={{
//                   boxShadow: "none",
//                   maxHeight: isMobile ? "calc(100vh - 300px)" : "calc(100vh - 250px)",
//                   overflow: "auto",
//                   borderRadius: 2,
//                   border: `1px solid ${theme.palette.divider}`
//                 }}
//               >
//                 <Table stickyHeader size={isMobile ? "small" : "medium"}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{
//                         fontWeight: "bold",
//                         backgroundColor: theme.palette.primary.main,
//                         color: "white",
//                         py: isMobile ? 1 : 2
//                       }}>
//                         Bungalow
//                       </TableCell>
//                       <TableCell sx={{
//                         fontWeight: "bold",
//                         backgroundColor: theme.palette.primary.main,
//                         color: "white",
//                         py: isMobile ? 1 : 2
//                       }}>
//                         Status
//                       </TableCell>
//                       <TableCell sx={{
//                         fontWeight: "bold",
//                         backgroundColor: theme.palette.primary.main,
//                         color: "white",
//                         py: isMobile ? 1 : 2
//                       }}>
//                         Issue
//                       </TableCell>
                      // <TableCell sx={{
                      //   fontWeight: "bold",
                      //   backgroundColor: theme.palette.primary.main,
                      //   color: "white",
                      //   py: isMobile ? 1 : 2
                      // }}>
                      //   Guest/Rating
                      // </TableCell>

//                       <TableCell sx={{
//                         fontWeight: "bold",
//                         backgroundColor: theme.palette.primary.main,
//                         color: "white",
//                         py: isMobile ? 1 : 2,
//                         display: isMobile ? 'none' : 'table-cell'
//                       }}>
//                         Comments
//                       </TableCell>
//                       <TableCell sx={{
//                         fontWeight: "bold",
//                         backgroundColor: theme.palette.primary.main,
//                         color: "white",
//                         py: isMobile ? 1 : 2
//                       }}>
//                         Actions
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {filteredData.map((feedback) => (
//                       <TableRow key={feedback.Feed_Id} hover>
//                         <TableCell>
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <HomeWorkIcon fontSize="small" sx={{
//                               mr: 1,
//                               color: theme.palette.primary.main,
//                               display: isMobile ? 'none' : 'block'
//                             }} />
//                             <Typography variant="body2" fontWeight="medium">
//                               {bungalowTypeMap[feedback.Feed_Banglowid] || `Bungalow ${feedback.Feed_Banglowid}`}
//                             </Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={statusMap[feedback.Feed_MatStatus]?.label || feedback.Feed_MatStatus}
//                             color={statusMap[feedback.Feed_MatStatus]?.color || "default"}
//                             size="small"
//                             icon={statusMap[feedback.Feed_MatStatus]?.icon}
//                             sx={{
//                               borderRadius: 1,
//                               '& .MuiChip-icon': {
//                                 marginLeft: '4px'
//                               }
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Tooltip
//                             title={feedback.Feed_MatReport || ""}
//                             placement="top"
//                             PopperProps={{
//                               sx: {
//                                 '& .MuiTooltip-tooltip': {
//                                   fontSize: theme.typography.pxToRem(14),
//                                   maxWidth: '250px'
//                                 }
//                               }
//                             }}
//                           >
//                             <Typography variant="body2" noWrap>
//                               <ReadMoreText text={feedback.Feed_MatReport || "N/A"} wordLimit={3} />
//                             </Typography>
//                           </Tooltip>
//                         </TableCell>
                        // <TableCell>
                        //   <Chip
                        //     label={statusMap[feedback.Feed_Status]?.label || feedback.Feed_Status}
                        //     color={statusMap[feedback.Feed_Status]?.color || "default"}
                        //     size="small"
                        //     icon={statusMap[feedback.Feed_Status]?.icon}
                        //     sx={{
                        //       borderRadius: 1,
                        //       '& .MuiChip-icon': {
                        //         marginLeft: '4px'
                        //       }
                        //     }}
                        //   />
                        // </TableCell>

//                         <TableCell sx={{ display: isMobile ? 'none' : 'table-cell' }}>
//                           <Typography variant="body2" noWrap>
//                             {feedback.Feed_MatComm || "-"}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => handleOpenDialog(feedback)}
//                             sx={{
//                               backgroundColor: theme.palette.primary.lighter,
//                               '&:hover': {
//                                 backgroundColor: theme.palette.primary.light
//                               }
//                             }}
//                           >
//                             <EditIcon fontSize="small" />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Paper>

//           {/* Update Maintenance Status Dialog */}
//           <Dialog
//             open={openDialog}
//             onClose={handleCloseDialog}
//             maxWidth="sm"
//             fullWidth
//             fullScreen={isMobile}
//             PaperProps={{
//               sx: {
//                 borderRadius: isMobile ? 0 : 2
//               }
//             }}
//           >
//             <DialogTitle sx={{
//               backgroundColor: theme.palette.primary.main,
//               color: 'white',
//               py: 2
//             }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <EditIcon />
//                 <Typography variant="h6">Update Maintenance Status</Typography>
//               </Box>
//             </DialogTitle>
//             <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
//               <Box sx={{ mt: 1 }}>
//                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                   Reservation: #{selectedFeedback?.Res_no}
//                 </Typography>

//                 <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
//                   Maintenance Issue:
//                 </Typography>
//                 <Box sx={{
//                   p: 2,
//                   bgcolor: theme.palette.grey[100],
//                   borderRadius: 2,
//                   borderLeft: `4px solid ${theme.palette.primary.main}`
//                 }}>
//                   <Typography variant="body1">
//                     {selectedFeedback?.Feed_MatReport}
//                   </Typography>
//                 </Box>

//                 <TextField
//                   select
//                   fullWidth
//                   margin="normal"
//                   label="Status"
//                   value={maintenanceStatus}
//                   onChange={(e) => setMaintenanceStatus(e.target.value)}
//                   variant="outlined"
//                   sx={{ mt: 3 }}
//                   SelectProps={{
//                     MenuProps: {
//                       PaperProps: {
//                         sx: {
//                           maxHeight: 300
//                         }
//                       }
//                     }
//                   }}
//                 >
//                   <MenuItem value="A">
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Chip label="Accept" color="info" size="small" icon={<AssignmentIcon />} />
//                       Accept
//                     </Box>
//                   </MenuItem>
//                   <MenuItem value="I">
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Chip label="In Process" color="secondary" size="small" icon={<BuildCircleIcon />} />
//                       In Process
//                     </Box>
//                   </MenuItem>
//                   <MenuItem value="C">
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Chip label="Complete" color="success" size="small" icon={<CheckCircleIcon />} />
//                       Complete
//                     </Box>
//                   </MenuItem>
//                 </TextField>

//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Maintenance Comments"
//                   multiline
//                   rows={isMobile ? 3 : 4}
//                   value={maintenanceComment}
//                   onChange={(e) => setMaintenanceComment(e.target.value)}
//                   placeholder="Add comments about the maintenance performed..."
//                   variant="outlined"
//                   sx={{ mt: 2 }}
//                   InputProps={{
//                     sx: {
//                       borderRadius: 2
//                     }
//                   }}
//                 />
//               </Box>
//             </DialogContent>
//             <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
//               <Button
//                 onClick={handleCloseDialog}
//                 disabled={isSubmitting}
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 2,
//                   minWidth: 100
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleUpdateMaintenance}
//                 disabled={isSubmitting}
//                 startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
//                 sx={{
//                   borderRadius: 2,
//                   minWidth: 150,
//                   '&.Mui-disabled': {
//                     backgroundColor: theme.palette.action.disabledBackground
//                   }
//                 }}
//               >
//                 {isSubmitting ? "Updating..." : "Update Status"}
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       )}
//     </div>
//   );
// };

// export default MaintenancePage;










import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  Toolbar,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
  Link,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Grid,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Done as DoneIcon,
  BuildCircle as BuildCircleIcon,
  HomeWork as HomeWorkIcon,
  FilterList as FilterListIcon,
  Assignment as AssignmentIcon,
  Construction as ConstructionIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../components/Utility/Loader";

const statusMap = {
  "G": { label: "Good", color: "success", icon: <CheckCircleIcon fontSize="small" /> },
  "B": { label: "Bad", color: "error", icon: <ConstructionIcon fontSize="small" /> },
  "P": { label: "Pending", color: "warning", icon: <HourglassEmptyIcon fontSize="small" /> },
  "C": { label: "Complete", color: "success", icon: <DoneIcon fontSize="small" /> },
  "A": { label: "Accept", color: "info", icon: <AssignmentIcon fontSize="small" /> },
  "D": { label: "Complete Done", color: "primary", icon: <DoneIcon fontSize="small" /> },
  "I": { label: "In Process", color: "secondary", icon: <BuildCircleIcon fontSize="small" /> },
};

const bungalowTypeMap = {
  "1": "Main",
  "2": "Family",
};

const MaintenancePage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [maintenanceStatus, setMaintenanceStatus] = useState("");
  const [maintenanceComment, setMaintenanceComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState('all');
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  

  const dataRef = useRef(feedbackData);

  
  useEffect(() => {
    dataRef.current = feedbackData;
  }, [feedbackData]);

  const ReadMoreText = ({ text, wordLimit = 20 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return "N/A";

    const words = text.split(' ');

    if (words.length <= wordLimit) {
      return text;
    }

    const toggleExpand = (e) => {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    };

    return isExpanded ? (
      <span>
        {text}{' '}
        <Link
          href="#"
          onClick={toggleExpand}
          sx={{
            color: '#1976d2',
            fontSize: '11px',
            fontWeight: 500,
            ml: 0.5
          }}
        >
          See less
        </Link>
      </span>
    ) : (
      <span>
        {words.slice(0, wordLimit).join(' ')}{' '}
        <Link
          href="#"
          onClick={toggleExpand}
          sx={{
            color: '#1976d2',
            fontSize: '11px',
            fontWeight: 500,
            ml: 0.5
          }}
        >
          See more
        </Link>
      </span>
    );
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    if (feedbackData) {
      let filtered = [...feedbackData];

      if (tabValue !== 'all') {
        filtered = filtered.filter(item => item.Feed_Banglowid === tabValue);
      }

      if (searchTerm) {
        filtered = filtered.filter(item =>
          item.Res_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.Feed_MatReport && item.Feed_MatReport.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (showOnlyPending) {
        filtered = filtered.filter(item => item.Feed_MatStatus === "P");
      }

      setFilteredData(filtered);
    }
  }, [feedbackData, searchTerm, showOnlyPending, tabValue]);

  const fetchFeedbackData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("Reservation/GetFeedbackDetails");
      if (response.data.StatusCode === 200) {
        const maintenanceItems = response.data.ResultSet.filter(item => item.Feed_MatReport);
        setFeedbackData(maintenanceItems);
        setFilteredData(maintenanceItems);
      } else {
        throw new Error("Failed to fetch feedback data");
      }
    } catch (err) {
      console.error("Error fetching feedback data:", err);
      setError("Failed to load maintenance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setMaintenanceStatus(feedback.Feed_MatStatus);
    setMaintenanceComment(feedback.Feed_MatComm || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFeedback(null);
    setMaintenanceComment("");
  };

  // ============ FIXED: handleUpdateMaintenance with proper state update ============
  const handleUpdateMaintenance = async () => {
    if (!selectedFeedback) return;

    setIsSubmitting(true);
    try {
      console.log('Updating maintenance for item:', {
        Feed_Id: selectedFeedback.Feed_Id,
        Res_no: selectedFeedback.Res_no,
        currentStatus: selectedFeedback.Feed_MatStatus,
        newStatus: maintenanceStatus,
        comment: maintenanceComment
      });

      const updateUrl = `Reservation/AddMatcFeedback?P_MATC_STATUS=${maintenanceStatus}&P_MATC_COMMENT=${encodeURIComponent(maintenanceComment)}&P_IWO_NO=1233&P_RESERVATION_NO=${selectedFeedback.Res_no}&P_FEEDBACK_ID=${selectedFeedback.Feed_Id}`;

      const response = await axios.get(updateUrl);

      if (response.data && response.data.StatusCode === 200) {
        const updateKey = `${selectedFeedback.Feed_Id}-${selectedFeedback.Res_no}`;

        setFeedbackData(prevData => {
          return prevData.map(item => {
            const itemKey = `${item.Feed_Id}-${item.Res_no}`;
            if (itemKey === updateKey) {
              return {
                ...item,
                Feed_MatStatus: maintenanceStatus,
                Feed_MatComm: maintenanceComment
              };
            }
            return {
              ...item
            };
          });
        });
 
        setFilteredData(prevFiltered => {
          return prevFiltered.map(item => {
            const itemKey = `${item.Feed_Id}-${item.Res_no}`;
            if (itemKey === updateKey) {
              return {
                ...item,
                Feed_MatStatus: maintenanceStatus,
                Feed_MatComm: maintenanceComment
              };
            }
            return {
              ...item
            };
          });
        });

        // Success notification
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Maintenance status has been updated.",
          confirmButtonColor: "#1976d2",
          timer: 2000,
          showConfirmButton: false,
          backdrop: false
        });

         window.location.reload();
        handleCloseDialog();
      } else {
        throw new Error("API returned an unsuccessful status code");
      }
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update maintenance status. Please try again.",
        confirmButtonColor: "#1976d2",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // ============ END OF FIXED FUNCTION ============

  // Alternative approach: Force refresh after update if needed
  const handleUpdateMaintenanceWithRefresh = async () => {
    if (!selectedFeedback) return;

    setIsSubmitting(true);
    try {
      const updateUrl = `Reservation/AddMatcFeedback?P_MATC_STATUS=${maintenanceStatus}&P_MATC_COMMENT=${encodeURIComponent(maintenanceComment)}&P_IWO_NO=1233&P_RESERVATION_NO=${selectedFeedback.Res_no}&P_FEEDBACK_ID=${selectedFeedback.Feed_Id}`;

      const response = await axios.get(updateUrl);

      if (response.data && response.data.StatusCode === 200) {
        // Update state with functional update
        setFeedbackData(prevData => 
          prevData.map(item => {
            if (item.Feed_Id === selectedFeedback.Feed_Id && 
                item.Res_no === selectedFeedback.Res_no) {
              return {
                ...item,
                Feed_MatStatus: maintenanceStatus,
                Feed_MatComm: maintenanceComment
              };
            }
            return { ...item };
          })
        );

        // Optionally refresh from API to ensure data consistency
        // This is a fallback in case state update doesn't work
        setTimeout(() => {
          fetchFeedbackData();
        }, 500);

        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Maintenance status has been updated.",
          confirmButtonColor: "#1976d2",
          timer: 2000,
          showConfirmButton: false,
          backdrop: false
        });

        handleCloseDialog();
      } else {
        throw new Error("API returned an unsuccessful status code");
      }
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update maintenance status. Please try again.",
        confirmButtonColor: "#1976d2",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePendingFilter = () => {
    setShowOnlyPending(!showOnlyPending);
  };

  const handleRefresh = () => {
    fetchFeedbackData();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mobile Card Component
  const MaintenanceCard = ({ feedback }) => (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1.5}>
          {/* Header with Bungalow and Status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeWorkIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                {bungalowTypeMap[feedback.Feed_Banglowid] || `Bungalow ${feedback.Feed_Banglowid}`}
              </Typography>
            </Box>
            <Chip
              label={statusMap[feedback.Feed_MatStatus]?.label || feedback.Feed_MatStatus}
              color={statusMap[feedback.Feed_MatStatus]?.color || "default"}
              size="small"
              icon={statusMap[feedback.Feed_MatStatus]?.icon}
              sx={{ borderRadius: 1 }}
            />
          </Box>

          {/* Issue */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              Issue:
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <ReadMoreText text={feedback.Feed_MatReport || "N/A"} wordLimit={10} />
            </Typography>
          </Box>

          {/* Guest Rating */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                Reservation:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                #{feedback.Res_no}
              </Typography>
            </Box>
            <Chip
              label={statusMap[feedback.Feed_Status]?.label || feedback.Feed_Status}
              color={statusMap[feedback.Feed_Status]?.color || "default"}
              size="small"
              icon={statusMap[feedback.Feed_Status]?.icon}
              sx={{ borderRadius: 1 }}
            />
          </Box>

          {/* Comments if any */}
          {feedback.Feed_MatComment && (
            <Box sx={{ 
              p: 1.5, 
              bgcolor: theme.palette.grey[50], 
              borderRadius: 1,
              borderLeft: `3px solid ${theme.palette.primary.main}`
            }}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                Comments:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {feedback.Feed_MatComment}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ p: 1.5, justifyContent: 'flex-end' }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => handleOpenDialog(feedback)}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Update Status
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
          <Paper sx={{
            p: isMobile ? 1 : 3,
            borderRadius: 2,
            boxShadow: isMobile ? 'none' : theme.shadows[3]
          }}>
            {/* Header Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                flexDirection: "row",
                width: "100%"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    mr: 2,
                    width: isMobile ? 40 : 48,
                    height: isMobile ? 40 : 48
                  }}
                >
                  <BuildCircleIcon fontSize={isMobile ? "medium" : "large"} />
                </Avatar>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  component="h1"
                  fontWeight="bold"
                >
                  Maintenance Reports
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(-1)}
                sx={{
                  textTransform: "none",
                  height: "40px",
                  minWidth: isMobile ? "auto" : "100px"
                }}
                size={isMobile ? "small" : "medium"}
              >
                Back
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />
            
            <Toolbar
              sx={{
                p: 0,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2
              }}
            >
              <TextField
                placeholder="Search by Reservation # or Issue"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: "auto", flexGrow: 1, maxWidth: "500px" },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Toolbar>

            {/* Tabs */}
            <Box sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 2,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: 'rgba(0, 0, 0, 0.08)'
              }
            }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile
                aria-label="Accommodation types"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3,
                    backgroundColor: 'primary.main',
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab
                  label="All"
                  value="all"
                  sx={{
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    minHeight: 48,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 600
                    }
                  }}
                />
                <Tab
                  label="Main Bungalow"
                  value="1"
                  sx={{
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    minHeight: 48,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 600
                    }
                  }}
                />
                <Tab
                  label="Family Bungalow"
                  value="2"
                  sx={{
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    minHeight: 48,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 600
                    }
                  }}
                />
              </Tabs>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: '200px'
              }}>
                <CircularProgress size={isMobile ? 40 : 60} />
              </Box>
            ) : filteredData.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                No maintenance reports found. {searchTerm && "Try adjusting your search."}
              </Alert>
            ) : (
              <>
                {/* Desktop Table View */}
                {!isMobile ? (
                  <TableContainer
                    component={Paper}
                    sx={{
                      boxShadow: "none",
                      maxHeight: "calc(100vh - 250px)",
                      overflow: "auto",
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Table stickyHeader size="medium">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            py: 2
                          }}>
                            Bungalow
                          </TableCell>
                          <TableCell sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            py: 2
                          }}>
                            Status
                          </TableCell>
                          <TableCell sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            py: 2
                          }}>
                            Issue
                          </TableCell>
                          <TableCell sx={{
                        fontWeight: "bold",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        py: isMobile ? 1 : 2
                      }}>
                        Guest/Rating
                      </TableCell>
                          <TableCell sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            py: 2
                          }}>
                            Reservation
                          </TableCell>
                          <TableCell sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            py: 2
                          }}>
                            Comments
                          </TableCell>
                          
                          <TableCell sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            py: 2
                          }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {filteredData.map((feedback) => (
                          <TableRow key={`${feedback.Feed_Id}-${feedback.Res_no}`} hover>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <HomeWorkIcon fontSize="small" sx={{
                                  mr: 1,
                                  color: theme.palette.primary.main
                                }} />
                                <Typography variant="body2" fontWeight="medium">
                                  {bungalowTypeMap[feedback.Feed_Banglowid] || `Bungalow ${feedback.Feed_Banglowid}`}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={statusMap[feedback.Feed_MatStatus]?.label || feedback.Feed_MatStatus}
                                color={statusMap[feedback.Feed_MatStatus]?.color || "default"}
                                size="small"
                                icon={statusMap[feedback.Feed_MatStatus]?.icon}
                                sx={{
                                  borderRadius: 1,
                                  '& .MuiChip-icon': {
                                    marginLeft: '4px'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={feedback.Feed_MatReport || ""}
                                placement="top"
                                PopperProps={{
                                  sx: {
                                    '& .MuiTooltip-tooltip': {
                                      fontSize: theme.typography.pxToRem(14),
                                      maxWidth: '250px'
                                    }
                                  }
                                }}
                              >
                                <Typography variant="body2" noWrap>
                                  <ReadMoreText text={feedback.Feed_MatReport || "N/A"} wordLimit={3} />
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                          <Chip
                            label={statusMap[feedback.Feed_Status]?.label || feedback.Feed_Status}
                            color={statusMap[feedback.Feed_Status]?.color || "default"}
                            size="small"
                            icon={statusMap[feedback.Feed_Status]?.icon}
                            sx={{
                              borderRadius: 1,
                              '& .MuiChip-icon': {
                                marginLeft: '4px'
                              }
                            }}
                          />
                        </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                #{feedback.Res_no}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap>
                                {feedback.Feed_MatComment || "-"}
                              </Typography>
                            </TableCell>
                            
                            <TableCell>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(feedback)}
                                sx={{
                                  backgroundColor: theme.palette.primary.lighter || 'rgba(25, 118, 210, 0.08)',
                                  '&:hover': {
                                    backgroundColor: theme.palette.primary.light || 'rgba(25, 118, 210, 0.12)'
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  /* Mobile Card View */
                  <Box sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
                    {filteredData.map((feedback) => (
                      <MaintenanceCard key={`${feedback.Feed_Id}-${feedback.Res_no}`} feedback={feedback} />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Paper>

          {/* Update Maintenance Status Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 2
              }
            }}
          >
            <DialogTitle sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              py: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EditIcon />
                <Typography variant="h6">Update Maintenance Status</Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Reservation: #{selectedFeedback?.Res_no}
                </Typography>

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                  Maintenance Issue:
                </Typography>
                <Box sx={{
                  p: 2,
                  bgcolor: theme.palette.grey[100],
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}>
                  <Typography variant="body1">
                    {selectedFeedback?.Feed_MatReport}
                  </Typography>
                </Box>

                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Status"
                  value={maintenanceStatus}
                  onChange={(e) => setMaintenanceStatus(e.target.value)}
                  variant="outlined"
                  sx={{ mt: 3 }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 300
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="A">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Accept" color="info" size="small" icon={<AssignmentIcon />} />
                      Accept
                    </Box>
                  </MenuItem>
                  <MenuItem value="I">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="In Process" color="secondary" size="small" icon={<BuildCircleIcon />} />
                      In Process
                    </Box>
                  </MenuItem>
                  <MenuItem value="C">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Complete" color="success" size="small" icon={<CheckCircleIcon />} />
                      Complete
                    </Box>
                  </MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Maintenance Comments"
                  multiline
                  rows={isMobile ? 3 : 4}
                  value={maintenanceComment}
                  onChange={(e) => setMaintenanceComment(e.target.value)}
                  placeholder="Add comments about the maintenance performed..."
                  variant="outlined"
                  sx={{ mt: 2 }}
                  InputProps={{
                    sx: {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button
                onClick={handleCloseDialog}
                disabled={isSubmitting}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  minWidth: 100
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdateMaintenance}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  borderRadius: 2,
                  minWidth: 150,
                  '&.Mui-disabled': {
                    backgroundColor: theme.palette.action.disabledBackground
                  }
                }}
              >
                {isSubmitting ? "Updating..." : "Update Status"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </div>
  );
};

export default MaintenancePage;