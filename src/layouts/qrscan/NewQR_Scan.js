// import * as React from "react";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import QrScanner from "react-qr-scanner";
// import Button from "@mui/material/Button";
// import { styled } from "@mui/material/styles";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import DialogContentText from "@mui/material/DialogContentText";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import DescriptionIcon from "@mui/icons-material/Description";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import { Divider } from "@mui/material";
// import {
//   Grid,
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Autocomplete,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import { SendEWODetails, QRScan, GetEmployeeDetails } from "../../action/QRScan";
// import QRService from "../../service/QRService";
// import { Card, CardContent, Typography } from "@mui/material";
// import {
//   LaptopMac,
//   Person,
//   Keyboard,
//   Mouse,
//   Monitor,
//   Laptop,
//   Memory,
//   BatteryChargingFull,
//   DesktopWindows,
//   Hotel,
//   MeetingRoom,
//   CalendarToday,
//   ArrowForward,
//   ArrowBack,
//   AccessTime,
//   EventAvailable,
//   EventBusy,
// } from "@mui/icons-material";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import axios from "axios";

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialogContent-root": {
//     padding: theme.spacing(2),
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(1),
//   },
// }));

// export interface DialogTitleProps {
//   id: string;
//   children?: React.ReactNode;
//   onClose: () => void;
// }

// function BootstrapDialogTitle(props: DialogTitleProps) {
//   const { children, onClose, ...other } = props;

//   return (
//     <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
//       {children}
//       {onClose ? (
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </DialogTitle>
//   );
// }

// export default function CustomizedDialogs({ isOpen, isOpenDetailScreen }) {
//   const { responseBody, isButtonVisible } = useSelector((state) => state.qr);
//   const { data, loading } = useSelector((state) => state.userbyServiceNo);
//   const { employees, employeeLoading } = useSelector((state) => state.employee || { employees: [], employeeLoading: false });
//   const [qrCode, setQRCode] = useState("");
//   const [openDetailsModal, setOpenDetailsModal] = useState(false);
//   const [qrDetails, setQRDetails] = useState(null);
//   const [receivedDate, setReceivedDate] = useState("");
//   const [issuedBy, setIssuedBy] = useState("");
//   const [issuedDate, setIssuedDate] = useState(null);
//   const [reservationData, setReservationData] = useState([]);
//   const [selectedReservation, setSelectedReservation] = useState(null);
//   const [openReservationModal, setOpenReservationModal] = useState(false);
//   const [reservationAction, setReservationAction] = useState("");
//   const [reservationRemarks, setReservationRemarks] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const dispatch = useDispatch();
//   const [serviceNo, setServiceNo] = useState(data?.[0]?.ServiceNo || '');
//   const [remarks, setRemarks] = useState("");
//   const [openReservationListModal, setOpenReservationListModal] = useState(false);
//   const [filteredReservations, setFilteredReservations] = useState([]);
//   const [isScanning, setIsScanning] = useState(true);
//   const [hasShownNoReservationMsg, setHasShownNoReservationMsg] = useState(false);


//   useEffect(() => {
//     const now = new Date();
//     setIssuedDate(now);
//     setReceivedDate(
//       now.toLocaleString("en-US", {
//         year: "numeric",
//         month: "numeric",
//         day: "numeric",
//         hour: "numeric",
//         minute: "numeric",
//         hour12: true,
//       })
//     );
//   }, []);

//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
//       getCameraOptions();
//     }
//   }, []);

//   useEffect(() => {
//     console.log("Fetching employee details...");
//     dispatch(GetEmployeeDetails());
//   }, [dispatch]);


//   const markCheckStatus = async (reservationNo, checkStatus) => {
//     try {
//       const response = await axios({
//         method: "get",
//         url: `/Reservation/MarkCheckStatus?P_RESERVATION_NO=${reservationNo}&P_CHECK_STATUS=${checkStatus}`,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error in markCheckStatus:", error);
//       throw error;
//     }
//   };

//   const addCaretFeedback = async (reservationNo, caretReport, caretStatus) => {
//     try {
//       const response = await axios({
//         method: "get",
//         url: `/Reservation/AddCaretFeedback?P_RESERVATION_NO=${reservationNo}&P_CARET_STATUS=${caretStatus}`,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error in addCaretFeedback:", error);
//       throw error;
//     }
//   };

//   const handleClose = () => {
//     dispatch({ type: "IS_CLOSE" });
//     setOpenDetailsModal(false);
//     setOpenReservationModal(false);
//     setOpenReservationListModal(false);

//     setIsScanning(true);
//     setHasShownNoReservationMsg(false);
//   };

//   const loadReservationData = async (serviceNumber) => {
//     try {
//       const response = await QRService.LoadResDetailsByServiceNo(serviceNumber);
//       if (response.data.StatusCode === 200) {
//         const allReservations = response.data.ResultSet || [];
//         setReservationData(allReservations);
//         console.log("Loaded all reservations:", allReservations);
//         return allReservations;
//       }
//     } catch (error) {
//       return [];
//     }
//   };

//   const formatDateForComparison = (dateString) => {
//     if (!dateString) return null;
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         if (dateString.includes('/')) {
//           const parts = dateString.split('/');
//           if (parts.length === 3) {
//             const month = parseInt(parts[0], 10);
//             const day = parseInt(parts[1], 10);
//             const year = parseInt(parts[2], 10);

//             if (month > 12) {
//               return `${parts[1]}/${parts[0]}/${parts[2]}`;
//             }
//           }
//         } else if (dateString.includes('-')) {
//           const parts = dateString.split('-');
//           if (parts.length === 3) {
//             return `${parts[1]}/${parts[2]}/${parts[0]}`;
//           }
//         }
//         return null;
//       }
//       return date.toLocaleDateString("en-US", {
//         month: "numeric",
//         day: "numeric",
//         year: "numeric"
//       });
//     } catch (error) {
//       console.error("Error formatting date:", dateString, error);
//       return null;
//     }
//   };

//   const findMatchingReservation = (reservations, qrPrefix, currentDateString) => {

//     const matchingReservations = [];

//     reservations.forEach((reservation, index) => {
//       const resCheckInDate = formatDateForComparison(reservation.Res_Check_In);
//       const resCheckOutDate = formatDateForComparison(reservation.Res_Check_Out);
//       const currentStatus = reservation.Res_CheckStatus;
//       let isMatch = false;
//       let action = "";

//       if (qrPrefix === "I") {
//         if (resCheckInDate === currentDateString &&
//           (!currentStatus || currentStatus === null || currentStatus === "")) {
//           isMatch = true;
//           action = "checkin";
//           console.log("✓ Match for Check In");
//         }
//       } else if (qrPrefix === "O") {
//         if (resCheckOutDate === currentDateString &&
//           currentStatus === "I") {
//           isMatch = true;
//           action = "checkout";
//           console.log("✓ Match for Check Out");
//         }
//       } else if (qrPrefix === "B") {
//         if (resCheckOutDate === currentDateString &&
//           currentStatus === "I") {
//           isMatch = true;
//           action = "checkout";
//           console.log("✓ Match for Both checkout");
//         } else if (resCheckOutDate === currentDateString &&
//           currentStatus === "I") {
//           isMatch = true;
//           action = "checkout";
//           console.log("✓ Match for Both (Check Out)");
//         }
//       }

//       if (isMatch) {
//         matchingReservations.push({
//           ...reservation,
//           action: action,
//           originalIndex: index
//         });
//       }
//     });

//     console.log("\nTotal matching reservations found:", matchingReservations.length);
//     return matchingReservations;
//   };

//   const handleConfirmReservationAction = async () => {
//     if (!selectedReservation) {
//       toast.error("No reservation selected");
//       return;
//     }

//     setProcessing(true);
//     const reservationNo = selectedReservation.Res_no;
//     const qrPrefix = qrCode.charAt(0);


//     let actualPrefix = qrPrefix;
//     if (qrCode === "NEHBI001") actualPrefix = "I";
//     if (qrCode === "NEHBO001") actualPrefix = "O";
//     if (qrCode === "NEHBO002") actualPrefix = "B";

//     try {
//       let result1, result2;

//       if (reservationAction === "checkin") {
//         console.log("Processing check-in for reservation:", reservationNo);


//         result1 = await markCheckStatus(reservationNo, "I");
//         console.log("Check-in API response:", result1);

//         if (result1 && result1.StatusCode === 200) {
//           toast.success("Check-in successful!");
//           handleCloseReservationModal();
//           handleClose(); 
//         } else {
//           toast.error(result1?.Message || "Check-in failed. Please try again.");
//         }
//       }
//       else if (reservationAction === "checkout") {
//         console.log("Processing checkout for reservation:", reservationNo);
//         console.log("QR Prefix:", actualPrefix);

//         if (actualPrefix === "O" || actualPrefix === "B") {

//           result1 = await markCheckStatus(reservationNo, "O");
//           console.log("Check-out API response:", result1);

//           if (result1 && result1.StatusCode === 200) {

//             if (actualPrefix === "B") {
//               result2 = await addCaretFeedback(reservationNo, reservationRemarks || "Checked out", "B");
//               console.log("Caret feedback API response:", result2);

//               if (result2 && result2.StatusCode === 200) {
//                 toast.success("Check-out and caret feedback submitted successfully!");
//               } else {
//                 toast.warning("Check-out successful but caret feedback submission failed.");
//               }
//             } else {
//               toast.success("Check-out successful!");
//             }

//             handleCloseReservationModal();
//             handleClose();  
//           } else {
//             toast.error(result1?.Message || "Check-out failed. Please try again.");
//           }
//         } else {
//           toast.error("Invalid QR code for check-out");
//         }
//       }
//     } catch (error) {
//       console.error("Error processing reservation:", error);
//       toast.error("An error occurred: " + (error.message || "Please try again."));
//     } finally {
//       setProcessing(false);
//     }
//   };
//   // const handleScan = async (scanData) => {
//   //   if (scanData) {
//   //     const scannedText = scanData.text.trim();
//   //     setQRCode(scannedText);

//   //     if (/^[IOB]/.test(scannedText)) {
//   //       const qrPrefix = scannedText.charAt(0);
//   //       const serviceNumber = scannedText.substring(1);

//   //       const allReservations = await loadReservationData(serviceNumber);

//   //       if (allReservations && allReservations.length > 0) {
//   //         const currentDateString = new Date().toLocaleDateString("en-US", {
//   //           month: "numeric",
//   //           day: "numeric",
//   //           year: "numeric"
//   //         });

//   //         const matchingReservations = findMatchingReservation(allReservations, qrPrefix, currentDateString);

//   //         if (matchingReservations.length === 1) {
//   //           const matchingRes = matchingReservations[0];
//   //           setReservationAction(matchingRes.action);
//   //           setSelectedReservation(matchingRes);
//   //           setOpenReservationModal(true);
//   //         } else if (matchingReservations.length > 1) {
//   //           setFilteredReservations(matchingReservations);
//   //           setOpenReservationListModal(true);
//   //         } else {
//   //           if (qrPrefix === "I") {
//   //             toast.error("No pending check-in reservations for today");
//   //           } else if (qrPrefix === "O") {
//   //             toast.error("No check-in reservations ready for check-out today");
//   //           } else if (qrPrefix === "B") {
//   //             toast.error("No valid reservations for check-in/check-out today");
//   //           }
//   //         }
//   //       } else {
//   //         toast.error("No reservations found for this service number");
//   //       }

//   //       return;
//   //     }


//   //     if (/^\d+$/.test(scannedText)) {
//   //       const ewoNo = parseInt(scannedText);
//   //       dispatch(QRScan(ewoNo, data[0]?.ServiceNo));
//   //     } else if (/[A-Za-z]/.test(scannedText)) {
//   //       try {
//   //         const response = await QRService.GetEWODetails(scannedText);
//   //         if (response.data.StatusCode === 200) {
//   //           setQRDetails(response.data.ResultSet);
//   //           setOpenDetailsModal(true);
//   //           dispatch({ type: "IS_CLOSE" });
//   //         }
//   //       } catch (error) {
//   //         console.error("Error fetching QR details:", error);
//   //       }
//   //     }
//   //   }
//   // };


//   const handleScan = async (scanData) => {
//     if (!scanData || !isScanning) return;

//     setIsScanning(false);  

//     const scannedText = scanData.text.trim();
//     setQRCode(scannedText);

//     // ---------------- I / O / B RESERVATION QR ----------------

//     if (scannedText === "NEHBI001" || scannedText === "NEHBO001" || scannedText === "NEHBO002") {

//       let qrPrefix;
//       if (scannedText === "NEHBI001") {
//         qrPrefix = "I";
//       } else if (scannedText === "NEHBO001") {
//         qrPrefix = "O";
//       } else if (scannedText === "NEHBO002") {
//         qrPrefix = "B";
//       }


//       const serviceNumber = data?.[0]?.ServiceNo;  

//       if (!serviceNumber) {
//         toast.error("Service number not found");
//         return;
//       }

//       const allReservations = await loadReservationData(serviceNumber);

//       if (allReservations && allReservations.length > 0) {
//         const currentDateString = new Date().toLocaleDateString("en-US", {
//           month: "numeric",
//           day: "numeric",
//           year: "numeric",
//         });

//         const matchingReservations = findMatchingReservation(
//           allReservations,
//           qrPrefix,
//           currentDateString
//         );

//         if (matchingReservations.length === 1) {
//           setReservationAction(matchingReservations[0].action);
//           setSelectedReservation(matchingReservations[0]);
//           setOpenReservationModal(true);
//         } else if (matchingReservations.length > 1) {
//           setFilteredReservations(matchingReservations);
//           setOpenReservationListModal(true);
//         } else {
//           if (!hasShownNoReservationMsg) {
//             toast.error("No reservations found for today");
//             setHasShownNoReservationMsg(true);
//           }
//         }
//       } else {
//         if (!hasShownNoReservationMsg) {
//           toast.error("No reservations found for this service number");
//           setHasShownNoReservationMsg(true);
//         }
//       }

//       return;
//     }

//     // ---------------- EWO NUMBER QR ----------------
//     if (/^\d+$/.test(scannedText)) {
//       const ewoNo = parseInt(scannedText);
//       dispatch(QRScan(ewoNo, data[0]?.ServiceNo));
//       return;
//     }

//     // ---------------- DEVICE QR ----------------
//     if (/[A-Za-z]/.test(scannedText)) {
//       try {
//         const response = await QRService.GetEWODetails(scannedText);
//         if (response.data.StatusCode === 200) {
//           setQRDetails(response.data.ResultSet);
//           setOpenDetailsModal(true);
//           dispatch({ type: "IS_CLOSE" });
//         }
//       } catch (error) {
//         console.error("Error fetching QR details:", error);
//       }
//     }
//   };




//   const handleSelectReservation = (reservation) => {
//     setSelectedReservation(reservation);
//     setReservationAction(reservation.action);
//     setOpenReservationListModal(false);
//     setOpenReservationModal(true);
//   };

//   const handleCloseDetailsModal = () => {
//     setOpenDetailsModal(false);
//   };

//   const handleCloseReservationModal = () => {
//     setOpenReservationModal(false);
//     setSelectedReservation(null);
//     setReservationRemarks("");
//     setProcessing(false);
//   };

//   const handleCloseReservationListModal = () => {
//     setOpenReservationListModal(false);
//     setFilteredReservations([]);
//   };

//   const handleError = (error) => {
//     console.error(error);
//   };

//   const getCameraOptions = async () => {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     const videoDevices = devices.filter(
//       (device) => device.kind === "videoinput"
//     );
//     const rearCamera = videoDevices.find(
//       (device) => device.label.includes("back") || device.label.includes("rear")
//     );
//   };

//   const previewStyle = {
//     width: "100%",
//     height: "auto",
//   };

//   return (
//     <div>
//       {/* QR Scanner Modal */}
//       <BootstrapDialog
//         onClose={handleClose}
//         aria-labelledby="customized-dialog-title"
//         open={isOpen}
//       >
//         <BootstrapDialogTitle
//           id="customized-dialog-title"
//           onClose={handleClose}
//         >
//           Scan Your QR Code
//         </BootstrapDialogTitle>
//         <DialogContent dividers>
//           <QrScanner
//             delay={1000}
//             onError={handleError}
//             onScan={handleScan}
//             style={previewStyle}
//             constraints={{
//               audio: false,
//               video: {
//                 facingMode: "environment",
//                 autoFocus: true,
//                 torch: false,
//               },
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button
//             autoFocus
//             onClick={() => {
//               handleClose();
//             }}
//           >
//             Scan Again
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>

//       {/*----------------------------------------------------------------------- EWO Details Modal ----------------------------------------------------*/}
//       <BootstrapDialog
//         onClose={handleClose}
//         aria-labelledby="customized-dialog-title"
//         open={isOpenDetailScreen}
//         PaperProps={{
//           sx: {
//             borderRadius: '16px',
//             overflow: 'hidden',
//             maxWidth: '480px',
//             width: '100%',
//           }
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             backgroundColor: "primary.main",
//             px: 3,
//             py: 2,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Box
//               sx={{
//                 bgcolor: 'rgba(255,255,255,0.2)',
//                 p: 1,
//                 borderRadius: 2,
//                 display: 'flex',
//               }}
//             >
//               {/* <DescriptionIcon sx={{ color: 'white' }} /> */}
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
//                 EWO Details
//               </Typography>
//               <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//                 EWO No: {responseBody?.EwoNo || 'N/A'}
//               </Typography>
//             </Box>
//           </Box>
//           <IconButton onClick={handleClose} sx={{ color: 'white' }}>
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         <DialogContent sx={{ p: 3 }}>
//           {/* Status Badge */}
//           <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//             <Box
//               sx={{
//                 px: 2,
//                 py: 1,
//                 borderRadius: '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1,
//                 bgcolor: responseBody?.StatusBckcolor || '#e0e0e0',
//                 color: responseBody?.StatusTxtcolor || '#424242',
//               }}
//             >
//               <CheckCircleIcon sx={{ fontSize: 18 }} />
//               <Typography variant="body2" fontWeight={500}>
//                 {responseBody?.EwoStatus || 'N/A'}
//               </Typography>
//             </Box>
//           </Box>

//           {/* Financial Summary */}
//           <Box
//             sx={{
//               background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//               borderRadius: 3,
//               p: 2,
//               mb: 3,
//               border: '1px solid #e2e8f0',
//             }}
//           >
//             <Typography
//               variant="caption"
//               sx={{
//                 color: '#64748b',
//                 fontWeight: 600,
//                 textTransform: 'uppercase',
//                 letterSpacing: 1,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1,
//                 mb: 2,
//               }}
//             >
//               {/* <AttachMoneyIcon sx={{ fontSize: 16 }} /> */}
//               Financial Summary
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Box sx={{ bgcolor: 'white', borderRadius: 4, p: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                   <Typography variant="caption" color="text.secondary">
//                     Estimated Amount
//                   </Typography>
//                   <Typography variant="h6" fontWeight={700} color="text.primary">
//                     {responseBody?.EstimatedAmount || '0.00'}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box sx={{ bgcolor: 'white', borderRadius: 4, p: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                   <Typography variant="caption" color="text.secondary">
//                     Billed Amount
//                   </Typography>
//                   <Typography variant="h6" fontWeight={700} sx={{ color: '#059669' }}>
//                     {responseBody?.BilledAmount || '0.00'}
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>

//           {/* Personnel Info */}
//           <Box sx={{ mb: 3 }}>
//             <Typography
//               variant="caption"
//               sx={{
//                 color: '#64748b',
//                 fontWeight: 600,
//                 textTransform: 'uppercase',
//                 letterSpacing: 1,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1,
//                 mb: 1,
//               }}
//             >
//               <Person sx={{ fontSize: 16 }} />
//               Personnel
//             </Typography>
//             {[
//               { label: 'Authorized By', value: responseBody?.AuthorizeBy },
//               { label: 'Approved By', value: responseBody?.ApprovedBy },
//               { label: 'Evaluated By', value: responseBody?.EvaluationBy },
//             ].map((item, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   py: 1.5,
//                   borderBottom: index < 2 ? '1px solid # ' : 'none',
//                 }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   {item.label}
//                 </Typography>
//                 <Typography variant="body2" fontWeight={500}>
//                   {item.value || 'N/A'}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>

//           {/* Divider */}
//           <Box sx={{ position: 'relative', my: 3 }}>
//             <Divider sx={{ borderStyle: 'dashed' }} />
//             <Typography
//               variant="caption"
//               sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 bgcolor: 'white',
//                 px: 2,
//                 color: '#94a3b8',
//                 textTransform: 'uppercase',
//                 fontWeight: 500,
//               }}
//             >
//               Receipt Details
//             </Typography>
//           </Box>

//           {/* Receiver Info */}
//           <Box
//             sx={{
//               bgcolor: '#eff6ff',
//               borderRadius: 3,
//               p: 2,
//               mb: 3,
//               border: '1px solid #bfdbfe',
//             }}
//           >
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//               <Box
//                 sx={{
//                   bgcolor: '#dbeafe',
//                   p: 1,
//                   borderRadius: '50%',
//                   display: 'flex',
//                 }}
//               >
//                 <Person sx={{ color: '#2563eb', fontSize: 20 }} />
//               </Box>
//               <Box>
//                 <Typography variant="caption" sx={{ color: '#2563eb' }}>
//                   Received By
//                 </Typography>
//                 <Typography variant="body1" fontWeight={600}>
//                   {data?.[0]?.ReportName || 'N/A'}
//                 </Typography>
//               </Box>
//             </Box>
//             <Box sx={{ bgcolor: 'white', borderRadius: 2, px: 2, py: 1.5 }}>
//               <Typography variant="caption" color="text.secondary">
//                 Service Number
//               </Typography>
//               <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
//                 {data?.[0]?.ServiceNo || 'N/A'}
//               </Typography>
//             </Box>
//           </Box>

//           {/* Issued By */}
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <Autocomplete
//               options={employees || []}
//               getOptionLabel={(option) => `${option.EmpName} (${option.ServiceNo})`}
//               value={employees?.find((emp) => emp.ServiceNo === serviceNo) || null}
//               onChange={(event, newValue) => {
//                 setIssuedBy(newValue ? newValue.EmpName : '');
//                 setServiceNo(newValue ? newValue.ServiceNo : '');
//               }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Issued By"
//                   variant="outlined"
//                   fullWidth
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 3,
//                     },
//                   }}
//                 />
//               )}
//               renderOption={(props, option) => (
//                 <li {...props}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <Typography fontWeight={500}>{option.EmpName}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {option.ServiceNo}
//                     </Typography>
//                   </Box>
//                 </li>
//               )}
//               disabled={employeeLoading}
//               loading={employeeLoading}
//               noOptionsText={employeeLoading ? 'Loading...' : 'No employees found'}
//               disablePortal
//             />
//           </FormControl>

//           {/* Issued Date */}
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DateTimePicker
//               label="Issued Date"
//               value={issuedDate}
//               onChange={(newValue) => setIssuedDate(newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   fullWidth
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 3,
//                     },
//                   }}
//                 />
//               )}
//             />
//           </LocalizationProvider>
//         </DialogContent>

//         {/* Footer */}
//         <Box
//           sx={{
//             px: 3,
//             py: 2,
//             bgcolor: '#f8fafc',
//             borderTop: '1px solid #e2e8f0',
//             display: 'flex',
//             gap: 1.5,
//           }}
//         >
//           <Button
//             variant="outlined"
//             startIcon={<CloseIcon />}
//             onClick={handleClose}
//             sx={{
//               flex: 1,
//               borderRadius: 3,
//               py: 1.5,
//               textTransform: 'none',
//               fontWeight: 500,
//               borderColor: '#cbd5e1',
//               color: '#475569',
//             }}
//           >
//             Close
//           </Button>
//           {isButtonVisible && (
//             <Button
//               variant="contained"
//               startIcon={<SendIcon />}
//               onClick={async () => {
//                 try {
//                   await dispatch(SendEWODetails(responseBody, serviceNo, remarks));
//                   toast.success('Document sent successfully!');
//                   handleClose();
//                 } catch (error) {
//                   toast.error('Failed to send document');
//                 }
//               }}
//               sx={{
//                 flex: 1,
//                 borderRadius: 3,
//                 py: 1.5,
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 backgroundColor: "primary.main",
//                 boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)',
//                 },
//               }}
//             >
//               Send Doc
//             </Button>
//           )}
//         </Box>
//       </BootstrapDialog>

//       {/* Reservation List Modal (When multiple matches found) */}
//       <BootstrapDialog
//         onClose={handleCloseReservationListModal}
//         aria-labelledby="reservation-list-modal-title"
//         open={openReservationListModal}
//         maxWidth="md"
//         fullWidth
//       >
//         <BootstrapDialogTitle
//           id="reservation-list-modal-title"
//           onClose={handleCloseReservationListModal}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Hotel sx={{ color: '#2196f3' }} />
//             <Typography variant="h6">
//               Select Reservation
//             </Typography>
//           </Box>
//         </BootstrapDialogTitle>
//         <DialogContent dividers>
//           <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
//             Multiple reservations found for today. Please select one:
//           </Typography>

//           <Grid container spacing={2}>
//             {filteredReservations.map((reservation, index) => (
//               <Grid item xs={12} key={index}>
//                 <Card
//                   sx={{
//                     cursor: 'pointer',
//                     transition: 'all 0.3s',
//                     '&:hover': {
//                       transform: 'translateY(-2px)',
//                       boxShadow: 3,
//                       borderColor: reservation.action === 'checkin' ? '#4caf50' : '#f44336'
//                     },
//                     border: '2px solid',
//                     borderColor: reservation.action === 'checkin' ? '#c8e6c9' : '#ffcdd2',
//                   }}
//                   onClick={() => handleSelectReservation(reservation)}
//                 >
//                   <CardContent>
//                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                       <Box>
//                         <Typography variant="h6" fontWeight={700}>
//                           Reservation #{reservation.Res_no}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Service No: {reservation.Res_Service_no}
//                         </Typography>
//                       </Box>

//                       <Box sx={{
//                         bgcolor: reservation.action === 'checkin' ? '#4caf50' : '#f44336',
//                         color: 'white',
//                         px: 2,
//                         py: 1,
//                         borderRadius: '20px',
//                         fontWeight: 600,
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 1
//                       }}>
//                         {reservation.action === 'checkin' ? (
//                           <>
//                             <ArrowForward sx={{ fontSize: 16 }} />
//                             Check In
//                           </>
//                         ) : (
//                           <>
//                             <ArrowBack sx={{ fontSize: 16 }} />
//                             Check Out
//                           </>
//                         )}
//                       </Box>
//                     </Box>

//                     <Divider sx={{ my: 2 }} />

//                     <Grid container spacing={2}>
//                       <Grid item xs={6}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <EventAvailable sx={{ color: '#4caf50', fontSize: 18 }} />
//                           <Box>
//                             <Typography variant="caption" color="text.secondary">
//                               Check-in Date
//                             </Typography>
//                             <Typography variant="body2" fontWeight={500}>
//                               {reservation.Res_Check_In || 'N/A'}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <EventBusy sx={{ color: '#f44336', fontSize: 18 }} />
//                           <Box>
//                             <Typography variant="caption" color="text.secondary">
//                               Check-out Date
//                             </Typography>
//                             <Typography variant="body2" fontWeight={500}>
//                               {reservation.Res_Check_Out || 'N/A'}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="text.secondary">
//                           Bungalow ID
//                         </Typography>
//                         <Typography variant="body2" fontWeight={500}>
//                           {reservation.Res_Bang_Id || 'N/A'}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="text.secondary">
//                           Status
//                         </Typography>
//                         <Typography variant="body2" fontWeight={500} sx={{
//                           color: reservation.Res_CheckStatus === 'Check In' ? '#4caf50' :
//                             reservation.Res_CheckStatus === 'Check Out' ? '#f44336' : '#ff9800'
//                         }}>
//                           {reservation.Res_CheckStatus || 'Pending'}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             variant="outlined"
//             onClick={handleCloseReservationListModal}
//           >
//             Cancel
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>

//       {/* Reservation Check-in/Check-out Modal */}
//       <BootstrapDialog
//         onClose={handleCloseReservationModal}
//         aria-labelledby="reservation-modal-title"
//         open={openReservationModal}
//         maxWidth="sm"
//         fullWidth
//       >
//         <BootstrapDialogTitle
//           id="reservation-modal-title"
//           onClose={handleCloseReservationModal}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             {reservationAction === "checkin" ? (
//               <ArrowForward sx={{ color: '#4caf50' }} />
//             ) : (
//               <ArrowBack sx={{ color: '#f44336' }} />
//             )}
//             <Typography variant="h6">
//               {reservationAction === "checkin" ? "Check In" : "Check Out"} - Reservation
//             </Typography>
//           </Box>
//         </BootstrapDialogTitle>
//         <DialogContent dividers>
//           {selectedReservation && (
//             <Grid container spacing={2}>
//               {/* Reservation Summary Card */}
//               <Grid item xs={12}>
//                 <Card
//                   sx={{
//                     background: reservationAction === "checkin"
//                       ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
//                       : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
//                     borderRadius: 3,
//                     border: reservationAction === "checkin"
//                       ? '1px solid #a5d6a7'
//                       : '1px solid #ef9a9a',
//                   }}
//                 >
//                   <CardContent>
//                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Hotel sx={{
//                           fontSize: 40,
//                           color: reservationAction === "checkin" ? '#388e3c' : '#d32f2f'
//                         }} />
//                         <Box>
//                           <Typography variant="h6" fontWeight={700}>
//                             Reservation #{selectedReservation.Res_no}
//                           </Typography>

//                         </Box>
//                       </Box>
//                       <Box sx={{
//                         bgcolor: reservationAction === "checkin" ? '#4caf50' : '#f44336',
//                         color: 'white',
//                         px: 2,
//                         py: 1,
//                         borderRadius: '20px',
//                         fontWeight: 600
//                       }}>
//                         {reservationAction === "checkin" ? "CHECK IN" : "CHECK OUT"}
//                       </Box>
//                     </Box>

//                     <Divider sx={{ my: 2 }} />

//                     {/* Reservation Details */}
//                     <Grid container spacing={2}>
//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           Service No :
//                         </Typography>
//                         <Typography variant="body1" fontWeight={600}>
//                           {selectedReservation.Res_Service_no || 'N/A'}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           Bungalow :
//                         </Typography>
//                         <Typography variant="body1" fontWeight={600}>
//                           {selectedReservation.Res_Bang_Id === "1"
//                             ? "Main Bungalow"
//                             : selectedReservation.Res_Bang_Id === "2"
//                               ? "Lower Garden Suite"
//                               : "N/A"}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           Check-in Date:
//                         </Typography>
//                         <Typography variant="body1" fontWeight={600}>
//                           {selectedReservation.Res_Check_In
//                             ? new Date(selectedReservation.Res_Check_In).toLocaleDateString()
//                             : "Not checked out yet"}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           Check-out Date:
//                         </Typography>
//                         <Typography variant="body1" fontWeight={600}>
//                           {selectedReservation.Res_Check_Out
//                             ? new Date(selectedReservation.Res_Check_Out).toLocaleDateString()
//                             : "Not checked out yet"}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           Adults:
//                         </Typography>
//                         <Typography variant="body1" fontWeight={600}>
//                           {selectedReservation.Res_AdultCount || '0'}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           Children:
//                         </Typography>
//                         <Typography variant="body1" fontWeight={600}>
//                           {selectedReservation.Res_ChildCount || '0'}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </Grid>

//               {/* Current Date Display */}
//               <Grid item xs={12}>
//                 <Box sx={{
//                   bgcolor: '#e3f2fd',
//                   p: 2,
//                   borderRadius: 2,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between'
//                 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <CalendarToday sx={{ color: '#1976d2' }} />
//                     <Typography variant="body1" fontWeight={600}>
//                       {reservationAction === "checkin" ? "Check-in Date:" : "Check-out Date:"}
//                     </Typography>
//                   </Box>
//                   <Typography variant="h6" fontWeight={700} color="primary">
//                     {new Date().toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric',
//                     })}
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button
//             variant="outlined"
//             onClick={handleCloseReservationModal}
//             sx={{ mr: 1 }}
//             disabled={processing}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleConfirmReservationAction}
//             disabled={processing}
//             sx={{
//               bgcolor: reservationAction === "checkin" ? '#4caf50' : '#f44336',
//               '&:hover': {
//                 bgcolor: reservationAction === "checkin" ? '#388e3c' : '#d32f2f',
//               },
//               '&.Mui-disabled': {
//                 bgcolor: reservationAction === "checkin" ? '#a5d6a7' : '#ef9a9a',
//               }
//             }}
//           >
//             {processing ? (
//               "Processing..."
//             ) : reservationAction === "checkin" ? (
//               "Confirm Check In"
//             ) : (
//               "Confirm Check Out"
//             )}
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>

//       {/* QR Code Details Modal */}
//       <BootstrapDialog
//         onClose={handleCloseDetailsModal}
//         aria-labelledby="qr-code-details-title"
//         open={openDetailsModal}
//         maxWidth="md"
//         fullWidth
//       >
//         <BootstrapDialogTitle
//           id="qr-code-details-title"
//           onClose={handleCloseDetailsModal}
//         >
//           CDPLC QR
//         </BootstrapDialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={2}>
//             {/* QR Code Details */}
//             <Grid item xs={12}>
//               <Card
//                 sx={{
//                   border: "1px solid #b1a9a9",
//                   borderRadius: 5,
//                   padding: 2,
//                   marginBottom: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Typography variant="h6" fontWeight="bold" fontSize={18} mb={2}>
//                       QR Code Details
//                     </Typography>

//                     {/* Device Icon based on QR */}
//                     {qrCode?.includes("S") && <Monitor sx={{ fontSize: 50 }} />}
//                     {qrCode?.includes("K") && <Keyboard sx={{ fontSize: 50 }} />}
//                     {qrCode?.includes("M") && <Mouse sx={{ fontSize: 50 }} />}
//                     {qrCode?.includes("L") && <LaptopMac sx={{ fontSize: 50 }} />}
//                     {qrCode?.includes("U") && <BatteryChargingFull sx={{ fontSize: 50 }} />}
//                     {qrCode?.includes("P") && <DesktopWindows sx={{ fontSize: 50 }} />}
//                     {qrCode?.includes("O") && <Memory sx={{ fontSize: 50 }} />}
//                     {qrCode?.includes("C") && <DesktopWindows sx={{ fontSize: 50 }} />}
//                   </Box>

//                   {(() => {
//                     let deviceData = {
//                       Code: "N/A",
//                       Sno: "N/A",
//                       Make: "N/A",
//                       Device: "N/A",
//                       Model: "N/A",
//                       Status: "N/A",
//                     };

//                     if (qrCode?.includes("S")) {
//                       deviceData = {
//                         Device: "Screen",
//                         Code: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Code,
//                         Sno: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Sno,
//                         Make: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Make,
//                         Model: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Model,
//                         Status: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Status,
//                       };
//                     } else if (qrCode?.includes("K")) {
//                       deviceData = {
//                         Device: "Keyboard",
//                         Code: qrDetails?.Key_Code,
//                         Sno: qrDetails?.Key_Sno,
//                         Make: qrDetails?.Key_Make,
//                         Model: qrDetails?.Key_Model,
//                         Status: qrDetails?.Key_Status,
//                       };
//                     } else if (qrCode?.includes("M")) {
//                       deviceData = {
//                         Device: "Mouse",
//                         Code: qrDetails?.Mou_Code,
//                         Make: qrDetails?.Mou_Make,
//                         Sno: qrDetails?.Mou_Sno,
//                         Model: qrDetails?.Mou_Model,
//                         Status: qrDetails?.Mou_Status,
//                       };
//                     } else if (qrCode?.includes("L")) {
//                       deviceData = {
//                         Device: "Laptop",
//                         Code: qrDetails?.Lap_Code,
//                         Sno: qrDetails?.Lap_Sno,
//                         Make: qrDetails?.Lap_Make,
//                         Model: qrDetails?.Lap_Model,
//                         Status: qrDetails?.Lap_Status,
//                       };
//                     } else if (qrCode?.includes("P")) {
//                       deviceData = {
//                         Device: "Computer",
//                         Code: qrDetails?.Com_Code,
//                         Sno: qrDetails?.Mac_Sno,
//                         Make: qrDetails?.Mac_Make,
//                         Model: qrDetails?.Mac_Model,
//                         Status: qrDetails?.Mac_Status,
//                       };
//                     } else if (qrCode?.includes("C")) {
//                       deviceData = {
//                         Device: "Machine",
//                         Code: qrDetails?.Mac_Code,
//                         Sno: qrDetails?.Mac_Sno,
//                         Make: qrDetails?.Mac_Make,
//                         Model: qrDetails?.Mac_Model,
//                         Status: qrDetails?.Mac_Status,
//                       };
//                     } else if (qrCode?.includes("U")) {
//                       deviceData = {
//                         Device: "UPS",
//                         Code: qrDetails?.Ups_Code,
//                         Sno: qrDetails?.Ups_Sno,
//                         Make: qrDetails?.Ups_Make,
//                         Model: qrDetails?.Ups_Model,
//                         Status: qrDetails?.Ups_Status,
//                       };
//                     }

//                     return (
//                       <Grid container spacing={2}>
//                         <Grid item xs={6}>
//                           <Typography variant="body2" fontWeight="bold">QR Code:</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="body2">{deviceData.Code || "N/A"}</Typography>
//                         </Grid>

//                         <Grid item xs={6}>
//                           <Typography variant="body2" fontWeight="bold">Serial No:</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               wordBreak: "break-all",
//                               whiteSpace: "normal",
//                             }}
//                           >
//                             {deviceData.Sno || "N/A"}
//                           </Typography>
//                         </Grid>

//                         <Grid item xs={6}>
//                           <Typography variant="body2" fontWeight="bold">Device:</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="body2">{deviceData.Device || "N/A"}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="body2" fontWeight="bold">Make:</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="body2">{deviceData.Make || "N/A"}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="body2" fontWeight="bold">Model:</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="body2">{deviceData.Model || "N/A"}</Typography>
//                         </Grid>

//                         <Grid item xs={6}>
//                           <Typography variant="body2" fontWeight="bold">Status:</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="body2">
//                             {deviceData.Status === "A"
//                               ? "Active"
//                               : deviceData.Status === "I"
//                                 ? "Inactive"
//                                 : deviceData.Status === "D"
//                                   ? "Disposable"
//                                   : "N/A"}
//                           </Typography>
//                         </Grid>
//                       </Grid>
//                     );
//                   })()}
//                 </CardContent>
//               </Card>
//             </Grid>


//             <Grid item xs={12}>
//               <Card
//                 sx={{
//                   border: "1px solid #b1a9a9",
//                   borderRadius: 5,
//                   padding: 2,
//                   marginBottom: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Typography
//                       variant="h6"
//                       fontWeight="bold"
//                       fontSize={18}
//                       mb={2}
//                     >
//                       Associated User Details
//                     </Typography>
//                     <IconButton sx={{ color: "black", fontSize: 30 }}>
//                       <Person sx={{ fontSize: 50 }} />
//                     </IconButton>
//                   </Box>

//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" fontWeight="bold">
//                         Service No:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2">
//                         {qrDetails?.Service_No || "N/A"}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" fontWeight="bold">
//                         Name:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2">
//                         {qrDetails?.Emp_Name || "N/A"}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" fontWeight="bold">
//                         Computer Name:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2">
//                         {qrDetails?.Com_Name || "N/A"}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" fontWeight="bold">
//                         Email Address:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2">
//                         {qrDetails?.Emp_Email || "N/A"}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" fontWeight="bold">
//                         Extension:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2">
//                         {qrDetails?.Emp_Exte || "N/A"}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" fontWeight="bold">
//                         Location Code:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2">
//                         {qrDetails?.Com_Loc || "N/A"}
//                       </Typography>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <Typography variant="body2" fontWeight="bold">
//                         Location Name:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2">
//                         {qrDetails?.Com_LocName || "N/A"}
//                       </Typography>
//                     </Grid>


//                     <Grid item xs={6}>
//                       <Typography variant="body2" fontWeight="bold">
//                         Status:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2">
//                         {qrDetails?.Status === "A"
//                           ? "Active"
//                           : qrDetails?.Status === "I"
//                             ? "Inactive"
//                             : qrDetails?.Status === "D"
//                               ? "Disposable"
//                               : "N/A"}
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12}>
//               <Card
//                 sx={{
//                   border: "1px solid #b1a9a9",
//                   borderRadius: 5,
//                   padding: 2,
//                   marginBottom: 2,
//                 }}
//               >
//                 <CardContent>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Typography
//                       variant="h6"
//                       fontWeight="bold"
//                       fontSize={18}
//                       mb={2}
//                     >
//                       Other Associated Devices
//                     </Typography>
//                   </Box>

//                   {[
//                     { title: "Laptop", prefix: "Lap", icon: <Laptop /> },
//                     { title: "Machine", prefix: "Mac", icon: <Memory /> },
//                     { title: "Keyboard", prefix: "Key", icon: <Keyboard /> },
//                     { title: "Mouse", prefix: "Mou", icon: <Mouse /> },
//                   ].map((device, index) => {
//                     const deviceCode =
//                       qrDetails?.[`${device.prefix}_Code`] || "N/A";
//                     if (deviceCode === "N/A") {
//                       return null;
//                     }

//                     return (
//                       <Box
//                         key={index}
//                         sx={{
//                           border: "1px solid #b1a9a9",
//                           padding: 2,
//                           marginBottom: 2,
//                           borderRadius: 3,
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <Typography
//                             variant="h6"
//                             fontWeight="bold"
//                             fontSize={16}
//                             mb={1}
//                           >
//                             {device.title}
//                           </Typography>
//                           {device.icon}
//                         </Box>
//                         <Grid container spacing={2}>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" fontWeight="bold">
//                               {device.title} Code:
//                             </Typography>
//                           </Grid>

//                           <Grid item xs={6}>
//                             <Typography variant="body2">
//                               {deviceCode}
//                             </Typography>
//                           </Grid>


//                           <Grid item xs={6}>
//                             <Typography variant="body2" fontWeight="bold">
//                               {device.title} SerialNo:
//                             </Typography>
//                           </Grid>

//                           <Grid item xs={6}>
//                             <Typography variant="body2"
//                               sx={{
//                                 wordBreak: "break-all",
//                                 whiteSpace: "normal",
//                               }}
//                             >
//                               {qrDetails?.[`${device.prefix}_Sno`] || "N/A"}
//                             </Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" fontWeight="bold">
//                               {device.title} Make:
//                             </Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" >
//                               {qrDetails?.[`${device.prefix}_Make`] || "N/A"}
//                             </Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" fontWeight="bold">
//                               {device.title} Model:
//                             </Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2">
//                               {qrDetails?.[`${device.prefix}_Model`] || "N/A"}
//                             </Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" fontWeight="bold">
//                               {device.title} Status:
//                             </Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2">
//                               {qrDetails?.[`${device.prefix}_Status`] === "A"
//                                 ? "Active"
//                                 : qrDetails?.[`${device.prefix}_Status`] === "I"
//                                   ? "Inactive"
//                                   : qrDetails?.[`${device.prefix}_Status`] === "D"
//                                     ? "Disposable"
//                                     : "N/A"}
//                             </Typography>
//                           </Grid>
//                         </Grid>
//                       </Box>
//                     );
//                   })}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button variant="contained" onClick={handleCloseDetailsModal}>
//             Close
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>
//     </div>
//   );
// }












// import * as React from "react";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Scanner } from "@yudiel/react-qr-scanner";
// import Button from "@mui/material/Button";
// import { styled } from "@mui/material/styles";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import DescriptionIcon from "@mui/icons-material/Description";
// import { Divider } from "@mui/material";
// import {
//   Grid,
//   Box,
//   TextField,
//   FormControl,
//   Autocomplete,
//   Select,
//   MenuItem,
//   InputLabel,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import { SendEWODetails, QRScan, GetEmployeeDetails } from "../../action/QRScan";
// import QRService from "../../service/QRService";
// import {
//   Person,
//   PhotoCamera,
//   Monitor,
//   Keyboard,
//   Mouse,
//   LaptopMac,
//   Laptop,
//   Memory,
//   BatteryChargingFull,
//   DesktopWindows,
//   Hotel,
//   ArrowForward,
//   ArrowBack,
//   CalendarToday,
//   EventAvailable,
//   EventBusy,
// } from "@mui/icons-material";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import axios from "axios";

// // Styled Dialog – prevents mobile layout collapse
// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     display: "flex",
//     flexDirection: "column",
//     maxHeight: "calc(100% - 32px)",
//     width: "calc(100% - 32px)",
//     maxWidth: "480px",
//     margin: theme.spacing(2),
//     borderRadius: "16px",
//     overflow: "hidden",
//     boxSizing: "border-box",
//   },
//   "& .MuiDialogContent-root": {
//     padding: theme.spacing(2),
//     flex: "1 1 auto",
//     minHeight: 0,
//     overflowY: "auto",
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(2),
//     flexShrink: 0,
//   },
//   [theme.breakpoints.down(400)]: {
//     "& .MuiDialog-paper": {
//       width: "calc(100% - 16px)",
//       margin: theme.spacing(1),
//       maxHeight: "calc(100% - 16px)",
//       borderRadius: "12px",
//     },
//     "& .MuiDialogContent-root": {
//       padding: theme.spacing(1.5),
//     },
//     "& .MuiDialogActions-root": {
//       padding: theme.spacing(1.5),
//     },
//   },
// }));

// // ─── Camera helpers ──────────────────────────────────────────────
// function isBackCamera(device) {
//   const lower = (device.label || "").toLowerCase();
//   if (
//     lower.includes("front") ||
//     lower.includes("selfie") ||
//     lower.includes("facing front") ||
//     lower.includes("user facing") ||
//     lower.includes("face")
//   ) return false;

//   if (
//     lower.includes("back") ||
//     lower.includes("rear") ||
//     lower.includes("environment") ||
//     lower.includes("facing back") ||
//     lower.includes("wide") ||
//     lower.includes("macro") ||
//     lower.includes("tele") ||
//     lower.includes("ultra") ||
//     lower.includes("depth")
//   ) return true;

//   return true;
// }

// // function getCameraLabel(device, index) {
// //   const raw = device.label || "";
// //   if (!raw) return `Back Camera ${index + 1}`;

// //   const lower = raw.toLowerCase();
// //   if (lower.includes("ultra") && lower.includes("wide")) return "Ultra-Wide";
// //   if (lower.includes("wide"))   return "Wide";
// //   if (lower.includes("macro"))  return "Macro";
// //   if (lower.includes("tele"))   return "Telephoto";
// //   if (lower.includes("depth"))  return "Depth";

// //   if (
// //     lower.includes("back") ||
// //     lower.includes("rear") ||
// //     lower.includes("environment") ||
// //     lower.includes("facing back")
// //   ) return "Standard";

// //   return raw.length > 28 ? raw.substring(0, 28) + "…" : raw;
// // }


// function getCameraLabel(device, index) {
//   const raw = device.label || "";
//   const camNo = index + 1;

//   if (!raw) return `Back Camera ${camNo}`;

//   const lower = raw.toLowerCase();

//   if (lower.includes("ultra") && lower.includes("wide"))
//     return `Ultra-Wide (Camera ${camNo})`;

//   if (lower.includes("wide"))
//     return `Wide (Camera ${camNo})`;

//   if (lower.includes("macro"))
//     return `Macro (Camera ${camNo})`;

//   if (lower.includes("tele"))
//     return `Telephoto (Camera ${camNo})`;

//   if (lower.includes("depth"))
//     return `Depth (Camera ${camNo})`;

//   if (
//     lower.includes("back") ||
//     lower.includes("rear") ||
//     lower.includes("environment") ||
//     lower.includes("facing back")
//   ) {
//     return `Standard (Camera ${camNo})`;
//   }

//   return raw.length > 28
//     ? `${raw.substring(0, 28)}… (${camNo})`
//     : `${raw} (${camNo})`;
// }

// function scoreCameraForQR(device) {
//   const lower = (device.label || "").toLowerCase();
//   if (lower.includes("ultra")) return 1;
//   if (lower.includes("macro")) return 4;
//   if (lower.includes("depth")) return 3;
//   if (lower.includes("wide")) return 5;
//   if (lower.includes("tele")) return 7;

//   if (
//     lower.includes("back") ||
//     lower.includes("rear") ||
//     lower.includes("environment") ||
//     lower.includes("facing back")
//   ) return 10;

//   return 6;
// }

// function getCameraErrorMessage(err) {
//   const name = err?.name || "";
//   switch (name) {
//     case "NotAllowedError":
//     case "PermissionDeniedError":
//       return "Camera permission was denied. Please allow camera access for this site in your browser settings, then tap Scan Again.";
//     case "NotFoundError":
//     case "DevicesNotFoundError":
//       return "No camera was found on this device.";
//     case "NotReadableError":
//     case "TrackStartError":
//       return "The camera is already in use by another app or browser tab. Close it, then tap Scan Again.";
//     case "OverconstrainedError":
//     case "ConstraintNotSatisfiedError":
//       return "That lens is no longer available. Switching back to the default camera.";
//     case "NotSupportedError":
//     case "SecurityError":
//       return "Camera access needs a secure (HTTPS) connection. Please contact support if this keeps happening.";
//     default:
//       return "Unable to access the camera. Please check permissions and tap Scan Again.";
//   }
// }

// export default function CustomizedDialogs({ isOpen, isOpenDetailScreen }) {
//   const { responseBody, isButtonVisible } = useSelector((state) => state.qr);
//   const { data } = useSelector((state) => state.userbyServiceNo);
//   const { employees, employeeLoading } = useSelector(
//     (state) => state.employee || { employees: [], employeeLoading: false }
//   );

//   // ─── Camera state ──────────────────────────────────────────────
//   const [availableCameras, setAvailableCameras] = useState([]);
//   const [selectedCameraId, setSelectedCameraId] = useState(null);
//   const [cameraLoading, setCameraLoading] = useState(false);
//   const [cameraError, setCameraError] = useState(null);

//   // ─── Scanner / Modal state ────────────────────────────────────
//   const [qrCode, setQRCode] = useState("");
//   const [openDetailsModal, setOpenDetailsModal] = useState(false);
//   const [qrDetails, setQRDetails] = useState(null);
//   const [issuedBy, setIssuedBy] = useState("");
//   const [issuedDate, setIssuedDate] = useState(null);
//   const [isScanning, setIsScanning] = useState(true);
//   const [hasShownNoReservationMsg, setHasShownNoReservationMsg] = useState(false);

//   // ─── Reservation state ────────────────────────────────────────
//   const [reservationData, setReservationData] = useState([]);
//   const [selectedReservation, setSelectedReservation] = useState(null);
//   const [openReservationModal, setOpenReservationModal] = useState(false);
//   const [reservationAction, setReservationAction] = useState("");
//   const [reservationRemarks, setReservationRemarks] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [openReservationListModal, setOpenReservationListModal] = useState(false);
//   const [filteredReservations, setFilteredReservations] = useState([]);

//   // ─── EWO state ────────────────────────────────────────────────
//   const [serviceNo, setServiceNo] = useState(data?.[0]?.ServiceNo || "");
//   const [remarks, setRemarks] = useState("");

//   const dispatch = useDispatch();

//   useEffect(() => {
//     setIssuedDate(new Date());
//   }, []);

//   useEffect(() => {
//     dispatch(GetEmployeeDetails());
//   }, [dispatch]);

//   useEffect(() => {
//     if (isOpen) {
//       enumerateCameras();
//     }
//   }, [isOpen]);

//   const enumerateCameras = async () => {
//     setCameraLoading(true);
//     setCameraError(null);
//     try {
//       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         const e = new Error("Camera API unavailable");
//         e.name = "NotSupportedError";
//         throw e;
//       }

//       const tempStream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });
//       const defaultBackId =
//         tempStream.getVideoTracks()[0]?.getSettings()?.deviceId || null;
//       tempStream.getTracks().forEach((t) => t.stop());

//       const all = (await navigator.mediaDevices.enumerateDevices()).filter(
//         (d) => d.kind === "videoinput"
//       );

//       const hasAnyLabel = all.some((d) => d.label && d.label.trim() !== "");
//       let backCams;

//       if (hasAnyLabel) {
//         backCams = all.filter(isBackCamera);
//       } else {
//         backCams = [];
//         for (const device of all) {
//           try {
//             const s = await navigator.mediaDevices.getUserMedia({
//               video: { deviceId: { exact: device.deviceId } },
//             });
//             const facing = s.getVideoTracks()[0]?.getSettings()?.facingMode;
//             s.getTracks().forEach((t) => t.stop());
//             if (facing !== "user") backCams.push(device);
//           } catch {

//           }
//         }
//         if (backCams.length === 0 && defaultBackId) {
//           const def = all.find((d) => d.deviceId === defaultBackId);
//           if (def) backCams.push(def);
//         }
//       }

//       setAvailableCameras(backCams);

//       setSelectedCameraId((prev) => {
//         if (prev) return prev;
//         if (defaultBackId && backCams.find((c) => c.deviceId === defaultBackId)) {
//           return defaultBackId;
//         }
//         const sorted = [...backCams].sort(
//           (a, b) => scoreCameraForQR(b) - scoreCameraForQR(a)
//         );
//         return sorted[0]?.deviceId || null;
//       });
//     } catch (err) {
//       console.warn("Camera enumeration failed:", err);
//       setSelectedCameraId(null);
//       setCameraError(getCameraErrorMessage(err));
//     } finally {
//       setCameraLoading(false);
//     }
//   };

//   const buildVideoConstraints = () => {
//     if (selectedCameraId) {
//       return { deviceId: { exact: selectedCameraId } };
//     }
//     return { facingMode: "environment" };
//   };

//   const handleClose = () => {
//     dispatch({ type: "IS_CLOSE" });
//     setOpenDetailsModal(false);
//     setOpenReservationModal(false);
//     setOpenReservationListModal(false);
//     setIsScanning(true);
//     setHasShownNoReservationMsg(false);
//   };

//   const handleCloseDetailsModal = () => {
//     setOpenDetailsModal(false);
//   };

//   const handleCloseReservationModal = () => {
//     setOpenReservationModal(false);
//     setSelectedReservation(null);
//     setReservationRemarks("");
//     setProcessing(false);
//   };

//   const handleCloseReservationListModal = () => {
//     setOpenReservationListModal(false);
//     setFilteredReservations([]);
//   };

//   // ─── API calls ─────────────────────────────────────────────────
//   const markCheckStatus = async (reservationNo, checkStatus) => {
//     const response = await axios.get(
//       `/Reservation/MarkCheckStatus?P_RESERVATION_NO=${reservationNo}&P_CHECK_STATUS=${checkStatus}`
//     );
//     return response.data;
//   };

//   const addCaretFeedback = async (reservationNo, caretReport, caretStatus) => {
//     const response = await axios.get(
//       `/Reservation/AddCaretFeedback?P_RESERVATION_NO=${reservationNo}&P_CARET_STATUS=${caretStatus}`
//     );
//     return response.data;
//   };

//   const loadReservationData = async (serviceNumber) => {
//     try {
//       const response = await QRService.LoadResDetailsByServiceNo(serviceNumber);
//       if (response.data.StatusCode === 200) {
//         const all = response.data.ResultSet || [];
//         setReservationData(all);
//         return all;
//       }
//     } catch (error) {
//       console.error("Error fetching reservation data:", error);
//     }
//     return [];
//   };

//   const formatDateForComparison = (dateString) => {
//     if (!dateString) return null;
//     try {
//       const date = new Date(dateString);
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleDateString("en-US", {
//           month: "numeric",
//           day: "numeric",
//           year: "numeric",
//         });
//       }
//     } catch {
//       // ignore
//     }
//     return null;
//   };

//   const findMatchingReservation = (reservations, qrPrefix, currentDateString) => {
//     const matches = [];
//     reservations.forEach((res) => {
//       const checkIn = formatDateForComparison(res.Res_Check_In);
//       const checkOut = formatDateForComparison(res.Res_Check_Out);
//       const status = res.Res_CheckStatus;
//       let action = "";

//       if (qrPrefix === "I" && checkIn === currentDateString && !status) {
//         action = "checkin";
//       } else if (qrPrefix === "O" && checkOut === currentDateString && status === "I") {
//         action = "checkout";
//       } else if (qrPrefix === "B") {
//         if (checkIn === currentDateString && !status) action = "checkin";
//         else if (checkOut === currentDateString && status === "I") action = "checkout";
//       }

//       if (action) matches.push({ ...res, action });
//     });
//     return matches;
//   };

//   const handleConfirmReservationAction = async () => {
//     if (!selectedReservation) return;
//     setProcessing(true);
//     const reservationNo = selectedReservation.Res_no;
//     const prefix =
//       qrCode === "NEHBI001" ? "I" : qrCode === "NEHBO001" ? "O" : "B";

//     try {
//       if (reservationAction === "checkin") {
//         const r = await markCheckStatus(reservationNo, "I");
//         if (r?.StatusCode === 200) {
//           toast.success("Check-in successful!");
//           handleCloseReservationModal();
//           handleClose();
//         } else {
//           toast.error(r?.Message || "Check-in failed.");
//         }
//       } else if (reservationAction === "checkout") {
//         const r = await markCheckStatus(reservationNo, "O");
//         if (r?.StatusCode === 200) {
//           if (prefix === "B") {
//             const r2 = await addCaretFeedback(
//               reservationNo,
//               reservationRemarks || "Checked out",
//               "B"
//             );
//             if (r2?.StatusCode === 200) {
//               toast.success("Check-out and caret feedback submitted!");
//             } else {
//               toast.warning("Check-out successful but caret feedback failed.");
//             }
//           } else {
//             toast.success("Check-out successful!");
//           }
//           handleCloseReservationModal();
//           handleClose();
//         } else {
//           toast.error(r?.Message || "Check-out failed.");
//         }
//       }
//     } catch (error) {
//       toast.error("An error occurred: " + (error.message || "Please try again."));
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // ─── Scan handler ──────────────────────────────────────────────
//   const handleScan = async (scanData) => {
//     if (!scanData || !isScanning) return;
//     setIsScanning(false);

//     const scannedText = scanData.text.trim();
//     setQRCode(scannedText);

//     if (
//       scannedText === "NEHBI001" ||
//       scannedText === "NEHBO001" ||
//       scannedText === "NEHBO002"
//     ) {
//       const qrPrefix =
//         scannedText === "NEHBI001" ? "I" : scannedText === "NEHBO001" ? "O" : "B";
//       const serviceNumber = data?.[0]?.ServiceNo;

//       if (!serviceNumber) {
//         toast.error("Service number not found");
//         return;
//       }

//       const all = await loadReservationData(serviceNumber);
//       if (all && all.length > 0) {
//         const today = new Date().toLocaleDateString("en-US", {
//           month: "numeric",
//           day: "numeric",
//           year: "numeric",
//         });
//         const matches = findMatchingReservation(all, qrPrefix, today);

//         if (matches.length === 1) {
//           setReservationAction(matches[0].action);
//           setSelectedReservation(matches[0]);
//           setOpenReservationModal(true);
//         } else if (matches.length > 1) {
//           setFilteredReservations(matches);
//           setOpenReservationListModal(true);
//         } else if (!hasShownNoReservationMsg) {
//           toast.error("No reservations found for today");
//           setHasShownNoReservationMsg(true);
//         }
//       } else if (!hasShownNoReservationMsg) {
//         toast.error("No reservations found for this service number");
//         setHasShownNoReservationMsg(true);
//       }
//       return;
//     }

//     if (/^\d+$/.test(scannedText)) {
//       dispatch(QRScan(parseInt(scannedText), data[0]?.ServiceNo));
//       return;
//     }

//     if (/[A-Za-z]/.test(scannedText)) {
//       try {
//         const response = await QRService.GetEWODetails(scannedText);
//         if (response.data.StatusCode === 200) {
//           setQRDetails(response.data.ResultSet);
//           setOpenDetailsModal(true);
//           dispatch({ type: "IS_CLOSE" });
//         }
//       } catch (error) {
//         console.error("Error fetching QR details:", error);
//       }
//     }
//   };

//   const handleError = (error) => console.error(error);

//   const handleSelectReservation = (reservation) => {
//     setSelectedReservation(reservation);
//     setReservationAction(reservation.action);
//     setOpenReservationListModal(false);
//     setOpenReservationModal(true);
//   };

//   const handleSendDoc = () => {
//     if (responseBody?.EwoNo && serviceNo) {
//       dispatch(SendEWODetails(responseBody.EwoNo, serviceNo, remarks));
//       toast.success("Document information submitted successfully!");
//       handleClose();
//     } else {
//       toast.error("Missing required dispatch fields.");
//     }
//   };

//   // ─── Render ─────────────────────────────────────────────────────
//   return (
//     <div>
//       {/* ────────────── QR Scanner Modal ────────────────────────── */}
//       <BootstrapDialog
//         onClose={handleClose}
//         aria-labelledby="scanner-dialog-title"
//         open={isOpen}
//       >
//         <DialogTitle
//           id="scanner-dialog-title"
//           sx={{
//             m: 0,
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexShrink: 0,
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Scan Your QR Code
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={handleClose}
//             sx={{ color: (theme) => theme.palette.grey[500] }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers sx={{ p: 0 }}>
//           {/* Camera selector */}
//           <Box
//             sx={{
//               px: { xs: 1.5, sm: 2 },
//               pt: 1.5,
//               pb: 1,
//               bgcolor: "#f8fafc",
//               borderBottom: "1px solid #e2e8f0",
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               minWidth: 0,
//             }}
//           >
//             <PhotoCamera
//               sx={{ color: "#64748b", fontSize: 20, flexShrink: 0 }}
//             />
//             <FormControl size="small" fullWidth sx={{ minWidth: 0 }}>
//               <InputLabel id="camera-select-label">Lens</InputLabel>
//               <Select
//                 labelId="camera-select-label"
//                 label="Lens"
//                 value={
//                   cameraLoading
//                     ? "__loading__"
//                     : selectedCameraId || "__default__"
//                 }
//                 onChange={(e) => {
//                   const val = e.target.value;
//                   if (val === "__loading__" || val === "__default__") return;
//                   setSelectedCameraId(val);
//                   setIsScanning(true);
//                   setCameraError(null);
//                 }}
//                 disabled={cameraLoading}
//                 sx={{
//                   borderRadius: 2,
//                   bgcolor: "white",
//                   "& .MuiSelect-select": {
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                     minWidth: 0,
//                   },
//                 }}
//                 MenuProps={{
//                   PaperProps: { style: { maxWidth: "90vw" } },
//                 }}
//               >
//                 {cameraLoading && (
//                   <MenuItem value="__loading__" disabled>
//                     Detecting lenses…
//                   </MenuItem>
//                 )}
//                 {!cameraLoading && availableCameras.length === 0 && (
//                   <MenuItem value="__default__">Default (Rear Camera)</MenuItem>
//                 )}
//                 {availableCameras.map((cam, idx) => (
//                   <MenuItem key={cam.deviceId} value={cam.deviceId}>
//                     {getCameraLabel(cam, idx)}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>

//           {/* Scanner viewport – using the new Scanner component */}
//           <Box sx={{ p: 1 }}>
//             {cameraLoading ? (
//               <Box
//                 sx={{
//                   minHeight: "350px",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 1.5,
//                 }}
//               >
//                 <CircularProgress size={32} />
//                 <Typography variant="body2" color="text.secondary">
//                   Preparing camera…
//                 </Typography>
//               </Box>
//             ) : cameraError ? (
//               <Box
//                 sx={{
//                   minHeight: "350px",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 2,
//                   px: 3,
//                   textAlign: "center",
//                 }}
//               >
//                 <Typography variant="body2" sx={{ color: "#b91c1c" }}>
//                   {cameraError}
//                 </Typography>
//                 <Button
//                   variant="outlined"
//                   size="small"
//                   onClick={enumerateCameras}
//                   sx={{ textTransform: "none", borderRadius: 2 }}
//                 >
//                   Try Again
//                 </Button>
//               </Box>
//             ) : (
//               <Scanner
//                 key={selectedCameraId || "default"}
//                 onScan={(detectedCodes) => {
//                   if (detectedCodes && detectedCodes.length > 0) {
//                     handleScan({ text: detectedCodes[0].rawValue });
//                   }
//                 }}
//                 onError={(error) => {
//                   console.error("Scanner error:", error);
//                   const message = getCameraErrorMessage(error);
//                   toast.error(message);
//                   // A specific lens can become invalid (unplugged/OS revoked
//                   // it) — fall back to the default camera instead of leaving
//                   // the view dead.
//                   if (
//                     selectedCameraId &&
//                     (error?.name === "OverconstrainedError" ||
//                       error?.name === "NotReadableError")
//                   ) {
//                     setSelectedCameraId(null);
//                   } else {
//                     setCameraError(message);
//                   }
//                 }}
//                 formats={["qr_code"]}
//                 constraints={{
//                   ...buildVideoConstraints(),
//                   advanced: [{ focusMode: "continuous" }],
//                 }}
//                 paused={!isScanning}
//                 components={{ finder: true, torch: false, zoom: false, onOff: false, audio: false }}
//                 styles={{ container: { width: "100%", minHeight: "350px" }, finderBorder: 3 }}
//               />
//             )}
//           </Box>
//         </DialogContent>

//         <DialogActions
//           sx={{
//             p: 2,
//             display: "flex",
//             flexDirection: "row",
//             gap: 1.5,
//             flexWrap: "nowrap",
//           }}
//         >
//           <Button
//             variant="outlined"
//             onClick={() => {
//               setIsScanning(true);
//               setHasShownNoReservationMsg(false);
//               if (cameraError) {
//                 enumerateCameras();
//               }
//             }}
//             fullWidth
//             sx={{
//               textTransform: "none",
//               borderRadius: 2,
//               minHeight: "44px",
//               height: "auto",
//               lineHeight: 1.3,
//               px: 1,
//               fontSize: { xs: "0.8rem", sm: "0.875rem" },
//             }}
//           >
//             Scan Again
//           </Button>
//           <Button
//             color="inherit"
//             variant="contained"
//             onClick={handleClose}
//             fullWidth
//             sx={{
//               textTransform: "none",
//               borderRadius: 2,
//               minHeight: "44px",
//               height: "auto",
//               lineHeight: 1.3,
//               px: 1,
//               fontSize: { xs: "0.8rem", sm: "0.875rem" },
//               bgcolor: "#cbd5e1",
//               "&:hover": { bgcolor: "#94a3b8" },
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>

//       {/* ────────────── EWO Details Modal ───────────────────────── */}
//       <BootstrapDialog
//         onClose={handleClose}
//         aria-labelledby="ewo-details-title"
//         open={isOpenDetailScreen}
//       >
//         {/* Header – Blue background with icon and EWO No */}
//         <Box
//           sx={{
//             backgroundColor: "#1976d2",
//             px: { xs: 2, sm: 3 },
//             py: 2,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 1,
//             flexShrink: 0,
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.5,
//               minWidth: 0,
//               flex: 1,
//             }}
//           >
//             <Box
//               sx={{
//                 bgcolor: "rgba(255,255,255,0.2)",
//                 p: 1,
//                 borderRadius: 2,
//                 display: "flex",
//                 flexShrink: 0,
//               }}
//             >
//               <DescriptionIcon sx={{ color: "white" }} />
//             </Box>
//             <Box sx={{ minWidth: 0 }}>
//               <Typography
//                 variant="h6"
//                 sx={{ color: "white", fontWeight: 600, whiteSpace: "nowrap" }}
//               >
//                 EWO Details
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: "rgba(255,255,255,0.8)",
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                 }}
//               >
//                 EWO No: {responseBody?.EwoNo || "N/A"}
//               </Typography>
//             </Box>
//           </Box>
//           <IconButton
//             onClick={handleClose}
//             sx={{ color: "white", flexShrink: 0 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         {/* Content */}
//         <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
//           {/* Status badge – yellow with checkmark */}
//           <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
//             <Box
//               sx={{
//                 px: 3,
//                 py: 1.5,
//                 borderRadius: "24px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1.5,
//                 bgcolor: responseBody?.StatusBckcolor || "#fef08a",
//                 color: responseBody?.StatusTxtcolor || "#854d0e",
//                 border: "1px solid",
//                 borderColor: responseBody?.StatusBckcolor || "#fde68a",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//               }}
//             >
//               <CheckCircleIcon sx={{ fontSize: 20 }} />
//               <Typography variant="subtitle1" fontWeight={600}>
//                 {responseBody?.EwoStatus || "Forwarded for Costing"}
//               </Typography>
//             </Box>
//           </Box>

//           {/* Financial Summary – two cards */}
//           <Box
//             sx={{
//               background: "#f8fafc",
//               borderRadius: 3,
//               p: 2.5,
//               mb: 3,
//               border: "1px solid #e2e8f0",
//             }}
//           >
//             <Typography
//               variant="caption"
//               sx={{
//                 color: "#64748b",
//                 fontWeight: 600,
//                 textTransform: "uppercase",
//                 letterSpacing: 1,
//                 display: "block",
//                 mb: 2,
//               }}
//             >
//               FINANCIAL SUMMARY
//             </Typography>
//             <Grid container spacing={{ xs: 1.5, sm: 2 }}>
//               <Grid item xs={6}>
//                 <Box
//                   sx={{
//                     bgcolor: "white",
//                     borderRadius: 2,
//                     p: { xs: 1, sm: 1.5 },
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//                     textAlign: "center",
//                     minWidth: 0,
//                   }}
//                 >
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                     display="block"
//                   >
//                     Estimated Amount
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     fontWeight={700}
//                     color="text.primary"
//                     sx={{
//                       fontSize: { xs: "1rem", sm: "1.25rem" },
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {responseBody?.EstimatedAmount || "0.00"}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box
//                   sx={{
//                     bgcolor: "white",
//                     borderRadius: 2,
//                     p: { xs: 1, sm: 1.5 },
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//                     textAlign: "center",
//                     minWidth: 0,
//                   }}
//                 >
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                     display="block"
//                   >
//                     Billed Amount
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     fontWeight={700}
//                     sx={{
//                       color: "#059669",
//                       fontSize: { xs: "1rem", sm: "1.25rem" },
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {responseBody?.BilledAmount || "0.00"}
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>

//           {/* Personnel */}
//           <Box sx={{ mb: 3 }}>
//             <Typography
//               variant="caption"
//               sx={{
//                 color: "#64748b",
//                 fontWeight: 600,
//                 textTransform: "uppercase",
//                 letterSpacing: 1,
//                 display: "block",
//                 mb: 1.5,
//               }}
//             >
//               PERSONNEL
//             </Typography>
//             {[
//               {
//                 label: "Authorized By",
//                 value:
//                   responseBody?.AuthorizeBy ||
//                   responseBody?.AuthorizePerson ||
//                   "N/A",
//               },
//               {
//                 label: "Approved By",
//                 value: responseBody?.ApprovedBy || "N/A",
//               },
//               {
//                 label: "Evaluated By",
//                 value: responseBody?.EvaluationBy || "N/A",
//               },
//             ].map((item, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   py: 1.5,
//                   borderBottom: index < 2 ? "1px solid #f0f0f0" : "none",
//                 }}
//               >
//                 <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                   {item.label}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   fontWeight={500}
//                   sx={{ textAlign: "right" }}
//                 >
//                   {item.value}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>

//           {/* Divider with RECEIPT DETAILS */}
//           <Box sx={{ position: "relative", my: 3 }}>
//             <Divider sx={{ borderStyle: "dashed", borderColor: "#e2e8f0" }} />
//             <Typography
//               variant="caption"
//               sx={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 bgcolor: "white",
//                 px: 2,
//                 color: "#94a3b8",
//                 textTransform: "uppercase",
//                 fontWeight: 500,
//                 letterSpacing: 0.5,
//               }}
//             >
//               RECEIPT DETAILS
//             </Typography>
//           </Box>

//           {/* Receiver info – blue box */}
//           <Box
//             sx={{
//               bgcolor: "#eff6ff",
//               borderRadius: 3,
//               p: 2,
//               mb: 3,
//               border: "1px solid #bfdbfe",
//             }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
//               <Box
//                 sx={{
//                   bgcolor: "#dbeafe",
//                   p: 1,
//                   borderRadius: "50%",
//                   display: "flex",
//                 }}
//               >
//                 <Person sx={{ color: "#2563eb", fontSize: 20 }} />
//               </Box>
//               <Box>
//                 <Typography variant="caption" sx={{ color: "#2563eb", fontWeight: 500 }}>
//                   Received By
//                 </Typography>
//                 <Typography variant="body1" fontWeight={600}>
//                   {data?.[0]?.ReportName || "N/A"}
//                 </Typography>
//               </Box>
//             </Box>
//             <Box sx={{ bgcolor: "white", borderRadius: 2, px: 2, py: 1.5 }}>
//               <Typography variant="caption" color="text.secondary" display="block">
//                 Service Number
//               </Typography>
//               <Typography
//                 variant="body2"
//                 fontWeight={500}
//                 sx={{ fontFamily: "monospace" }}
//               >
//                 {data?.[0]?.ServiceNo || "N/A"}
//               </Typography>
//             </Box>
//           </Box>

//           {/* Issued By */}
//           <FormControl fullWidth sx={{ mb: 2.5 }}>
//             <Autocomplete
//               options={employees || []}
//               getOptionLabel={(option) =>
//                 `${option.EmpName} (${option.ServiceNo})`
//               }
//               value={
//                 employees?.find((emp) => emp.ServiceNo === serviceNo) || null
//               }
//               onChange={(event, newValue) => {
//                 setIssuedBy(newValue ? newValue.EmpName : "");
//                 setServiceNo(newValue ? newValue.ServiceNo : "");
//               }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Issued By"
//                   variant="outlined"
//                   fullWidth
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                     },
//                   }}
//                 />
//               )}
//               renderOption={(props, option) => (
//                 <li {...props}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "100%",
//                     }}
//                   >
//                     <Typography fontWeight={500}>{option.EmpName}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {option.ServiceNo}
//                     </Typography>
//                   </Box>
//                 </li>
//               )}
//               disabled={employeeLoading}
//               loading={employeeLoading}
//               noOptionsText={employeeLoading ? "Loading..." : "No employees found"}
//               disablePortal
//             />
//           </FormControl>

//           {/* Remarks */}
//           <TextField
//             label="Remarks"
//             fullWidth
//             multiline
//             rows={2}
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             sx={{
//               mb: 2.5,
//               "& .MuiOutlinedInput-root": { borderRadius: 2 },
//             }}
//           />

//           {/* Issued Date */}
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DateTimePicker
//               label="Issued Date"
//               value={issuedDate}
//               onChange={(newValue) => setIssuedDate(newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   fullWidth
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                     },
//                   }}
//                 />
//               )}
//             />
//           </LocalizationProvider>
//         </DialogContent>

//         {/* Footer actions – Close on left, Send Doc on right */}
//         <Box
//           sx={{
//             px: { xs: 2, sm: 3 },
//             py: 2,
//             bgcolor: "#ffffff",
//             borderTop: "1px solid #e2e8f0",
//             display: "flex",
//             alignItems: "stretch",
//             gap: 1.5,
//             flexShrink: 0,
//           }}
//         >
//           <Button
//             variant="outlined"
//             startIcon={<CloseIcon />}
//             onClick={handleClose}
//             fullWidth
//             sx={{
//               borderRadius: 2,
//               height: "48px",
//               minHeight: "48px",
//               px: 2,
//               textTransform: "none",
//               fontWeight: 600,
//               whiteSpace: "nowrap",
//               flexDirection: "row",
//               borderColor: "#cbd5e1",
//               color: "#475569",
//               "& .MuiButton-startIcon": { marginRight: 0.75 },
//               "&:hover": {
//                 borderColor: "#94a3b8",
//                 backgroundColor: "#f8fafc",
//               },
//             }}
//           >
//             Close
//           </Button>
//           {isButtonVisible && (
//             <Button
//               variant="contained"
//               endIcon={<SendIcon />}
//               onClick={handleSendDoc}
//               fullWidth
//               sx={{
//                 borderRadius: 2,
//                 height: "48px",
//                 minHeight: "48px",
//                 px: 2,
//                 textTransform: "none",
//                 fontWeight: 600,
//                 whiteSpace: "nowrap",
//                 flexDirection: "row",
//                 backgroundColor: "#1976d2",
//                 boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
//                 "& .MuiButton-endIcon": { marginLeft: 0.75 },
//                 "&:hover": {
//                   backgroundColor: "#1565c0",
//                   boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
//                 },
//               }}
//             >
//               Send Doc
//             </Button>
//           )}
//         </Box>
//       </BootstrapDialog>

//       {/* ────────────── Reservation Action Modal ────────────────── */}
//       <BootstrapDialog
//         onClose={handleCloseReservationModal}
//         open={openReservationModal}
//       >
//         <DialogTitle
//           sx={{
//             m: 0,
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: 1,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
//             {reservationAction === "checkin" ? (
//               <ArrowForward sx={{ color: "#4caf50", flexShrink: 0 }} />
//             ) : (
//               <ArrowBack sx={{ color: "#f44336", flexShrink: 0 }} />
//             )}
//             <Typography
//               variant="h6"
//               sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}
//             >
//               {reservationAction === "checkin" ? "Check In" : "Check Out"} – Reservation
//             </Typography>
//           </Box>
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseReservationModal}
//             sx={{ color: (theme) => theme.palette.grey[500], flexShrink: 0 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
//           {selectedReservation && (
//             <Grid container spacing={{ xs: 1.5, sm: 2 }}>
//               {/* Reservation Summary Card */}
//               <Grid item xs={12}>
//                 <Card
//                   sx={{
//                     background:
//                       reservationAction === "checkin"
//                         ? "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
//                         : "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
//                     borderRadius: 3,
//                     border:
//                       reservationAction === "checkin"
//                         ? "1px solid #a5d6a7"
//                         : "1px solid #ef9a9a",
//                   }}
//                 >
//                   <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         gap: 1,
//                         mb: 2,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
//                         <Hotel
//                           sx={{
//                             fontSize: { xs: 30, sm: 40 },
//                             color: reservationAction === "checkin" ? "#388e3c" : "#d32f2f",
//                             flexShrink: 0,
//                           }}
//                         />
//                         <Typography
//                           variant="h6"
//                           fontWeight={700}
//                           sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, wordBreak: "break-word" }}
//                         >
//                           Reservation #{selectedReservation.Res_no}
//                         </Typography>
//                       </Box>
//                       <Box
//                         sx={{
//                           bgcolor: reservationAction === "checkin" ? "#4caf50" : "#f44336",
//                           color: "white",
//                           px: 1.5,
//                           py: 0.5,
//                           borderRadius: "20px",
//                           fontWeight: 600,
//                           fontSize: "0.75rem",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {reservationAction === "checkin" ? "CHECK IN" : "CHECK OUT"}
//                       </Box>
//                     </Box>

//                     <Divider sx={{ my: 1.5 }} />

//                     <Grid container spacing={1.5}>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
//                           Service No
//                         </Typography>
//                         <Typography variant="body2" fontWeight={600} sx={{ wordBreak: "break-word" }}>
//                           {selectedReservation.Res_Service_no || "N/A"}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
//                           Bungalow
//                         </Typography>
//                         <Typography variant="body2" fontWeight={600} sx={{ wordBreak: "break-word" }}>
//                           {selectedReservation.Res_Bang_Id === "1"
//                             ? "Main Bungalow"
//                             : selectedReservation.Res_Bang_Id === "2"
//                               ? "Lower Garden Suite"
//                               : "N/A"}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
//                           Check-in Date
//                         </Typography>
//                         <Typography variant="body2" fontWeight={600}>
//                           {selectedReservation.Res_Check_In
//                             ? new Date(selectedReservation.Res_Check_In).toLocaleDateString()
//                             : "N/A"}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
//                           Check-out Date
//                         </Typography>
//                         <Typography variant="body2" fontWeight={600}>
//                           {selectedReservation.Res_Check_Out
//                             ? new Date(selectedReservation.Res_Check_Out).toLocaleDateString()
//                             : "N/A"}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
//                           Adults
//                         </Typography>
//                         <Typography variant="body2" fontWeight={600}>
//                           {selectedReservation.Res_AdultCount || "0"}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
//                           Children
//                         </Typography>
//                         <Typography variant="body2" fontWeight={600}>
//                           {selectedReservation.Res_ChildCount || "0"}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </Grid>

//               {/* Current Date Display */}
//               <Grid item xs={12}>
//                 <Box
//                   sx={{
//                     bgcolor: "#e3f2fd",
//                     p: { xs: 1.5, sm: 2 },
//                     borderRadius: 2,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     gap: 1,
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <CalendarToday sx={{ color: "#1976d2", fontSize: 20 }} />
//                     <Typography variant="body2" fontWeight={600}>
//                       {reservationAction === "checkin" ? "Check-in Date" : "Check-out Date"}
//                     </Typography>
//                   </Box>
//                   <Typography variant="body1" fontWeight={700} color="primary" sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }}>
//                     {new Date().toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </Typography>
//                 </Box>
//               </Grid>

//               {reservationAction === "checkout" && (
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Caret/Feedback Remarks"
//                     fullWidth
//                     multiline
//                     rows={2}
//                     value={reservationRemarks}
//                     onChange={(e) => setReservationRemarks(e.target.value)}
//                     sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//                   />
//                 </Grid>
//               )}
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions
//           sx={{ p: 2, display: "flex", flexDirection: "row", gap: 1.5 }}
//         >
//           <Button
//             variant="outlined"
//             onClick={handleCloseReservationModal}
//             disabled={processing}
//             fullWidth
//             sx={{ textTransform: "none", borderRadius: 2, height: "44px" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleConfirmReservationAction}
//             disabled={processing}
//             fullWidth
//             sx={{
//               textTransform: "none",
//               borderRadius: 2,
//               height: "44px",
//               bgcolor: reservationAction === "checkin" ? "#4caf50" : "#f44336",
//               "&:hover": {
//                 bgcolor: reservationAction === "checkin" ? "#388e3c" : "#d32f2f",
//               },
//               "&.Mui-disabled": {
//                 bgcolor: reservationAction === "checkin" ? "#a5d6a7" : "#ef9a9a",
//               },
//             }}
//           >
//             {processing
//               ? "Processing…"
//               : reservationAction === "checkin"
//                 ? "Confirm Check In"
//                 : "Confirm Check Out"}
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>

//       {/* ────────────── Multiple Reservations List ──────────────── */}
//       <BootstrapDialog
//         onClose={handleCloseReservationListModal}
//         open={openReservationListModal}
//       >
//         <DialogTitle
//           sx={{
//             m: 0,
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: 1,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
//             <Hotel sx={{ color: "#2196f3", flexShrink: 0 }} />
//             <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
//               Select Reservation
//             </Typography>
//           </Box>
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseReservationListModal}
//             sx={{ color: (theme) => theme.palette.grey[500], flexShrink: 0 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
//           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//             Multiple reservations found for today. Please select one:
//           </Typography>

//           <Grid container spacing={1.5}>
//             {filteredReservations.map((res, index) => (
//               <Grid item xs={12} key={res.Res_no || index}>
//                 <Card
//                   onClick={() => handleSelectReservation(res)}
//                   sx={{
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                     border: "2px solid",
//                     borderColor: res.action === "checkin" ? "#c8e6c9" : "#ffcdd2",
//                     "&:hover": {
//                       boxShadow: 3,
//                       borderColor: res.action === "checkin" ? "#4caf50" : "#f44336",
//                     },
//                   }}
//                 >
//                   <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         gap: 1,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <Box sx={{ minWidth: 0 }}>
//                         <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem" } }}>
//                           Reservation #{res.Res_no}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Service No: {res.Res_Service_no || "N/A"}
//                         </Typography>
//                       </Box>
//                       <Box
//                         sx={{
//                           bgcolor: res.action === "checkin" ? "#4caf50" : "#f44336",
//                           color: "white",
//                           px: 1.5,
//                           py: 0.5,
//                           borderRadius: "20px",
//                           fontWeight: 600,
//                           fontSize: "0.75rem",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 0.5,
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {res.action === "checkin" ? (
//                           <>
//                             <ArrowForward sx={{ fontSize: 14 }} /> Check In
//                           </>
//                         ) : (
//                           <>
//                             <ArrowBack sx={{ fontSize: 14 }} /> Check Out
//                           </>
//                         )}
//                       </Box>
//                     </Box>

//                     <Divider sx={{ my: 1.5 }} />

//                     <Grid container spacing={1.5}>
//                       <Grid item xs={6}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//                           <EventAvailable sx={{ color: "#4caf50", fontSize: 16, flexShrink: 0 }} />
//                           <Box sx={{ minWidth: 0 }}>
//                             <Typography variant="caption" color="text.secondary" display="block">
//                               Check-in
//                             </Typography>
//                             <Typography variant="body2" fontWeight={500}>
//                               {res.Res_Check_In
//                                 ? new Date(res.Res_Check_In).toLocaleDateString()
//                                 : "N/A"}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//                           <EventBusy sx={{ color: "#f44336", fontSize: 16, flexShrink: 0 }} />
//                           <Box sx={{ minWidth: 0 }}>
//                             <Typography variant="caption" color="text.secondary" display="block">
//                               Check-out
//                             </Typography>
//                             <Typography variant="body2" fontWeight={500}>
//                               {res.Res_Check_Out
//                                 ? new Date(res.Res_Check_Out).toLocaleDateString()
//                                 : "N/A"}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button
//             variant="contained"
//             color="inherit"
//             onClick={handleCloseReservationListModal}
//             fullWidth
//             sx={{
//               textTransform: "none",
//               borderRadius: 2,
//               height: "44px",
//               bgcolor: "#cbd5e1",
//             }}
//           >
//             Close Menu
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>

//       {/* ────────────── QR Code Details Modal (asset / device scan) ────────────────── */}
//       <BootstrapDialog
//         onClose={handleCloseDetailsModal}
//         open={openDetailsModal}
//       >
//         <DialogTitle
//           sx={{
//             m: 0,
//             p: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: 1,
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
//             CDPLC QR
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseDetailsModal}
//             sx={{ color: (theme) => theme.palette.grey[500], flexShrink: 0 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
//           <Grid container spacing={1.5}>
//             {/* QR Code Details */}
//             <Grid item xs={12}>
//               <Card
//                 sx={{
//                   border: "1px solid #b1a9a9",
//                   borderRadius: 4,
//                   p: { xs: 1.5, sm: 2 },
//                 }}
//               >
//                 <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       gap: 1,
//                       mb: 2,
//                     }}
//                   >
//                     <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.125rem" }, minWidth: 0 }}>
//                       QR Code Details
//                     </Typography>

//                     {/* Device icon based on QR code letter */}
//                     <Box sx={{ flexShrink: 0, display: "flex" }}>
//                       {qrCode?.includes("S") && <Monitor sx={{ fontSize: { xs: 36, sm: 50 } }} />}
//                       {qrCode?.includes("K") && <Keyboard sx={{ fontSize: { xs: 36, sm: 50 } }} />}
//                       {qrCode?.includes("M") && <Mouse sx={{ fontSize: { xs: 36, sm: 50 } }} />}
//                       {qrCode?.includes("L") && <LaptopMac sx={{ fontSize: { xs: 36, sm: 50 } }} />}
//                       {qrCode?.includes("U") && <BatteryChargingFull sx={{ fontSize: { xs: 36, sm: 50 } }} />}
//                       {qrCode?.includes("P") && <DesktopWindows sx={{ fontSize: { xs: 36, sm: 50 } }} />}
//                       {qrCode?.includes("O") && <Memory sx={{ fontSize: { xs: 36, sm: 50 } }} />}
//                       {qrCode?.includes("C") && <DesktopWindows sx={{ fontSize: { xs: 36, sm: 50 } }} />}
//                     </Box>
//                   </Box>

//                   {(() => {
//                     let deviceData = {
//                       Code: "N/A",
//                       Sno: "N/A",
//                       Make: "N/A",
//                       Device: "N/A",
//                       Model: "N/A",
//                       Status: "N/A",
//                     };

//                     if (qrCode?.includes("S")) {
//                       deviceData = {
//                         Device: "Screen",
//                         Code: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Code,
//                         Sno: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Sno,
//                         Make: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Make,
//                         Model: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Model,
//                         Status: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Status,
//                       };
//                     } else if (qrCode?.includes("K")) {
//                       deviceData = {
//                         Device: "Keyboard",
//                         Code: qrDetails?.Key_Code,
//                         Sno: qrDetails?.Key_Sno,
//                         Make: qrDetails?.Key_Make,
//                         Model: qrDetails?.Key_Model,
//                         Status: qrDetails?.Key_Status,
//                       };
//                     } else if (qrCode?.includes("M")) {
//                       deviceData = {
//                         Device: "Mouse",
//                         Code: qrDetails?.Mou_Code,
//                         Make: qrDetails?.Mou_Make,
//                         Sno: qrDetails?.Mou_Sno,
//                         Model: qrDetails?.Mou_Model,
//                         Status: qrDetails?.Mou_Status,
//                       };
//                     } else if (qrCode?.includes("L")) {
//                       deviceData = {
//                         Device: "Laptop",
//                         Code: qrDetails?.Lap_Code,
//                         Sno: qrDetails?.Lap_Sno,
//                         Make: qrDetails?.Lap_Make,
//                         Model: qrDetails?.Lap_Model,
//                         Status: qrDetails?.Lap_Status,
//                       };
//                     } else if (qrCode?.includes("P")) {
//                       deviceData = {
//                         Device: "Computer",
//                         Code: qrDetails?.Com_Code,
//                         Sno: qrDetails?.Mac_Sno,
//                         Make: qrDetails?.Mac_Make,
//                         Model: qrDetails?.Mac_Model,
//                         Status: qrDetails?.Mac_Status,
//                       };
//                     } else if (qrCode?.includes("C")) {
//                       deviceData = {
//                         Device: "Machine",
//                         Code: qrDetails?.Mac_Code,
//                         Sno: qrDetails?.Mac_Sno,
//                         Make: qrDetails?.Mac_Make,
//                         Model: qrDetails?.Mac_Model,
//                         Status: qrDetails?.Mac_Status,
//                       };
//                     } else if (qrCode?.includes("U")) {
//                       deviceData = {
//                         Device: "UPS",
//                         Code: qrDetails?.Ups_Code,
//                         Sno: qrDetails?.Ups_Sno,
//                         Make: qrDetails?.Ups_Make,
//                         Model: qrDetails?.Ups_Model,
//                         Status: qrDetails?.Ups_Status,
//                       };
//                     }

//                     const rows = [
//                       ["QR Code", deviceData.Code],
//                       ["Serial No", deviceData.Sno],
//                       ["Device", deviceData.Device],
//                       ["Make", deviceData.Make],
//                       ["Model", deviceData.Model],
//                       [
//                         "Status",
//                         deviceData.Status === "A"
//                           ? "Active"
//                           : deviceData.Status === "I"
//                             ? "Inactive"
//                             : deviceData.Status === "D"
//                               ? "Disposable"
//                               : "N/A",
//                       ],
//                     ];

//                     return (
//                       <Grid container spacing={1.25}>
//                         {rows.map(([label, value]) => (
//                           <React.Fragment key={label}>
//                             <Grid item xs={5} sm={6}>
//                               <Typography variant="body2" fontWeight="bold">
//                                 {label}:
//                               </Typography>
//                             </Grid>
//                             <Grid item xs={7} sm={6}>
//                               <Typography
//                                 variant="body2"
//                                 sx={{ wordBreak: "break-word" }}
//                               >
//                                 {value || "N/A"}
//                               </Typography>
//                             </Grid>
//                           </React.Fragment>
//                         ))}
//                       </Grid>
//                     );
//                   })()}
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Associated User Details */}
//             <Grid item xs={12}>
//               <Card
//                 sx={{
//                   border: "1px solid #b1a9a9",
//                   borderRadius: 4,
//                   p: { xs: 1.5, sm: 2 },
//                 }}
//               >
//                 <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       gap: 1,
//                       mb: 2,
//                     }}
//                   >
//                     <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.125rem" }, minWidth: 0 }}>
//                       Associated User Details
//                     </Typography>
//                     <Person sx={{ fontSize: { xs: 36, sm: 50 }, flexShrink: 0 }} />
//                   </Box>

//                   <Grid container spacing={1.25}>
//                     {[
//                       ["Service No", qrDetails?.Service_No],
//                       ["Name", qrDetails?.Emp_Name],
//                       ["Computer Name", qrDetails?.Com_Name],
//                       ["Email Address", qrDetails?.Emp_Email],
//                       ["Extension", qrDetails?.Emp_Exte],
//                       ["Location Code", qrDetails?.Com_Loc],
//                       ["Location Name", qrDetails?.Com_LocName],
//                       [
//                         "Status",
//                         qrDetails?.Status === "A"
//                           ? "Active"
//                           : qrDetails?.Status === "I"
//                             ? "Inactive"
//                             : qrDetails?.Status === "D"
//                               ? "Disposable"
//                               : "N/A",
//                       ],
//                     ].map(([label, value]) => (
//                       <React.Fragment key={label}>
//                         <Grid item xs={5} sm={6}>
//                           <Typography variant="body2" fontWeight="bold">
//                             {label}:
//                           </Typography>
//                         </Grid>
//                         <Grid item xs={7} sm={6}>
//                           <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
//                             {value || "N/A"}
//                           </Typography>
//                         </Grid>
//                       </React.Fragment>
//                     ))}
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Other Associated Devices */}
//             <Grid item xs={12}>
//               <Card
//                 sx={{
//                   border: "1px solid #b1a9a9",
//                   borderRadius: 4,
//                   p: { xs: 1.5, sm: 2 },
//                 }}
//               >
//                 <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
//                   <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.125rem" }, mb: 2 }}>
//                     Other Associated Devices
//                   </Typography>

//                   {[
//                     { title: "Laptop", prefix: "Lap", icon: <Laptop /> },
//                     { title: "Machine", prefix: "Mac", icon: <Memory /> },
//                     { title: "Keyboard", prefix: "Key", icon: <Keyboard /> },
//                     { title: "Mouse", prefix: "Mou", icon: <Mouse /> },
//                   ].map((device, index) => {
//                     const deviceCode = qrDetails?.[`${device.prefix}_Code`] || "N/A";
//                     if (deviceCode === "N/A") return null;

//                     return (
//                       <Box
//                         key={index}
//                         sx={{
//                           border: "1px solid #e2e8f0",
//                           p: { xs: 1.5, sm: 2 },
//                           mb: 1.5,
//                           borderRadius: 3,
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             mb: 1,
//                           }}
//                         >
//                           <Typography variant="subtitle1" fontWeight="bold">
//                             {device.title}
//                           </Typography>
//                           {device.icon}
//                         </Box>
//                         <Grid container spacing={1.25}>
//                           {[
//                             [`${device.title} Code`, deviceCode],
//                             [`${device.title} Serial No`, qrDetails?.[`${device.prefix}_Sno`]],
//                             [`${device.title} Make`, qrDetails?.[`${device.prefix}_Make`]],
//                             [`${device.title} Model`, qrDetails?.[`${device.prefix}_Model`]],
//                             [
//                               `${device.title} Status`,
//                               qrDetails?.[`${device.prefix}_Status`] === "A"
//                                 ? "Active"
//                                 : qrDetails?.[`${device.prefix}_Status`] === "I"
//                                   ? "Inactive"
//                                   : qrDetails?.[`${device.prefix}_Status`] === "D"
//                                     ? "Disposable"
//                                     : "N/A",
//                             ],
//                           ].map(([label, value]) => (
//                             <React.Fragment key={label}>
//                               <Grid item xs={5} sm={6}>
//                                 <Typography variant="body2" fontWeight="bold">
//                                   {label}:
//                                 </Typography>
//                               </Grid>
//                               <Grid item xs={7} sm={6}>
//                                 <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
//                                   {value || "N/A"}
//                                 </Typography>
//                               </Grid>
//                             </React.Fragment>
//                           ))}
//                         </Grid>
//                       </Box>
//                     );
//                   })}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button
//             variant="contained"
//             onClick={handleCloseDetailsModal}
//             fullWidth
//             sx={{ textTransform: "none", borderRadius: 2, height: "44px" }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>
//     </div>
//   );
// }









import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Scanner } from "@yudiel/react-qr-scanner";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import { Divider } from "@mui/material";
import {
  Grid,
  Box,
  TextField,
  FormControl,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { SendEWODetails, QRScan, GetEmployeeDetails } from "../../action/QRScan";
import QRService from "../../service/QRService";
import {
  Person,
  Monitor,
  Keyboard,
  Mouse,
  LaptopMac,
  Laptop,
  Memory,
  BatteryChargingFull,
  DesktopWindows,
  Hotel,
  ArrowForward,
  ArrowBack,
  CalendarToday,
  EventAvailable,
  EventBusy,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100% - 32px)",
    width: "calc(100% - 32px)",
    maxWidth: "480px",
    margin: theme.spacing(2),
    borderRadius: "16px",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    flex: "1 1 auto",
    minHeight: 0,
    overflowY: "auto",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
    flexShrink: 0,
  },
 
  [theme.breakpoints.down(400)]: {
    "& .MuiDialog-paper": {
      width: "calc(100% - 16px)",
      margin: theme.spacing(1),
      maxHeight: "calc(100% - 16px)",
      borderRadius: "12px",
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(1.5),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1.5),
    },
  },
}));

// ─── Camera helpers ──────────────────────────────────────────────
function isBackCamera(device) {
  const lower = (device.label || "").toLowerCase();
  if (
    lower.includes("front") ||
    lower.includes("selfie") ||
    lower.includes("facing front") ||
    lower.includes("user facing") ||
    lower.includes("face")
  ) return false;

  if (
    lower.includes("back") ||
    lower.includes("rear") ||
    lower.includes("environment") ||
    lower.includes("facing back") ||
    lower.includes("wide") ||
    lower.includes("macro") ||
    lower.includes("tele") ||
    lower.includes("ultra") ||
    lower.includes("depth")
  ) return true;

  return true;
}

function isAndroid() {
  if (typeof window === "undefined" || !navigator) return false;
  return /android/i.test(navigator.userAgent);
}

function getCameraLabel(device, index) {
  const raw = device.label || "";
  const camNo = index + 1;

  if (!raw) return `Back Camera ${camNo}`;

  const lower = raw.toLowerCase();

  if (lower.includes("ultra") && lower.includes("wide"))
    return `Ultra-Wide (Camera ${camNo})`;

  if (lower.includes("wide"))
    return `Wide (Camera ${camNo})`;

  if (lower.includes("macro"))
    return `Macro (Camera ${camNo})`;

  if (lower.includes("tele"))
    return `Telephoto (Camera ${camNo})`;

  if (lower.includes("depth"))
    return `Depth (Camera ${camNo})`;

  if (
    lower.includes("back") ||
    lower.includes("rear") ||
    lower.includes("environment") ||
    lower.includes("facing back")
  ) {
    return `Standard (Camera ${camNo})`;
  }

  return raw.length > 28
    ? `${raw.substring(0, 28)}… (${camNo})`
    : `${raw} (${camNo})`;
}
function scoreCameraForQR(device, index = 0, totalCams = 1) {
  if (!isAndroid()) {
    const lower = (device.label || "").toLowerCase();
    if (lower.includes("ultra"))  return 1;
    if (lower.includes("macro"))  return 4;
    if (lower.includes("depth"))  return 3;
    if (lower.includes("wide"))   return 5;
    if (lower.includes("tele"))   return 7;

    if (
      lower.includes("back") ||
      lower.includes("rear") ||
      lower.includes("environment") ||
      lower.includes("facing back")
    ) return 10;

    return 6;
  }

  const lower = (device.label || "").toLowerCase();

  // ── Explicit "problem" lens keywords ────────────────────────────
  const isUltraWide = lower.includes("ultra") && lower.includes("wide");
  const isMacro     = lower.includes("macro");
  const isDepth     = lower.includes("depth");

  if (isUltraWide) return 1;
  if (isMacro)     return 2;
  if (isDepth)     return 3;

  const hasTypeQualifier =
    lower.includes("main")      ||
    lower.includes("primary")   ||
    lower.includes("standard")  ||
    lower.includes("telephoto") ||
    lower.includes("tele")      ||
    lower.includes("wide")      ||
    lower.includes("ultra")     ||
    lower.includes("macro")     ||
    lower.includes("depth")     ||

    /\b(back|rear)\b camera/i.test(device.label || "") ||
    /\bcamera\b.{0,8}\b(back|rear)\b/i.test(device.label || "");

  const isExplicitMain =
    lower.includes("main")    ||
    lower.includes("primary") ||
    lower.includes("standard");

  const isExplicitBack =
    lower.includes("back")        ||
    lower.includes("rear")        ||
    lower.includes("environment") ||
    lower.includes("facing back");

  // "wide" without any back/main context → it's only a wide lens label
  const isWideOnly =
    lower.includes("wide") && !isExplicitBack && !isExplicitMain;

  if (isExplicitMain && !isWideOnly)             return 12; 
  if (isWideOnly)                                return 4; 
  if (lower.includes("tele") || lower.includes("telephoto")) return 7;


  if (isExplicitBack && hasTypeQualifier) return 10;

  
  if (totalCams > 1) {
    if (index === 0) return 5;  
    if (index === 1) return 9;  
    return 7;                  
  }

  return 6; 
}


function isRiskyLensForQR(device) {
  const lower = (device.label || "").toLowerCase();
  const isUltraWide = lower.includes("ultra") && lower.includes("wide");
  return isUltraWide || lower.includes("macro") || lower.includes("depth");
}


async function getCameraCapabilities(deviceId) {
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
    });
    const track = stream.getVideoTracks()[0];
    if (!track) return {};

 
    const trackCaps =
      typeof track.getCapabilities === "function"
        ? track.getCapabilities()
        : {};

   
    let imageZoom = null;
    try {
      if (typeof ImageCapture !== "undefined") {
        const ic = new ImageCapture(track);
        const photoCaps = await ic.getPhotoCapabilities();
        if (photoCaps?.zoom?.min !== undefined) {
          imageZoom = photoCaps.zoom; // { min, max, step }
        }
      }
    } catch { }

  
    const merged = { ...trackCaps };
    if (imageZoom && !merged.zoom) {
      merged.zoom = imageZoom;
    }

    return merged;
  } catch {
    return {};
  } finally {

    stream?.getTracks().forEach((t) => t.stop());
  }
}


function scoreByCapabilities(caps) {
  if (!caps || Object.keys(caps).length === 0) return null; 

  const zoomMin = caps.zoom?.min;          
  const focusModes = caps.focusMode ?? []; 

  const hasContinuousAF = focusModes.includes("continuous");

  
  if (typeof zoomMin === "number" && zoomMin < 0.95) {

    return hasContinuousAF ? 2 : 1;
  }

 
  if (hasContinuousAF) return 10; 
  return 6;                        
}

function getCameraErrorMessage(err) {
  const name = err?.name || "";
  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "Camera permission was denied. Please allow camera access for this site in your browser settings, then tap Scan Again.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "No camera was found on this device.";
    case "NotReadableError":
    case "TrackStartError":
      return "The camera is already in use by another app or browser tab. Close it, then tap Scan Again.";
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return "That lens is no longer available. Switching back to the default camera.";
    case "NotSupportedError":
    case "SecurityError":
      return "Camera access needs a secure (HTTPS) connection. Please contact support if this keeps happening.";
    default:
      return "Unable to access the camera. Please check permissions and tap Scan Again.";
  }
}


const RISKY_LENS_NUDGE_DELAY = 4000;

export default function CustomizedDialogs({ isOpen, isOpenDetailScreen }) {
  const { responseBody, isButtonVisible } = useSelector((state) => state.qr);
  const { data } = useSelector((state) => state.userbyServiceNo);
  const { employees, employeeLoading } = useSelector(
    (state) => state.employee || { employees: [], employeeLoading: false }
  );

  // ─── Camera state ──────────────────────────────────────────────
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const nudgeTimerRef = useRef(null);
  const hasNudgedForLensRef = useRef(null);

  // ─── Scanner / Modal state ────────────────────────────────────
  const [qrCode, setQRCode] = useState("");
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [qrDetails, setQRDetails] = useState(null);
  const [issuedBy, setIssuedBy] = useState("");
  const [issuedDate, setIssuedDate] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [hasShownNoReservationMsg, setHasShownNoReservationMsg] = useState(false);

  // ─── Reservation state ────────────────────────────────────────
  const [reservationData, setReservationData] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openReservationModal, setOpenReservationModal] = useState(false);
  const [reservationAction, setReservationAction] = useState("");
  const [reservationRemarks, setReservationRemarks] = useState("");
  const [processing, setProcessing] = useState(false);
  const [openReservationListModal, setOpenReservationListModal] = useState(false);
  const [filteredReservations, setFilteredReservations] = useState([]);

  // ─── EWO state ────────────────────────────────────────────────
  const [serviceNo, setServiceNo] = useState(data?.[0]?.ServiceNo || "");
  const [remarks, setRemarks] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setIssuedDate(new Date());
  }, []);

  useEffect(() => {
    dispatch(GetEmployeeDetails());
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      enumerateCameras();
    }
  }, [isOpen]);


  useEffect(() => {
    if (nudgeTimerRef.current) {
      clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = null;
    }

    if (!isOpen || !isScanning || !selectedCameraId) return;

    const currentCam = availableCameras.find(
      (c) => c.deviceId === selectedCameraId
    );
    if (!currentCam || !isRiskyLensForQR(currentCam)) return;
    if (hasNudgedForLensRef.current === selectedCameraId) return;

    nudgeTimerRef.current = setTimeout(() => {
      const better = [...availableCameras]
        .filter((c) => c.deviceId !== selectedCameraId)
        .sort((a, b) => scoreCameraForQR(b) - scoreCameraForQR(a))[0];

      hasNudgedForLensRef.current = selectedCameraId;

      if (better) {
        toast.info(
          "Having trouble focusing? Try switching to the Standard lens for QR scanning.",
          { autoClose: 6000 }
        );
      } else {
        toast.info(
          "Hold the QR code a bit further away — this lens may need more distance to focus.",
          { autoClose: 6000 }
        );
      }
    }, RISKY_LENS_NUDGE_DELAY);

    return () => {
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    };
  }, [isOpen, isScanning, selectedCameraId, availableCameras]);

  const enumerateCameras = async () => {
    setCameraLoading(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const e = new Error("Camera API unavailable");
        e.name = "NotSupportedError";
        throw e;
      }

      // ── Step 1: unlock labels + get browser's default back camera ──
      const unlockStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const defaultBackId =
        unlockStream.getVideoTracks()[0]?.getSettings()?.deviceId || null;
      unlockStream.getTracks().forEach((t) => t.stop());

      // ── Step 2: collect all video inputs ──────────────────────────
      const all = (await navigator.mediaDevices.enumerateDevices()).filter(
        (d) => d.kind === "videoinput"
      );

      
      const hasAnyLabel = all.some((d) => d.label && d.label.trim() !== "");
      let backCams;

      if (hasAnyLabel) {
        backCams = all.filter(isBackCamera);
      } else {
        backCams = [];
        for (const device of all) {
          try {
            const s = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: device.deviceId } },
            });
            const facing = s.getVideoTracks()[0]?.getSettings()?.facingMode;
            s.getTracks().forEach((t) => t.stop());
            if (facing !== "user") backCams.push(device);
          } catch { /* ignore inaccessible cameras */ }
        }
        if (backCams.length === 0 && defaultBackId) {
          const def = all.find((d) => d.deviceId === defaultBackId);
          if (def) backCams.push(def);
        }
      }

      setAvailableCameras(backCams);

      if (backCams.length === 0) {
        setSelectedCameraId(defaultBackId);
        return;
      }

      if (isAndroid()) {
      
        const capabilityResults = [];
        for (const [idx, cam] of backCams.entries()) {
          const caps     = await getCameraCapabilities(cam.deviceId);
          const capScore = scoreByCapabilities(caps);
          capabilityResults.push({ cam, idx, caps, capScore });
        }

        const capSupported = capabilityResults.some((r) => r.capScore !== null);
        let selectedId;

        if (capSupported) {
          const scored = capabilityResults
            .filter((r) => r.capScore !== null)
            .sort((a, b) => b.capScore - a.capScore);
          selectedId = scored[0]?.cam.deviceId || defaultBackId;
        } else {
          
          const total = backCams.length;
          const scored = backCams.map((cam, idx) => ({
            cam,
            score: scoreCameraForQR(cam, idx, total),
          }));
          scored.sort((a, b) => b.score - a.score);
          const best = scored[0]?.cam;

          const defaultDevice = backCams.find((c) => c.deviceId === defaultBackId);
          const defaultIdx    = backCams.indexOf(defaultDevice);
          const defaultScores  = scoreCameraForQR(defaultDevice, defaultIdx, total);
          const bestIdx        = best ? backCams.indexOf(best) : 0;
          const bestScore      = scoreCameraForQR(best, bestIdx, total);

          selectedId =
            defaultDevice && defaultScores >= bestScore
              ? defaultBackId
              : best?.deviceId || defaultBackId || null;
        }
        setSelectedCameraId((prev) => prev || selectedId);
      } else {
        // ── iOS and PC previous standard process ─────────────────────
        setSelectedCameraId((prev) => {
          if (prev) return prev;
          if (defaultBackId && backCams.find((c) => c.deviceId === defaultBackId)) {
            return defaultBackId;
          }
          const sorted = [...backCams].sort(
            (a, b) => scoreCameraForQR(b) - scoreCameraForQR(a)
          );
          return sorted[0]?.deviceId || null;
        });
      }
    } catch (err) {
      console.warn("Camera enumeration failed:", err);
      setSelectedCameraId(null);
      setCameraError(getCameraErrorMessage(err));
    } finally {
      setCameraLoading(false);
    }
  };

  const buildVideoConstraints = () => {
   
    const base = selectedCameraId
      ? { deviceId: { exact: selectedCameraId } }
      : { facingMode: "environment" };

    if (isAndroid()) {
      
      return {
        ...base,
        width:  { ideal: 1280 },
        height: { ideal: 720  },
      };
    }

    return base;
  };

  const handleClose = () => {
    dispatch({ type: "IS_CLOSE" });
    setOpenDetailsModal(false);
    setOpenReservationModal(false);
    setOpenReservationListModal(false);
    setIsScanning(true);
    setHasShownNoReservationMsg(false);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
  };

  const handleCloseReservationModal = () => {
    setOpenReservationModal(false);
    setSelectedReservation(null);
    setReservationRemarks("");
    setProcessing(false);
  };

  const handleCloseReservationListModal = () => {
    setOpenReservationListModal(false);
    setFilteredReservations([]);
  };

  // ─── API calls ─────────────────────────────────────────────────
  const markCheckStatus = async (reservationNo, checkStatus) => {
    const response = await axios.get(
      `/Reservation/MarkCheckStatus?P_RESERVATION_NO=${reservationNo}&P_CHECK_STATUS=${checkStatus}`
    );
    return response.data;
  };

  const addCaretFeedback = async (reservationNo, caretReport, caretStatus) => {
    const response = await axios.get(
      `/Reservation/AddCaretFeedback?P_RESERVATION_NO=${reservationNo}&P_CARET_STATUS=${caretStatus}`
    );
    return response.data;
  };

  const loadReservationData = async (serviceNumber) => {
    try {
      const response = await QRService.LoadResDetailsByServiceNo(serviceNumber);
      if (response.data.StatusCode === 200) {
        const all = response.data.ResultSet || [];
        setReservationData(all);
        return all;
      }
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    }
    return [];
  };

  const formatDateForComparison = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      // ignore
    }
    return null;
  };

  const findMatchingReservation = (reservations, qrPrefix, currentDateString) => {
    const matches = [];
    reservations.forEach((res) => {
      const checkIn = formatDateForComparison(res.Res_Check_In);
      const checkOut = formatDateForComparison(res.Res_Check_Out);
      const status = res.Res_CheckStatus;
      let action = "";

      if (qrPrefix === "I" && checkIn === currentDateString && !status) {
        action = "checkin";
      } else if (qrPrefix === "O" && checkOut === currentDateString && status === "I") {
        action = "checkout";
      } else if (qrPrefix === "B") {
        if (checkIn === currentDateString && !status) action = "checkin";
        else if (checkOut === currentDateString && status === "I") action = "checkout";
      }

      if (action) matches.push({ ...res, action });
    });
    return matches;
  };

  const handleConfirmReservationAction = async () => {
    if (!selectedReservation) return;
    setProcessing(true);
    const reservationNo = selectedReservation.Res_no;
    const prefix =
      qrCode === "NEHBI001" ? "I" : qrCode === "NEHBO001" ? "O" : "B";

    try {
      if (reservationAction === "checkin") {
        const r = await markCheckStatus(reservationNo, "I");
        if (r?.StatusCode === 200) {
          toast.success("Check-in successful!");
          handleCloseReservationModal();
          handleClose();
        } else {
          toast.error(r?.Message || "Check-in failed.");
        }
      } else if (reservationAction === "checkout") {
        const r = await markCheckStatus(reservationNo, "O");
        if (r?.StatusCode === 200) {
          if (prefix === "B") {
            const r2 = await addCaretFeedback(
              reservationNo,
              reservationRemarks || "Checked out",
              "B"
            );
            if (r2?.StatusCode === 200) {
              toast.success("Check-out and caret feedback submitted!");
            } else {
              toast.warning("Check-out successful but caret feedback failed.");
            }
          } else {
            toast.success("Check-out successful!");
          }
          handleCloseReservationModal();
          handleClose();
        } else {
          toast.error(r?.Message || "Check-out failed.");
        }
      }
    } catch (error) {
      toast.error("An error occurred: " + (error.message || "Please try again."));
    } finally {
      setProcessing(false);
    }
  };

  // ─── Scan handler ──────────────────────────────────────────────
  const handleScan = async (scanData) => {
    if (!scanData || !isScanning) return;
    setIsScanning(false);

    if (nudgeTimerRef.current) {
      clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = null;
    }

    const scannedText = scanData.text.trim();
    setQRCode(scannedText);

    if (
      scannedText === "NEHBI001" ||
      scannedText === "NEHBO001" ||
      scannedText === "NEHBO002"
    ) {
      const qrPrefix =
        scannedText === "NEHBI001" ? "I" : scannedText === "NEHBO001" ? "O" : "B";
      const serviceNumber = data?.[0]?.ServiceNo;

      if (!serviceNumber) {
        toast.error("Service number not found");
        return;
      }

      const all = await loadReservationData(serviceNumber);
      if (all && all.length > 0) {
        const today = new Date().toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        });
        const matches = findMatchingReservation(all, qrPrefix, today);

        if (matches.length === 1) {
          setReservationAction(matches[0].action);
          setSelectedReservation(matches[0]);
          setOpenReservationModal(true);
        } else if (matches.length > 1) {
          setFilteredReservations(matches);
          setOpenReservationListModal(true);
        } else if (!hasShownNoReservationMsg) {
          toast.error("No reservations found for today");
          setHasShownNoReservationMsg(true);
        }
      } else if (!hasShownNoReservationMsg) {
        toast.error("No reservations found for this service number");
        setHasShownNoReservationMsg(true);
      }
      return;
    }

    if (/^\d+$/.test(scannedText)) {
      dispatch(QRScan(parseInt(scannedText), data[0]?.ServiceNo));
      return;
    }

    if (/[A-Za-z]/.test(scannedText)) {
      try {
        const response = await QRService.GetEWODetails(scannedText);
        if (response.data.StatusCode === 200) {
          setQRDetails(response.data.ResultSet);
          setOpenDetailsModal(true);
          dispatch({ type: "IS_CLOSE" });
        }
      } catch (error) {
        console.error("Error fetching QR details:", error);
      }
    }
  };

  const handleError = (error) => console.error(error);

  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation);
    setReservationAction(reservation.action);
    setOpenReservationListModal(false);
    setOpenReservationModal(true);
  };

  const handleSendDoc = () => {
    if (responseBody?.EwoNo && serviceNo) {
      dispatch(SendEWODetails(responseBody.EwoNo, serviceNo, remarks));
      toast.success("Document information submitted successfully!");
      handleClose();
    } else {
      toast.error("Missing required dispatch fields.");
    }
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div>
      {/* ────────────── QR Scanner Modal ────────────────────────── */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="scanner-dialog-title"
        open={isOpen}
      >
        <DialogTitle
          id="scanner-dialog-title"
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Scan Your QR Code
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {/* Scanner viewport – using the new Scanner component */}
          <Box sx={{ p: 1 }}>
            {cameraLoading ? (
              <Box
                sx={{
                  minHeight: "350px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">
                  Preparing camera…
                </Typography>
              </Box>
            ) : cameraError ? (
              <Box
                sx={{
                  minHeight: "350px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  px: 3,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "#b91c1c" }}>
                  {cameraError}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={enumerateCameras}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Try Again
                </Button>
              </Box>
            ) : (
              <Scanner
                key={selectedCameraId || "default"}
                onScan={(detectedCodes) => {
                  if (detectedCodes && detectedCodes.length > 0) {
                    handleScan({ text: detectedCodes[0].rawValue });
                  }
                }}
                onError={(error) => {
                  console.error("Scanner error:", error);
                  const message = getCameraErrorMessage(error);
                  toast.error(message);
                  
                  if (
                    selectedCameraId &&
                    (error?.name === "OverconstrainedError" ||
                      error?.name === "NotReadableError")
                  ) {
                    setSelectedCameraId(null);
                  } else {
                    setCameraError(message);
                  }
                }}
                formats={["qr_code"]}
                constraints={{
                  ...buildVideoConstraints(),
                  ...(isAndroid()
                    ? {
                        advanced: [
                          { focusMode: "continuous" },
                          { zoom: 1 },
                          { focusDistance: 0.3 },
                        ],
                      }
                    : {
                       
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        advanced: [{ focusMode: "continuous" }],
                      }),
                }}
                paused={!isScanning}
                components={{ finder: true, torch: false, zoom: false, onOff: false, audio: false }}
                styles={{ container: { width: "100%", minHeight: "350px" }, finderBorder: 3 }}
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "row",
            gap: 1.5,
            flexWrap: "nowrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setIsScanning(true);
              setHasShownNoReservationMsg(false);
              if (cameraError) {
                enumerateCameras();
              }
            }}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: 2,
              minHeight: "44px",
              height: "auto",
              lineHeight: 1.3,
              px: 1,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            Scan Again
          </Button>
          <Button
            color="inherit"
            variant="contained"
            onClick={handleClose}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: 2,
              minHeight: "44px",
              height: "auto",
              lineHeight: 1.3,
              px: 1,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              bgcolor: "#cbd5e1",
              "&:hover": { bgcolor: "#94a3b8" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* ────────────── EWO Details Modal ───────────────────────── */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="ewo-details-title"
        open={isOpenDetailScreen}
      >
        {/* Header – Blue background with icon and EWO No */}
        <Box
          sx={{
            backgroundColor: "#1976d2",
            px: { xs: 2, sm: 3 },
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
              flex: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                p: 1,
                borderRadius: 2,
                display: "flex",
                flexShrink: 0,
              }}
            >
              <DescriptionIcon sx={{ color: "white" }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: 600, whiteSpace: "nowrap" }}
              >
                EWO Details
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                EWO No: {responseBody?.EwoNo || "N/A"}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: "white", flexShrink: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Status badge – yellow with checkmark */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: responseBody?.StatusBckcolor || "#fef08a",
                color: responseBody?.StatusTxtcolor || "#854d0e",
                border: "1px solid",
                borderColor: responseBody?.StatusBckcolor || "#fde68a",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                {responseBody?.EwoStatus || "Forwarded for Costing"}
              </Typography>
            </Box>
          </Box>

          {/* Financial Summary – two cards */}
          <Box
            sx={{
              background: "#f8fafc",
              borderRadius: 3,
              p: 2.5,
              mb: 3,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                mb: 2,
              }}
            >
              FINANCIAL SUMMARY
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    p: { xs: 1, sm: 1.5 },
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    textAlign: "center",
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Estimated Amount
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {responseBody?.EstimatedAmount || "0.00"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    p: { xs: 1, sm: 1.5 },
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    textAlign: "center",
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Billed Amount
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: "#059669",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {responseBody?.BilledAmount || "0.00"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Personnel */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                mb: 1.5,
              }}
            >
              PERSONNEL
            </Typography>
            {[
              {
                label: "Authorized By",
                value:
                  responseBody?.AuthorizeBy ||
                  responseBody?.AuthorizePerson ||
                  "N/A",
              },
              {
                label: "Approved By",
                value: responseBody?.ApprovedBy || "N/A",
              },
              {
                label: "Evaluated By",
                value: responseBody?.EvaluationBy || "N/A",
              },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                  borderBottom: index < 2 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ textAlign: "right" }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Divider with RECEIPT DETAILS */}
          <Box sx={{ position: "relative", my: 3 }}>
            <Divider sx={{ borderStyle: "dashed", borderColor: "#e2e8f0" }} />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "white",
                px: 2,
                color: "#94a3b8",
                textTransform: "uppercase",
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              RECEIPT DETAILS
            </Typography>
          </Box>

          {/* Receiver info – blue box */}
          <Box
            sx={{
              bgcolor: "#eff6ff",
              borderRadius: 3,
              p: 2,
              mb: 3,
              border: "1px solid #bfdbfe",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
              <Box
                sx={{
                  bgcolor: "#dbeafe",
                  p: 1,
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                <Person sx={{ color: "#2563eb", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#2563eb", fontWeight: 500 }}>
                  Received By
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {data?.[0]?.ReportName || "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: "white", borderRadius: 2, px: 2, py: 1.5 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Service Number
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontFamily: "monospace" }}
              >
                {data?.[0]?.ServiceNo || "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* Issued By */}
          <FormControl fullWidth sx={{ mb: 2.5 }}>
            <Autocomplete
              options={employees || []}
              getOptionLabel={(option) =>
                `${option.EmpName} (${option.ServiceNo})`
              }
              value={
                employees?.find((emp) => emp.ServiceNo === serviceNo) || null
              }
              onChange={(event, newValue) => {
                setIssuedBy(newValue ? newValue.EmpName : "");
                setServiceNo(newValue ? newValue.ServiceNo : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Issued By"
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography fontWeight={500}>{option.EmpName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.ServiceNo}
                    </Typography>
                  </Box>
                </li>
              )}
              disabled={employeeLoading}
              loading={employeeLoading}
              noOptionsText={employeeLoading ? "Loading..." : "No employees found"}
              disablePortal
            />
          </FormControl>

          {/* Remarks */}
          <TextField
            label="Remarks"
            fullWidth
            multiline
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />

          {/* Issued Date */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Issued Date"
              value={issuedDate}
              onChange={(newValue) => setIssuedDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </DialogContent>

        {/* Footer actions – Close on left, Send Doc on right */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            bgcolor: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "stretch",
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleClose}
            fullWidth
            sx={{
              borderRadius: 2,
              height: "48px",
              minHeight: "48px",
              px: 2,
              textTransform: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
              flexDirection: "row",
              borderColor: "#cbd5e1",
              color: "#475569",
              "& .MuiButton-startIcon": { marginRight: 0.75 },
              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Close
          </Button>
          {isButtonVisible && (
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendDoc}
              fullWidth
              sx={{
                borderRadius: 2,
                height: "48px",
                minHeight: "48px",
                px: 2,
                textTransform: "none",
                fontWeight: 600,
                whiteSpace: "nowrap",
                flexDirection: "row",
                backgroundColor: "#1976d2",
                boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
                "& .MuiButton-endIcon": { marginLeft: 0.75 },
                "&:hover": {
                  backgroundColor: "#1565c0",
                  boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
                },
              }}
            >
              Send Doc
            </Button>
          )}
        </Box>
      </BootstrapDialog>

      {/* ────────────── Reservation Action Modal ────────────────── */}
      <BootstrapDialog
        onClose={handleCloseReservationModal}
        open={openReservationModal}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            {reservationAction === "checkin" ? (
              <ArrowForward sx={{ color: "#4caf50", flexShrink: 0 }} />
            ) : (
              <ArrowBack sx={{ color: "#f44336", flexShrink: 0 }} />
            )}
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              {reservationAction === "checkin" ? "Check In" : "Check Out"} – Reservation
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleCloseReservationModal}
            sx={{ color: (theme) => theme.palette.grey[500], flexShrink: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
          {selectedReservation && (
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {/* Reservation Summary Card */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      reservationAction === "checkin"
                        ? "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
                        : "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                    borderRadius: 3,
                    border:
                      reservationAction === "checkin"
                        ? "1px solid #a5d6a7"
                        : "1px solid #ef9a9a",
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                        <Hotel
                          sx={{
                            fontSize: { xs: 30, sm: 40 },
                            color: reservationAction === "checkin" ? "#388e3c" : "#d32f2f",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, wordBreak: "break-word" }}
                        >
                          Reservation #{selectedReservation.Res_no}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: reservationAction === "checkin" ? "#4caf50" : "#f44336",
                          color: "white",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "20px",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {reservationAction === "checkin" ? "CHECK IN" : "CHECK OUT"}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
                          Service No
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ wordBreak: "break-word" }}>
                          {selectedReservation.Res_Service_no || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
                          Bungalow
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ wordBreak: "break-word" }}>
                          {selectedReservation.Res_Bang_Id === "1"
                            ? "Main Bungalow"
                            : selectedReservation.Res_Bang_Id === "2"
                            ? "Lower Garden Suite"
                            : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
                          Check-in Date
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedReservation.Res_Check_In
                            ? new Date(selectedReservation.Res_Check_In).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
                          Check-out Date
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedReservation.Res_Check_Out
                            ? new Date(selectedReservation.Res_Check_Out).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
                          Adults
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedReservation.Res_AdultCount || "0"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
                          Children
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedReservation.Res_ChildCount || "0"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Current Date Display */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    bgcolor: "#e3f2fd",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday sx={{ color: "#1976d2", fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={600}>
                      {reservationAction === "checkin" ? "Check-in Date" : "Check-out Date"}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={700} color="primary" sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }}>
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              </Grid>

              {reservationAction === "checkout" && (
                <Grid item xs={12}>
                  <TextField
                    label="Caret/Feedback Remarks"
                    fullWidth
                    multiline
                    rows={2}
                    value={reservationRemarks}
                    onChange={(e) => setReservationRemarks(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: 2, display: "flex", flexDirection: "row", gap: 1.5 }}
        >
          <Button
            variant="outlined"
            onClick={handleCloseReservationModal}
            disabled={processing}
            fullWidth
            sx={{ textTransform: "none", borderRadius: 2, height: "44px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmReservationAction}
            disabled={processing}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: 2,
              height: "44px",
              bgcolor: reservationAction === "checkin" ? "#4caf50" : "#f44336",
              "&:hover": {
                bgcolor: reservationAction === "checkin" ? "#388e3c" : "#d32f2f",
              },
              "&.Mui-disabled": {
                bgcolor: reservationAction === "checkin" ? "#a5d6a7" : "#ef9a9a",
              },
            }}
          >
            {processing
              ? "Processing…"
              : reservationAction === "checkin"
              ? "Confirm Check In"
              : "Confirm Check Out"}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* ────────────── Multiple Reservations List ──────────────── */}
      <BootstrapDialog
        onClose={handleCloseReservationListModal}
        open={openReservationListModal}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <Hotel sx={{ color: "#2196f3", flexShrink: 0 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
              Select Reservation
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleCloseReservationListModal}
            sx={{ color: (theme) => theme.palette.grey[500], flexShrink: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Multiple reservations found for today. Please select one:
          </Typography>

          <Grid container spacing={1.5}>
            {filteredReservations.map((res, index) => (
              <Grid item xs={12} key={res.Res_no || index}>
                <Card
                  onClick={() => handleSelectReservation(res)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: "2px solid",
                    borderColor: res.action === "checkin" ? "#c8e6c9" : "#ffcdd2",
                    "&:hover": {
                      boxShadow: 3,
                      borderColor: res.action === "checkin" ? "#4caf50" : "#f44336",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem" } }}>
                          Reservation #{res.Res_no}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Service No: {res.Res_Service_no || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: res.action === "checkin" ? "#4caf50" : "#f44336",
                          color: "white",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "20px",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {res.action === "checkin" ? (
                          <>
                            <ArrowForward sx={{ fontSize: 14 }} /> Check In
                          </>
                        ) : (
                          <>
                            <ArrowBack sx={{ fontSize: 14 }} /> Check Out
                          </>
                        )}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <EventAvailable sx={{ color: "#4caf50", fontSize: 16, flexShrink: 0 }} />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Check-in
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {res.Res_Check_In
                                ? new Date(res.Res_Check_In).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <EventBusy sx={{ color: "#f44336", fontSize: 16, flexShrink: 0 }} />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Check-out
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {res.Res_Check_Out
                                ? new Date(res.Res_Check_Out).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleCloseReservationListModal}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: 2,
              height: "44px",
              bgcolor: "#cbd5e1",
            }}
          >
            Close Menu
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* ────────────── QR Code Details Modal (asset / device scan) ────────────────── */}
      <BootstrapDialog
        onClose={handleCloseDetailsModal}
        open={openDetailsModal}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            CDPLC QR
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDetailsModal}
            sx={{ color: (theme) => theme.palette.grey[500], flexShrink: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Grid container spacing={1.5}>
            {/* QR Code Details */}
            <Grid item xs={12}>
              <Card
                sx={{
                  border: "1px solid #b1a9a9",
                  borderRadius: 4,
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.125rem" }, minWidth: 0 }}>
                      QR Code Details
                    </Typography>

                    {/* Device icon based on QR code letter */}
                    <Box sx={{ flexShrink: 0, display: "flex" }}>
                      {qrCode?.includes("S") && <Monitor sx={{ fontSize: { xs: 36, sm: 50 } }} />}
                      {qrCode?.includes("K") && <Keyboard sx={{ fontSize: { xs: 36, sm: 50 } }} />}
                      {qrCode?.includes("M") && <Mouse sx={{ fontSize: { xs: 36, sm: 50 } }} />}
                      {qrCode?.includes("L") && <LaptopMac sx={{ fontSize: { xs: 36, sm: 50 } }} />}
                      {qrCode?.includes("U") && <BatteryChargingFull sx={{ fontSize: { xs: 36, sm: 50 } }} />}
                      {qrCode?.includes("P") && <DesktopWindows sx={{ fontSize: { xs: 36, sm: 50 } }} />}
                      {qrCode?.includes("O") && <Memory sx={{ fontSize: { xs: 36, sm: 50 } }} />}
                      {qrCode?.includes("C") && <DesktopWindows sx={{ fontSize: { xs: 36, sm: 50 } }} />}
                    </Box>
                  </Box>

                  {(() => {
                    let deviceData = {
                      Code: "N/A",
                      Sno: "N/A",
                      Make: "N/A",
                      Device: "N/A",
                      Model: "N/A",
                      Status: "N/A",
                    };

                    if (qrCode?.includes("S")) {
                      deviceData = {
                        Device: "Screen",
                        Code: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Code,
                        Sno: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Sno,
                        Make: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Make,
                        Model: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Model,
                        Status: qrDetails?.ICT_ScreenModels?.[0]?.Mon_Status,
                      };
                    } else if (qrCode?.includes("K")) {
                      deviceData = {
                        Device: "Keyboard",
                        Code: qrDetails?.Key_Code,
                        Sno: qrDetails?.Key_Sno,
                        Make: qrDetails?.Key_Make,
                        Model: qrDetails?.Key_Model,
                        Status: qrDetails?.Key_Status,
                      };
                    } else if (qrCode?.includes("M")) {
                      deviceData = {
                        Device: "Mouse",
                        Code: qrDetails?.Mou_Code,
                        Make: qrDetails?.Mou_Make,
                        Sno: qrDetails?.Mou_Sno,
                        Model: qrDetails?.Mou_Model,
                        Status: qrDetails?.Mou_Status,
                      };
                    } else if (qrCode?.includes("L")) {
                      deviceData = {
                        Device: "Laptop",
                        Code: qrDetails?.Lap_Code,
                        Sno: qrDetails?.Lap_Sno,
                        Make: qrDetails?.Lap_Make,
                        Model: qrDetails?.Lap_Model,
                        Status: qrDetails?.Lap_Status,
                      };
                    } else if (qrCode?.includes("P")) {
                      deviceData = {
                        Device: "Computer",
                        Code: qrDetails?.Com_Code,
                        Sno: qrDetails?.Mac_Sno,
                        Make: qrDetails?.Mac_Make,
                        Model: qrDetails?.Mac_Model,
                        Status: qrDetails?.Mac_Status,
                      };
                    } else if (qrCode?.includes("C")) {
                      deviceData = {
                        Device: "Machine",
                        Code: qrDetails?.Mac_Code,
                        Sno: qrDetails?.Mac_Sno,
                        Make: qrDetails?.Mac_Make,
                        Model: qrDetails?.Mac_Model,
                        Status: qrDetails?.Mac_Status,
                      };
                    } else if (qrCode?.includes("U")) {
                      deviceData = {
                        Device: "UPS",
                        Code: qrDetails?.Ups_Code,
                        Sno: qrDetails?.Ups_Sno,
                        Make: qrDetails?.Ups_Make,
                        Model: qrDetails?.Ups_Model,
                        Status: qrDetails?.Ups_Status,
                      };
                    }

                    const rows = [
                      ["QR Code", deviceData.Code],
                      ["Serial No", deviceData.Sno],
                      ["Device", deviceData.Device],
                      ["Make", deviceData.Make],
                      ["Model", deviceData.Model],
                      [
                        "Status",
                        deviceData.Status === "A"
                          ? "Active"
                          : deviceData.Status === "I"
                          ? "Inactive"
                          : deviceData.Status === "D"
                          ? "Disposable"
                          : "N/A",
                      ],
                    ];

                    return (
                      <Grid container spacing={1.25}>
                        {rows.map(([label, value]) => (
                          <React.Fragment key={label}>
                            <Grid item xs={5} sm={6}>
                              <Typography variant="body2" fontWeight="bold">
                                {label}:
                              </Typography>
                            </Grid>
                            <Grid item xs={7} sm={6}>
                              <Typography
                                variant="body2"
                                sx={{ wordBreak: "break-word" }}
                              >
                                {value || "N/A"}
                              </Typography>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </Grid>
                    );
                  })()}
                </CardContent>
              </Card>
            </Grid>

            {/* Associated User Details */}
            <Grid item xs={12}>
              <Card
                sx={{
                  border: "1px solid #b1a9a9",
                  borderRadius: 4,
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.125rem" }, minWidth: 0 }}>
                      Associated User Details
                    </Typography>
                    <Person sx={{ fontSize: { xs: 36, sm: 50 }, flexShrink: 0 }} />
                  </Box>

                  <Grid container spacing={1.25}>
                    {[
                      ["Service No", qrDetails?.Service_No],
                      ["Name", qrDetails?.Emp_Name],
                      ["Computer Name", qrDetails?.Com_Name],
                      ["Email Address", qrDetails?.Emp_Email],
                      ["Extension", qrDetails?.Emp_Exte],
                      ["Location Code", qrDetails?.Com_Loc],
                      ["Location Name", qrDetails?.Com_LocName],
                      [
                        "Status",
                        qrDetails?.Status === "A"
                          ? "Active"
                          : qrDetails?.Status === "I"
                          ? "Inactive"
                          : qrDetails?.Status === "D"
                          ? "Disposable"
                          : "N/A",
                      ],
                    ].map(([label, value]) => (
                      <React.Fragment key={label}>
                        <Grid item xs={5} sm={6}>
                          <Typography variant="body2" fontWeight="bold">
                            {label}:
                          </Typography>
                        </Grid>
                        <Grid item xs={7} sm={6}>
                          <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                            {value || "N/A"}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Other Associated Devices */}
            <Grid item xs={12}>
              <Card
                sx={{
                  border: "1px solid #b1a9a9",
                  borderRadius: 4,
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.125rem" }, mb: 2 }}>
                    Other Associated Devices
                  </Typography>

                  {[
                    { title: "Laptop", prefix: "Lap", icon: <Laptop /> },
                    { title: "Machine", prefix: "Mac", icon: <Memory /> },
                    { title: "Keyboard", prefix: "Key", icon: <Keyboard /> },
                    { title: "Mouse", prefix: "Mou", icon: <Mouse /> },
                  ].map((device, index) => {
                    const deviceCode = qrDetails?.[`${device.prefix}_Code`] || "N/A";
                    if (deviceCode === "N/A") return null;

                    return (
                      <Box
                        key={index}
                        sx={{
                          border: "1px solid #e2e8f0",
                          p: { xs: 1.5, sm: 2 },
                          mb: 1.5,
                          borderRadius: 3,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {device.title}
                          </Typography>
                          {device.icon}
                        </Box>
                        <Grid container spacing={1.25}>
                          {[
                            [`${device.title} Code`, deviceCode],
                            [`${device.title} Serial No`, qrDetails?.[`${device.prefix}_Sno`]],
                            [`${device.title} Make`, qrDetails?.[`${device.prefix}_Make`]],
                            [`${device.title} Model`, qrDetails?.[`${device.prefix}_Model`]],
                            [
                              `${device.title} Status`,
                              qrDetails?.[`${device.prefix}_Status`] === "A"
                                ? "Active"
                                : qrDetails?.[`${device.prefix}_Status`] === "I"
                                ? "Inactive"
                                : qrDetails?.[`${device.prefix}_Status`] === "D"
                                ? "Disposable"
                                : "N/A",
                            ],
                          ].map(([label, value]) => (
                            <React.Fragment key={label}>
                              <Grid item xs={5} sm={6}>
                                <Typography variant="body2" fontWeight="bold">
                                  {label}:
                                </Typography>
                              </Grid>
                              <Grid item xs={7} sm={6}>
                                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                  {value || "N/A"}
                                </Typography>
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={handleCloseDetailsModal}
            fullWidth
            sx={{ textTransform: "none", borderRadius: 2, height: "44px" }}
          >
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}