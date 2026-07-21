// import React, { useState, useEffect, useRef } from "react";
// import {
//   Calendar,
//   Search,
//   Filter,
//   FileText,
//   User,
//   Package,
//   Building,
//   Phone,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Users,
//   Truck,
//   Loader2,
//   ChevronDown,
//   ChevronUp,
//   Download,
//   Printer,
//   Eye,
//   EyeOff,
//   Copy,
//   Check,
//   Edit,
//   X,
//   Save,
// } from "lucide-react";

// import {
//   InjectStyles,
//   getBadgeClasses,
//   CHASER_OPTIONS,
//   END_USER_OPTIONS,
//   STATUS_OPTIONS,
//   SearchableSelect,
//   Field,
//   formatDateForApi,
//   normalizeStatusFromApi,
//   mapStatusForApi,
// } from "./Shared";

// export default function ExecutivePage() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [selectedAdmin, setSelectedAdmin] = useState("");
//   const [selectedChaser, setSelectedChaser] = useState("");
//   const [expandedItems, setExpandedItems] = useState(new Set());
//   const [toast, setToast] = useState(null);
//   const [viewMode, setViewMode] = useState("list");

//   // Chaser Update Modal States
//   const [showChaserModal, setShowChaserModal] = useState(false);
//   const [chaserItem, setChaserItem] = useState(null);
//   const [selectedChaserForUpdate, setSelectedChaserForUpdate] = useState("");
//   const [chaserUpdateLoading, setChaserUpdateLoading] = useState(false);

//   const dataRef = useRef([]);

//   useEffect(() => {
//     dataRef.current = data;
//   }, [data]);

//   const fetchExecutiveData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const raw = sessionStorage.getItem("token");
//       let authToken = "";
//       if (raw) {
//         try {
//           const parsed = JSON.parse(raw);
//           authToken = parsed || raw;
//         } catch (err) {
//           authToken = raw;
//         }
//       }

//       const response = await fetch(
//         `http://localhost:51976/DailyCollect/GetExecutiveDailyCollect?p_mdd_month=${selectedDate}`,
//         {
//           method: "GET",
//           headers: {
//             "auth-key": ` ${authToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Session expired. Please login again.");
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.StatusCode === 200 && result.ResultSet) {
//         const mappedData = result.ResultSet.map((item) => ({
//           ...item,
//           DATE: new Date(item.DATE),
//           formattedDate: new Date(item.DATE).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           }),
//           status: normalizeStatusFromApi(item.STATUS),
//           isCompleted:
//             item.STATUS?.toLowerCase() === "c" ||
//             item.STATUS?.toLowerCase() === "collected",
//           chaserRemark: item.CHASER_REMARK || "",
//           collectedBy: item.INVCOLLECTED_BY || "",
//           handleBy: item.HANDLE_BY || "",
//           mocNo: item.MOC_NO || "",
//           poNo: item.PO_NO || "",
//           pcNo: item.PC_NO || "",
//           supplierName: item.Sup_Name || "",
//           supplierAddress: item.Sup_Address || "",
//           supplierContact: item.Sup_Contact || "",
//           description: item.DESCRIPTION || "",
//           serialNo: item.SERIAL_NO || "",
//           jcat: item.JCAT || "",
//           jmain: item.JMAIN || "",
//           endUserBy: item.End_User_By || "",
//           supplierCode: item.SUPPLIER_CODE || "",
//         }));
//         setData(mappedData);
//         showToast(`Loaded ${mappedData.length} records`, "success");
//       } else {
//         setError("No data found for the selected date");
//         setData([]);
//       }
//     } catch (err) {
//       setError(err.message || "An error occurred while fetching data");
//       console.error("Error fetching executive data:", err);
//       showToast(err.message || "Failed to load data", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update Chaser function
//   const handleChaserUpdate = async () => {
//     if (!chaserItem || !selectedChaserForUpdate) return;

//     setChaserUpdateLoading(true);
//     try {
//       const raw = sessionStorage.getItem("token");
//       let authToken = "";
//       if (raw) {
//         try {
//           const parsed = JSON.parse(raw);
//           authToken = parsed || raw;
//         } catch (err) {
//           authToken = raw;
//         }
//       }

//       // Format date for API
//       const formattedDate = formatDateForApi(selectedDate);

//       // Find the selected chaser details
//       const selectedChaserObj = CHASER_OPTIONS.find(
//         (o) => o.serviceNo === selectedChaserForUpdate
//       );

//       const updateData = {
//         P_MDD_DATE: formattedDate,
//         P_MDD_SERIAL_NO: parseInt(chaserItem.serialNo),
//         P_MDD_HANDLE_BY: chaserItem.HANDLE_BY || "",
//         P_MDD_REQUEST_BY: selectedChaserForUpdate,
//         P_MDD_MOC_NO: chaserItem.MOC_NO || "",
//         P_MDD_JCAT: chaserItem.JCAT || "",
//         P_MDD_JMAIN: chaserItem.JMAIN || "",
//         P_MDD_DESCRIPTION: chaserItem.DESCRIPTION || "",
//         P_MDD_PO_NO: chaserItem.PO_NO || "",
//         P_MDD_SUPPLIER_CODE: chaserItem.SUPPLIER_CODE || "",
//         P_MDD_CHASER_REMARK: chaserItem.CHASER_REMARK || "",
//         P_MDD_STATUS: mapStatusForApi(chaserItem.STATUS || "Pending"),
//         P_MDD_PC_NO: chaserItem.PC_NO || "",
//         P_MDD_INVCOLLECTED_BY: selectedChaserForUpdate,
//       };

//       console.log("Updating chaser with data:", updateData);

//       const response = await fetch(
//         `http://localhost:51976/DailyCollect/UpdateDailyCollect`,
//         {
//           method: "POST",
//           headers: {
//             "auth-key": ` ${authToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updateData),
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Session expired. Please login again.");
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.StatusCode === 200) {
//         const chaserName = selectedChaserObj ? selectedChaserObj.name : selectedChaserForUpdate;
//         showToast(`Chaser updated successfully to ${chaserName}!`, "success");
//         setShowChaserModal(false);
//         setSelectedChaserForUpdate("");
//         // Refresh data
//         await fetchExecutiveData();
//       } else {
//         throw new Error(result.Message || "Failed to update chaser");
//       }
//     } catch (err) {
//       console.error("Error updating chaser:", err);
//       showToast(err.message || "Failed to update chaser", "error");
//     } finally {
//       setChaserUpdateLoading(false);
//     }
//   };

//   // Open chaser modal with item data
//   const openChaserModal = (item) => {
//     setChaserItem(item);
//     // Pre-select current chaser if exists
//     setSelectedChaserForUpdate(item.INVCOLLECTED_BY || item.End_User_By || "");
//     setShowChaserModal(true);
//   };

//   useEffect(() => {
//     fetchExecutiveData();
//   }, [selectedDate]);

//   // Filter data
//   const filteredData = data.filter((item) => {
//     const searchLower = searchTerm.toLowerCase();
//     const matchesSearch =
//       !searchTerm ||
//       item.MOC_NO?.toLowerCase().includes(searchLower) ||
//       item.PO_NO?.toLowerCase().includes(searchLower) ||
//       item.Sup_Name?.toLowerCase().includes(searchLower) ||
//       item.DESCRIPTION?.toLowerCase().includes(searchLower) ||
//       item.PC_NO?.toLowerCase().includes(searchLower);

//     const matchesStatus =
//       filterStatus === "all" ||
//       item.STATUS?.toLowerCase() === filterStatus.toLowerCase();

//     const matchesAdmin =
//       !selectedAdmin ||
//       item.HANDLE_BY === selectedAdmin ||
//       item.HANDLE_BY?.includes(selectedAdmin);

//     const matchesChaser =
//       !selectedChaser ||
//       item.INVCOLLECTED_BY === selectedChaser ||
//       item.INVCOLLECTED_BY?.includes(selectedChaser);

//     return matchesSearch && matchesStatus && matchesAdmin && matchesChaser;
//   });

//   // Statistics
//   const totalItems = filteredData.length;
//   const completedItems = filteredData.filter(
//     (i) =>
//       i.STATUS?.toLowerCase() === "collected" ||
//       i.STATUS?.toLowerCase() === "completed"
//   ).length;
//   const pendingItems = filteredData.filter(
//     (i) =>
//       i.STATUS?.toLowerCase() !== "collected" &&
//       i.STATUS?.toLowerCase() !== "completed"
//   ).length;

//   // ---- Status visual config (icon, gradient badge, soft pill, accent bar) ----
//   const getStatusIcon = (status) => {
//     const statusMap = {
//       collected: {
//         icon: CheckCircle,
//         pillBg: "#dcfce7",
//         pillText: "#15803d",
//         badgeGrad: "linear-gradient(135deg, #34d399, #059669)",
//         glow: "rgba(16,185,129,0.35)",
//         accent: "#10b981",
//       },
//       completed: {
//         icon: CheckCircle,
//         pillBg: "#dcfce7",
//         pillText: "#15803d",
//         badgeGrad: "linear-gradient(135deg, #34d399, #059669)",
//         glow: "rgba(16,185,129,0.35)",
//         accent: "#10b981",
//       },
//       pending: {
//         icon: Clock,
//         pillBg: "#fef3c7",
//         pillText: "#b45309",
//         badgeGrad: "linear-gradient(135deg, #fbbf24, #d97706)",
//         glow: "rgba(217,119,6,0.32)",
//         accent: "#f59e0b",
//       },
//       rejected: {
//         icon: AlertCircle,
//         pillBg: "#fee2e2",
//         pillText: "#dc2626",
//         badgeGrad: "linear-gradient(135deg, #f87171, #dc2626)",
//         glow: "rgba(220,38,38,0.32)",
//         accent: "#ef4444",
//       },
//       "not available": {
//         icon: AlertCircle,
//         pillBg: "#fee2e2",
//         pillText: "#dc2626",
//         badgeGrad: "linear-gradient(135deg, #f87171, #dc2626)",
//         glow: "rgba(220,38,38,0.32)",
//         accent: "#ef4444",
//       },
//       partial: {
//         icon: Loader2,
//         pillBg: "#dbeafe",
//         pillText: "#2563eb",
//         badgeGrad: "linear-gradient(135deg, #60a5fa, #2563eb)",
//         glow: "rgba(37,99,235,0.32)",
//         accent: "#3b82f6",
//       },
//     };
//     const normalized = status?.toLowerCase() || "pending";
//     return statusMap[normalized] || statusMap.pending;
//   };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const toggleExpand = (id) => {
//     setExpandedItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) newSet.delete(id);
//       else newSet.add(id);
//       return newSet;
//     });
//   };

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleExport = () => {
//     if (filteredData.length === 0) {
//       showToast("No data to export", "error");
//       return;
//     }

//     const headers = [
//       "SERIAL_NO",
//       "MOC_NO",
//       "PO_NO",
//       "PC_NO",
//       "DESCRIPTION",
//       "STATUS",
//       "SUPPLIER",
//       "HANDLE_BY",
//       "CHASER",
//       "DATE",
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...filteredData.map((item) =>
//         [
//           item.SERIAL_NO || "",
//           item.MOC_NO || "",
//           item.PO_NO || "",
//           item.PC_NO || "",
//           `"${(item.DESCRIPTION || "").replace(/"/g, '""')}"`,
//           item.STATUS || "",
//           `"${(item.Sup_Name || "").replace(/"/g, '""')}"`,
//           item.HANDLE_BY || "",
//           item.INVCOLLECTED_BY || "",
//           formatDate(item.DATE) || "",
//         ].join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `executive_data_${selectedDate}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//     showToast("Data exported successfully!");
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const formatDisplayDate = (date) => {
//     try {
//       const d = new Date(date + "T00:00:00");
//       return d.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//     } catch {
//       return date;
//     }
//   };

//   // Get display name for chaser
//   const getChaserDisplayName = (serviceNo) => {
//     if (!serviceNo) return "";
//     const chaser = CHASER_OPTIONS.find((o) => o.serviceNo === serviceNo);
//     return chaser ? `${chaser.serviceNo} - ${chaser.name}` : serviceNo;
//   };

//   return (
//     <div
//       className="cdp-dot-bg"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         overflow: "hidden",
//         padding: "20px",
//       }}
//     >
//       <InjectStyles />

//       {/* Toast Notification */}
//       {toast && (
//         <div
//           className="cdp-toast-in"
//           style={{
//             position: "fixed",
//             top: 16,
//             right: 16,
//             zIndex: 1000,
//             background:
//               toast.type === "error"
//                 ? "linear-gradient(135deg, #ef4444, #dc2626)"
//                 : "linear-gradient(135deg, #10b981, #059669)",
//             color: "#fff",
//             padding: "12px 20px",
//             borderRadius: 12,
//             boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
//             fontSize: 14,
//             fontWeight: 600,
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//           }}
//         >
//           {toast.type === "error" ? (
//             <AlertCircle size={18} />
//           ) : (
//             <CheckCircle size={18} />
//           )}
//           {toast.msg}
//         </div>
//       )}

//       {/* Chaser Update Modal */}
//       {showChaserModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.5)",
//             backdropFilter: "blur(4px)",
//             zIndex: 999,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "20px",
//           }}
//           onClick={() => !chaserUpdateLoading && setShowChaserModal(false)}
//         >
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 20,
//               padding: "28px 32px",
//               maxWidth: 480,
//               width: "100%",
//               maxHeight: "90vh",
//               overflowY: "auto",
//               boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//               animation: "cdp-popIn 0.3s ease",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 20,
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <div
//                   style={{
//                     width: 36,
//                     height: 36,
//                     borderRadius: 10,
//                     background: "linear-gradient(135deg, #6366f1, #4f46e5)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#fff",
//                   }}
//                 >
//                   <Truck size={18} />
//                 </div>
//                 <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
//                   Assign Chaser
//                 </h2>
//               </div>
//               <button
//                 onClick={() => !chaserUpdateLoading && setShowChaserModal(false)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   padding: 4,
//                   color: "#94a3b8",
//                   transition: "color 0.2s ease",
//                 }}
//                 onMouseEnter={(e) => (e.target.style.color = "#475569")}
//                 onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Item details (read-only) */}
//             {chaserItem && (
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   borderRadius: 12,
//                   padding: "14px 16px",
//                   marginBottom: 20,
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: "6px 16px",
//                     fontSize: 13,
//                   }}
//                 >
                 
                  
//                   <div style={{ gridColumn: "span 2" }}>
//                     <span style={{ color: "#94a3b8", fontSize: 14 }}>
//                       PO No:
//                     </span>
//                     <span style={{ marginLeft: 4, color: "#334155" }}>
//                       {chaserItem.PO_NO || "-"}
//                     </span>
//                   </div>
//                   <div>
//                     <span style={{ color: "#94a3b8", fontSize: 14 }}>
//                       MOC No:
//                     </span>
//                     <span style={{ fontWeight: 600, marginLeft: 4, color: "#0f172a" }}>
//                       {chaserItem.MOC_NO || "-"}
//                     </span>
//                   </div>
//                   <div style={{ gridColumn: "span 2" }}>
//                     <span style={{ color: "#94a3b8", fontSize: 14 }}>
//                       Description:
//                     </span>
//                     <span style={{ marginLeft: 4, color: "#334155" }}>
//                       {chaserItem.DESCRIPTION || "-"}
//                     </span>
//                   </div>
//                    <div style={{ gridColumn: "span 2" }}>
//                     <span style={{ color: "#94a3b8", fontSize: 14 }}>
//                       Supplier:
//                     </span>
//                     <span style={{ marginLeft: 4, color: "#334155" }}>
//                       {chaserItem.Sup_Name || "-"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               <div>
//                 <label
//                   style={{
//                     fontSize: 13,
//                     fontWeight: 600,
//                     color: "#334155",
//                     display: "block",
//                     marginBottom: 8,
//                   }}
//                 >
//                   Select Chaser
//                 </label>

//                 {/* Chaser selection buttons */}
//                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                   {CHASER_OPTIONS.map((chaser) => (
//                     <button
//                       key={chaser.serviceNo}
//                       onClick={() => setSelectedChaserForUpdate(chaser.serviceNo)}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         padding: "12px 16px",
//                         borderRadius: 10,
//                         border: `2px solid ${
//                           selectedChaserForUpdate === chaser.serviceNo
//                             ? "#6366f1"
//                             : "#e2e8f0"
//                         }`,
//                         background:
//                           selectedChaserForUpdate === chaser.serviceNo
//                             ? "#eef2ff"
//                             : "#fff",
//                         cursor: "pointer",
//                         transition: "all 0.2s ease",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (selectedChaserForUpdate !== chaser.serviceNo) {
//                           e.currentTarget.style.borderColor = "#a5b4fc";
//                           e.currentTarget.style.background = "#f8fafc";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (selectedChaserForUpdate !== chaser.serviceNo) {
//                           e.currentTarget.style.borderColor = "#e2e8f0";
//                           e.currentTarget.style.background = "#fff";
//                         }
//                       }}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                         <div
//                           style={{
//                             width: 62,
//                             height: 32,
//                             borderRadius: "50%",
//                             background:
//                               selectedChaserForUpdate === chaser.serviceNo
//                                 ? "linear-gradient(135deg, #6366f1, #4f46e5)"
//                                 : "#3845f0",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             color:
//                               selectedChaserForUpdate === chaser.serviceNo
//                                 ? "#fff"
//                                 : "#f3f5f7",
//                             fontSize: 12,
//                             fontWeight: 700,
//                           }}
//                         >
//                           {chaser.serviceNo}
//                         </div>
//                         <div style={{ textAlign: "left" }}>
//                           <div
//                             style={{
//                               fontSize: 13,
//                               fontWeight: 600,
//                               color: "#0f172a",
//                             }}
//                           >
//                             {chaser.name}
//                           </div>
//                           <div
//                             style={{
//                               fontSize: 11,
//                               color: "#94a3b8",
//                             }}
//                           >
//                             Service No: {chaser.serviceNo}
//                           </div>
//                         </div>
//                       </div>
//                       {selectedChaserForUpdate === chaser.serviceNo && (
//                         <div
//                           style={{
//                             width: 20,
//                             height: 20,
//                             borderRadius: "50%",
//                             background: "#6366f1",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           <Check size={12} color="#fff" />
//                         </div>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div
//                 style={{
//                   display: "flex",
//                   gap: 10,
//                   marginTop: 8,
//                   justifyContent: "flex-end",
//                 }}
//               >
//                 <button
//                   onClick={() => !chaserUpdateLoading && setShowChaserModal(false)}
//                   style={{
//                     padding: "10px 20px",
//                     borderRadius: 10,
//                     border: "1.5px solid #e2e8f0",
//                     background: "#fff",
//                     fontSize: 13,
//                     fontWeight: 600,
//                     cursor: "pointer",
//                     color: "#64748b",
//                     transition: "all 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = "#f8fafc";
//                     e.currentTarget.style.borderColor = "#cbd5e1";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = "#fff";
//                     e.currentTarget.style.borderColor = "#e2e8f0";
//                   }}
//                   disabled={chaserUpdateLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleChaserUpdate}
//                   disabled={!selectedChaserForUpdate || chaserUpdateLoading}
//                   style={{
//                     padding: "10px 24px",
//                     borderRadius: 10,
//                     border: "none",
//                     background:
//                       !selectedChaserForUpdate || chaserUpdateLoading
//                         ? "#cbd5e1"
//                         : "linear-gradient(135deg, #6366f1, #4f46e5)",
//                     color: "#fff",
//                     fontSize: 13,
//                     fontWeight: 600,
//                     cursor: !selectedChaserForUpdate || chaserUpdateLoading ? "not-allowed" : "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     transition: "all 0.2s ease",
//                     boxShadow:
//                       !selectedChaserForUpdate || chaserUpdateLoading
//                         ? "none"
//                         : "0 4px 12px rgba(99, 102, 241, 0.35)",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (selectedChaserForUpdate && !chaserUpdateLoading) {
//                       e.currentTarget.style.transform = "translateY(-1px)";
//                       e.currentTarget.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.45)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (selectedChaserForUpdate && !chaserUpdateLoading) {
//                       e.currentTarget.style.transform = "translateY(0)";
//                       e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.35)";
//                     }
//                   }}
//                 >
//                   {chaserUpdateLoading ? (
//                     <>
//                       <Loader2 size={16} className="cdp-spin" />
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       <Check size={16} />
//                       Confirm 
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
//         {/* Header Section */}
//         <div
//           style={{
//             borderRadius: 16,
//             background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
//             padding: "16px 20px 20px",
//             marginBottom: 20,
//             boxShadow: "0 6px 18px rgba(124,58,237,0.25)",
//             color: "#ffffff",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//               marginBottom: 12,
//             }}
//           >
//             <div
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 12,
//                 background: "rgba(255,255,255,0.15)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Users size={20} />
//             </div>
//             <div>
//               <div style={{ fontSize: 18, fontWeight: 700 }}>
//                 Executive Dashboard
//               </div>
//               <div style={{ fontSize: 12, opacity: 0.85 }}>
//                 {formatDisplayDate(selectedDate)}
//               </div>
//             </div>
//           </div>

//           {/* Stats */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(3, 1fr)",
//               gap: 8,
//               marginTop: 12,
//             }}
//           >
//             <div
//               style={{
//                 background: "rgba(255,255,255,0.1)",
//                 borderRadius: 10,
//                 padding: "8px 12px",
//                 textAlign: "center",
//               }}
//             >
//               <div style={{ fontSize: 20, fontWeight: 700 }}>{totalItems}</div>
//               <div style={{ fontSize: 10, opacity: 0.8 }}>Total Items</div>
//             </div>
//             <div
//               style={{
//                 background: "rgba(255,255,255,0.1)",
//                 borderRadius: 10,
//                 padding: "8px 12px",
//                 textAlign: "center",
//               }}
//             >
//               <div style={{ fontSize: 20, fontWeight: 700, color: "#a7f3d0" }}>
//                 {completedItems}
//               </div>
//               <div style={{ fontSize: 10, opacity: 0.8 }}>Completed</div>
//             </div>
//             <div
//               style={{
//                 background: "rgba(255,255,255,0.1)",
//                 borderRadius: 10,
//                 padding: "8px 12px",
//                 textAlign: "center",
//               }}
//             >
//               <div style={{ fontSize: 20, fontWeight: 700, color: "#fcd34d" }}>
//                 {pendingItems}
//               </div>
//               <div style={{ fontSize: 10, opacity: 0.8 }}>Pending</div>
//             </div>
//           </div>

//           {/* Filters */}
//           <div
//             style={{
//               marginTop: 14,
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr",
//               gap: 8,
//             }}
//           >
//             <div>
//               <label
//                 style={{
//                   fontSize: 10,
//                   opacity: 0.8,
//                   display: "block",
//                   marginBottom: 4,
//                 }}
//               >
//                 <Calendar size={10} style={{ marginRight: 4 }} />
//                 Select Date
//               </label>
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 style={{
//                   width: "100%",
//                   background: "rgba(255,255,255,0.12)",
//                   border: "1px solid rgba(255,255,255,0.35)",
//                   borderRadius: 8,
//                   padding: "6px 10px",
//                   color: "#fff",
//                   fontSize: 12,
//                   outline: "none",
//                   cursor: "pointer",
//                 }}
//               />
//             </div>
//             <div>
//               <label
//                 style={{
//                   fontSize: 10,
//                   opacity: 0.8,
//                   display: "block",
//                   marginBottom: 4,
//                 }}
//               >
//                 <Filter size={10} style={{ marginRight: 4 }} />
//                 Status
//               </label>
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 style={{
//                   width: "100%",
//                   background: "rgba(255,255,255,0.12)",
//                   border: "1px solid rgba(255,255,255,0.35)",
//                   borderRadius: 8,
//                   padding: "6px 10px",
//                   color: "#fff",
//                   fontSize: 12,
//                   outline: "none",
//                 }}
//               >
//                 <option value="all" style={{ color: "#000" }}>
//                   All Status
//                 </option>
//                 <option value="collected" style={{ color: "#000" }}>
//                   Collected
//                 </option>
//                 <option value="pending" style={{ color: "#000" }}>
//                   Pending
//                 </option>
//                 <option value="not available" style={{ color: "#000" }}>
//                   Not Available
//                 </option>
//                 <option value="partial" style={{ color: "#000" }}>
//                   Partial
//                 </option>
//               </select>
//             </div>
//             <div>
//               <label
//                 style={{
//                   fontSize: 10,
//                   opacity: 0.8,
//                   display: "block",
//                   marginBottom: 4,
//                 }}
//               >
//                 <Search size={10} style={{ marginRight: 4 }} />
//                 Search
//               </label>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by MOC, PO, Supplier..."
//                 style={{
//                   width: "100%",
//                   background: "rgba(255,255,255,0.12)",
//                   border: "1px solid rgba(255,255,255,0.35)",
//                   borderRadius: 8,
//                   padding: "6px 10px",
//                   color: "#fff",
//                   fontSize: 12,
//                   outline: "none",
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* View Toggle */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 16,
//           }}
//         >
//           <div style={{ fontSize: 13, color: "#64748b" }}>
//             {filteredData.length} items found
//           </div>
//           <div style={{ display: "flex", gap: 6 }}>
//             <button
//               onClick={handleExport}
//               style={{
//                 padding: "6px 12px",
//                 borderRadius: 8,
//                 border: "1px solid #e2e8f0",
//                 background: "#fff",
//                 fontSize: 12,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 4,
//               }}
//             >
//               <Download size={14} />
//               Export
//             </button>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 20,
//               padding: "60px 24px",
//               textAlign: "center",
//               boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//             }}
//           >
//             <Loader2
//               size={40}
//               color="#7c3aed"
//               className="cdp-spin"
//               style={{ margin: "0 auto 16px" }}
//             />
//             <div style={{ fontSize: 14, color: "#64748b" }}>
//               Loading executive data...
//             </div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !loading && (
//           <div
//             style={{
//               background: "#fef2f2",
//               borderRadius: 20,
//               padding: "48px 24px",
//               textAlign: "center",
//               border: "1px solid #fecaca",
//             }}
//           >
//             <AlertCircle
//               size={40}
//               color="#ef4444"
//               style={{ margin: "0 auto 16px" }}
//             />
//             <div
//               style={{
//                 fontSize: 16,
//                 fontWeight: 600,
//                 color: "#991b1b",
//                 marginBottom: 8,
//               }}
//             >
//               Error Loading Data
//             </div>
//             <div style={{ fontSize: 14, color: "#dc2626", marginBottom: 16 }}>
//               {error}
//             </div>
//             <button
//               onClick={fetchExecutiveData}
//               style={{
//                 padding: "8px 24px",
//                 background: "#ef4444",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 8,
//                 cursor: "pointer",
//                 fontSize: 13,
//               }}
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* No Data */}
//         {!loading && !error && filteredData.length === 0 && (
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 20,
//               padding: "60px 24px",
//               textAlign: "center",
//               boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//             }}
//           >
//             <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
//             <div
//               style={{
//                 fontSize: 16,
//                 fontWeight: 600,
//                 color: "#475569",
//                 marginBottom: 8,
//               }}
//             >
//               No items found
//             </div>
//             <div style={{ fontSize: 13, color: "#94a3b8" }}>
//               Try adjusting your search or filters
//             </div>
//           </div>
//         )}

//         {/* Data List */}
//         {!loading && !error && filteredData.length > 0 && (
//           <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//             {filteredData.map((item) => {
//               const statusInfo = getStatusIcon(item.STATUS);
//               const StatusIcon = statusInfo.icon;
//               const isExpanded = expandedItems.has(item.SERIAL_NO);
//               const statusLabel = item.STATUS || "Pending";

//               return (
//                 <div
//                   key={item.SERIAL_NO}
//                   className="cdp-row-card"
//                   style={{
//                     background: "#fff",
//                     borderRadius: 16,
//                     boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
//                     border: "1px solid #eef1f6",
//                     borderLeft: `4px solid ${statusInfo.accent}`,
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Compact View */}
//                   <div
//                     onClick={() => toggleExpand(item.SERIAL_NO)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       gap: 14,
//                       padding: "14px 18px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 14,
//                         flex: 1,
//                         minWidth: 0,
//                       }}
//                     >
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 8,
//                             flexWrap: "wrap",
//                             marginBottom: 4,
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontWeight: 700,
//                               fontSize: 14.5,
//                               color: "#0f172a",
//                               letterSpacing: -0.1,
//                             }}
//                           >
//                             {item.MOC_NO}
//                           </span>

//                           {item.PO_NO && (
//                             <span className="cdp-chip">
//                               <FileText size={10} />
//                               {item.PO_NO}
//                             </span>
//                           )}

//                           {item.PC_NO && (
//                             <span className="cdp-chip">
//                               <Package size={10} />
//                               {item.PC_NO}
//                             </span>
//                           )}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: 12.5,
//                             color: "#475569",
//                             marginBottom: 3,
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {item.DESCRIPTION || "No description provided"}
//                         </div>

//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 12,
//                             fontSize: 12,
//                             color: "#94a3b8",
//                           }}
//                         >
//                           <span
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 4,
//                             }}
//                           >
//                             <Building size={11} />
//                             {item.Sup_Name || "Supplier not specified"}
//                           </span>
//                           {item.INVCOLLECTED_BY && (
//                             <span
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 4,
//                                 color: "#4338ca",
//                                 fontWeight: 500,
//                               }}
//                             >
//                               <Truck size={11} />
//                               {getChaserDisplayName(item.INVCOLLECTED_BY)}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 8,
//                         flexShrink: 0,
//                       }}
//                     >
//                       {/* Chaser Update Button */}
//                       <button
//                         className="cdp-chaser-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openChaserModal(item);
//                         }}
//                       >
//                         <Truck size={12} />
//                         Chaser
//                       </button>

//                       <div className="cdp-chevron">
//                         {isExpanded ? (
//                           <ChevronUp size={16} />
//                         ) : (
//                           <ChevronDown size={16} />
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Expanded View */}
//                   {isExpanded && (
//                     <div className="cdp-expand-panel">
//                       <div
//                         style={{
//                           display: "grid",
//                           gridTemplateColumns: "1fr 1fr",
//                           gap: "10px 20px",
//                           fontSize: 12.5,
//                           color: "#334155",
//                         }}
//                       >
//                         <div className="cdp-detail">
//                           <span className="cdp-detail-label">Admin</span>
//                           <span className="cdp-detail-value">{item.HANDLE_BY || "-"}</span>
//                         </div>
//                         <div className="cdp-detail">
//                           <span className="cdp-detail-label">Supplier</span>
//                           <span className="cdp-detail-value">{item.Sup_Name || "-"}</span>
//                         </div>
//                         <div className="cdp-detail" style={{ gridColumn: "span 2" }}>
//                           <span className="cdp-detail-label">Address</span>
//                           <span className="cdp-detail-value">{item.Sup_Address || "-"}</span>
//                         </div>
//                         <div className="cdp-detail">
//                           <span className="cdp-detail-label">Contact</span>
//                           <span className="cdp-detail-value">{item.Sup_Contact || "-"}</span>
//                         </div>
//                         <div className="cdp-detail">
//                           <span className="cdp-detail-label">JCAT</span>
//                           <span className="cdp-detail-value">{item.JCAT || "-"}</span>
//                         </div>
//                         <div className="cdp-detail">
//                           <span className="cdp-detail-label">JMAIN</span>
//                           <span className="cdp-detail-value">{item.JMAIN || "-"}</span>
//                         </div>
//                         <div className="cdp-detail" style={{ gridColumn: "span 2" }}>
//                           <span className="cdp-detail-label">End User</span>
//                           <span className="cdp-detail-value">{item.End_User_By || "-"}</span>
//                         </div>
//                         <div className="cdp-detail" style={{ gridColumn: "span 2" }}>
//                           <span className="cdp-detail-label">Supplier Code</span>
//                           <span className="cdp-detail-value">{item.SUPPLIER_CODE || "-"}</span>
//                         </div>

//                         {item.CHASER_REMARK && (
//                           <div
//                             style={{
//                               gridColumn: "span 2",
//                               background: "#f0f9ff",
//                               padding: "10px 14px",
//                               borderRadius: 10,
//                               border: "1px solid #bae6fd",
//                               marginTop: 2,
//                             }}
//                           >
//                             <strong style={{ color: "#0369a1" }}>Remark:</strong>
//                             <span style={{ color: "#0c4a6e", marginLeft: 6 }}>
//                               {item.CHASER_REMARK}
//                             </span>
//                           </div>
//                         )}

//                         {item.INVCOLLECTED_BY && (
//                           <div
//                             style={{
//                               gridColumn: "span 2",
//                               display: "inline-flex",
//                               alignItems: "center",
//                               gap: 6,
//                               color: "#4338ca",
//                               fontWeight: 600,
//                               marginTop: 2,
//                               background: "#eef2ff",
//                               padding: "6px 12px",
//                               borderRadius: 8,
//                             }}
//                           >
//                             <Truck size={13} />
//                             Chaser: {getChaserDisplayName(item.INVCOLLECTED_BY)}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Styles for animations */}
//       <style jsx>{`
//         .cdp-dot-bg {
//           background: #f8fafc;
//         }
//         .cdp-toast-in {
//           animation: slideInRight 0.3s ease;
//         }
//         .cdp-spin {
//           animation: spin 1s linear infinite;
//         }

//         /* ---- Row card polish ---- */
//         .cdp-row-card {
//           transition: transform 0.16s ease, box-shadow 0.16s ease,
//             border-color 0.16s ease;
//         }
//         .cdp-row-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09);
//           border-color: #e2e8f0;
//         }

//         .cdp-chip {
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//           font-size: 11px;
//           font-weight: 600;
//           color: #64748b;
//           background: #f1f5f9;
//           padding: 2px 9px;
//           border-radius: 6px;
//           white-space: nowrap;
//         }

//         /* Chaser Button */
//         .cdp-chaser-btn {
//           padding: 6px 13px;
//           border-radius: 8px;
//           border: 1.5px solid #c7d2fe;
//           background: #eef2ff;
//           color: #4338ca;
//           font-size: 11.5px;
//           font-weight: 700;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           transition: background 0.15s ease, color 0.15s ease,
//             box-shadow 0.15s ease, transform 0.15s ease;
//         }
//         .cdp-chaser-btn:hover {
//           background: linear-gradient(135deg, #6366f1, #4f46e5);
//           color: #fff;
//           border-color: transparent;
//           box-shadow: 0 6px 14px rgba(79, 70, 229, 0.32);
//           transform: translateY(-1px);
//         }

//         .cdp-chevron {
//           width: 28px;
//           height: 28px;
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #94a3b8;
//           background: #f8fafc;
//           transition: background 0.15s ease, color 0.15s ease;
//         }
//         .cdp-row-card:hover .cdp-chevron {
//           background: #ede9fe;
//           color: #7c3aed;
//         }

//         .cdp-expand-panel {
//           padding: 14px 18px 18px;
//           border-top: 1px solid #f1f5f9;
//           background: #fafbfd;
//           animation: cdp-expandIn 0.18s ease;
//         }

//         .cdp-detail {
//           display: flex;
//           flex-direction: column;
//           gap: 1px;
//         }
//         .cdp-detail-label {
//           font-size: 10.5px;
//           font-weight: 700;
//           color: #94a3b8;
//           text-transform: uppercase;
//           letter-spacing: 0.3px;
//         }
//         .cdp-detail-value {
//           font-size: 12.5px;
//           color: #334155;
//         }

//         @keyframes cdp-expandIn {
//           from {
//             opacity: 0;
//             transform: translateY(-4px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes slideInRight {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @media print {
//           .cdp-dot-bg {
//             background: white;
//           }
//           * {
//             -webkit-print-color-adjust: exact;
//           }
//         }
//         @media (max-width: 640px) {
//           .cdp-dot-bg {
//             padding: 12px;
//           }
//           .cdp-dot-bg > div:first-child {
//             padding: 12px;
//           }
//           .cdp-dot-bg > div:first-child > div:last-child {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }




import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Search,
  Filter,
  FileText,
  User,
  Package,
  Building,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Truck,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit,
  X,
  Save,
  LayoutGrid,
  List,
} from "lucide-react";

import {
  InjectStyles,
  getBadgeClasses,
  CHASER_OPTIONS,
  END_USER_OPTIONS,
  STATUS_OPTIONS,
  SearchableSelect,
  Field,
  formatDateForApi,
  normalizeStatusFromApi,
  mapStatusForApi,
} from "./Shared";

// Import CommonService if needed
// import CommonService from "./services/CommonService";

export default function ExecutivePage() {
  const [activeTab, setActiveTab] = useState("chaser");
  
  // Chaser Tab State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedChaser, setSelectedChaser] = useState("");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  
  const [collectionItems, setCollectionItems] = useState([]);
  const [loadingCollection, setLoadingCollection] = useState(false);
  const [collectionSearchTerm, setCollectionSearchTerm] = useState("");
  const [collectionFilterStatus, setCollectionFilterStatus] = useState("all");
  const [collectionExpandedItems, setCollectionExpandedItems] = useState(new Set());

  const [showChaserModal, setShowChaserModal] = useState(false);
  const [chaserItem, setChaserItem] = useState(null);
  const [selectedChaserForUpdate, setSelectedChaserForUpdate] = useState("");
  const [chaserUpdateLoading, setChaserUpdateLoading] = useState(false);

  const dataRef = useRef([]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);


  const fetchExecutiveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = sessionStorage.getItem("token");
      let authToken = "";
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          authToken = parsed || raw;
        } catch (err) {
          authToken = raw;
        }
      }

      const response = await fetch(
        `http://localhost:51976/DailyCollect/GetExecutiveDailyCollect?p_mdd_month=${selectedDate}`,
        {
          method: "GET",
          headers: {
            "auth-key": ` ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.StatusCode === 200 && result.ResultSet) {
        const mappedData = result.ResultSet.map((item) => ({
          ...item,
          DATE: new Date(item.DATE),
          formattedDate: new Date(item.DATE).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          status: normalizeStatusFromApi(item.STATUS),
          isCompleted:
            item.STATUS?.toLowerCase() === "c" ||
            item.STATUS?.toLowerCase() === "collected",
          chaserRemark: item.CHASER_REMARK || "",
          collectedBy: item.INVCOLLECTED_BY || "",
          handleBy: item.HANDLE_BY || "",
          mocNo: item.MOC_NO || "",
          poNo: item.PO_NO || "",
          pcNo: item.PC_NO || "",
          supplierName: item.Sup_Name || "",
          supplierAddress: item.Sup_Address || "",
          supplierContact: item.Sup_Contact || "",
          description: item.DESCRIPTION || "",
          serialNo: item.SERIAL_NO || "",
          jcat: item.JCAT || "",
          jmain: item.JMAIN || "",
          endUserBy: item.End_User_By || "",
          supplierCode: item.SUPPLIER_CODE || "",
        }));
        setData(mappedData);
        showToast(`Loaded ${mappedData.length} records`, "success");
      } else {
        setError("No data found for the selected date");
        setData([]);
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching data");
      console.error("Error fetching executive data:", err);
      showToast(err.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };


  const fetchCollectionList = async () => {
    setLoadingCollection(true);
    try { 
      const raw = sessionStorage.getItem("token");
      let authToken = "";
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          authToken = parsed || raw;
        } catch (err) {
          authToken = raw;
        }
      }

      const formattedDate = formatDateForApi(selectedDate);

      const response = await fetch(
        `http://localhost:51976/DailyCollect/GetDailyCollect?p_mdd_month=${formattedDate}`,
        {
          method: "GET",
          headers: {
            "auth-key": ` ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.StatusCode === 200 && result.ResultSet) {
        const mappedData = result.ResultSet.map((r, idx) => {
          const normalizedStatus = normalizeStatusFromApi(r.STATUS);
          return {
            id: `${(r.DATE || "").toString().replace(/\s+/g, "_")}_${r.SERIAL_NO ?? idx}_${r.PO_NO || ""}`,
            serialNo: r.SERIAL_NO ?? null,
            HANDLE_BY: r.HANDLE_BY || "",
            CHASER_ID: r.CHASER_ID || "",
            handlingAdmin: r.HANDLE_BY || r.HANDLED_BY || "",
            endUser: r.REQUEST_BY || "",
            endUserServiceNo: r.REQUEST_BY || "",
            moc: r.MOC_NO || r.MOCNO || r.MOC || r.MOCNo || r.MOC_no || "",
            jobNo: (r.JCAT || "") + (r.JMAIN || ""),
            description: r.DESCRIPTION || "",
            poNo: r.PO_NO || r.PO || "",
            End_User_By: r.End_User_By || "",
            End_User: r.End_User || "",
            supplierCode: r.SUPPLIER_NAME || r.SUPPLIER_CODE || "",
            suppliername: r.Sup_Name || "",
            SupplierAddress: r.Sup_Address || "",
            Sup_Contact: r.Sup_Contact || "",
            pcNo: r.PC_NO || r.PCNo || r.PC || "",
            status: normalizedStatus,
            collected: normalizedStatus === "Collected",
            collectedByChaser: r.INVCOLLECTED_BY || "",
            remark: r.CHASER_REMARK || r.REMARK || "",
            date: r.DATE || selectedDate,
          };
        });
        setCollectionItems(mappedData);
        showToast(`Loaded ${mappedData.length} collection records`, "success");
      } else {
        setCollectionItems([]);
        showToast("No collection data found", "info");
      }
    } catch (err) {
      console.error("Error fetching collection list:", err);
      showToast("Failed to load collection list", "error");
    } finally {
      setLoadingCollection(false);
    }
  };

  // Update Chaser function
  const handleChaserUpdate = async () => {
    if (!chaserItem || !selectedChaserForUpdate) return;

    setChaserUpdateLoading(true);
    try {
      const raw = sessionStorage.getItem("token");
      let authToken = "";
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          authToken = parsed || raw;
        } catch (err) {
          authToken = raw;
        }
      }

      const formattedDate = formatDateForApi(selectedDate);

      const selectedChaserObj = CHASER_OPTIONS.find(
        (o) => o.serviceNo === selectedChaserForUpdate
      );

      const updateData = {
        P_MDD_DATE: formattedDate,
        P_MDD_SERIAL_NO: parseInt(chaserItem.serialNo),
        P_MDD_HANDLE_BY: chaserItem.HANDLE_BY || "",
        P_MDD_REQUEST_BY: selectedChaserForUpdate,
        P_MDD_MOC_NO: chaserItem.MOC_NO || "",
        P_MDD_JCAT: chaserItem.JCAT || "",
        P_MDD_JMAIN: chaserItem.JMAIN || "",
        P_MDD_DESCRIPTION: chaserItem.DESCRIPTION || "",
        P_MDD_PO_NO: chaserItem.PO_NO || "",
        P_MDD_SUPPLIER_CODE: chaserItem.SUPPLIER_CODE || "",
        P_MDD_CHASER_REMARK: chaserItem.CHASER_REMARK || "",
        P_MDD_STATUS: mapStatusForApi(chaserItem.STATUS || "Pending"),
        P_MDD_PC_NO: chaserItem.PC_NO || "",
        P_MDD_INVCOLLECTED_BY: selectedChaserForUpdate,
      };

      const response = await fetch(
        `http://localhost:51976/DailyCollect/UpdateDailyCollect`,
        {
          method: "POST",
          headers: {
            "auth-key": ` ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.StatusCode === 200) {
        const chaserName = selectedChaserObj ? selectedChaserObj.name : selectedChaserForUpdate;
        showToast(`Chaser updated successfully to ${chaserName}!`, "success");
        setShowChaserModal(false);
        setSelectedChaserForUpdate("");
        // Refresh both tabs data
        await fetchExecutiveData();
        await fetchCollectionList();
      } else {
        throw new Error(result.Message || "Failed to update chaser");
      }
    } catch (err) {
      console.error("Error updating chaser:", err);
      showToast(err.message || "Failed to update chaser", "error");
    } finally {
      setChaserUpdateLoading(false);
    }
  };

  // Open chaser modal with item data
  const openChaserModal = (item) => {
    setChaserItem(item);
    setSelectedChaserForUpdate(item.INVCOLLECTED_BY || item.End_User_By || "");
    setShowChaserModal(true);
  };

  useEffect(() => {
    if (activeTab === "chaser") {
      fetchExecutiveData();
    } else {
      fetchCollectionList();
    }
  }, [selectedDate, activeTab]);

  // Filter data for Chaser Tab
  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.MOC_NO?.toLowerCase().includes(searchLower) ||
      item.PO_NO?.toLowerCase().includes(searchLower) ||
      item.Sup_Name?.toLowerCase().includes(searchLower) ||
      item.DESCRIPTION?.toLowerCase().includes(searchLower) ||
      item.PC_NO?.toLowerCase().includes(searchLower);

    const matchesStatus =
      filterStatus === "all" ||
      item.STATUS?.toLowerCase() === filterStatus.toLowerCase();

    const matchesAdmin =
      !selectedAdmin ||
      item.HANDLE_BY === selectedAdmin ||
      item.HANDLE_BY?.includes(selectedAdmin);

    const matchesChaser =
      !selectedChaser ||
      item.INVCOLLECTED_BY === selectedChaser ||
      item.INVCOLLECTED_BY?.includes(selectedChaser);

    return matchesSearch && matchesStatus && matchesAdmin && matchesChaser;
  });

  // Filter data for Collection Tab
  const filteredCollectionData = collectionItems.filter((item) => {
    const searchLower = collectionSearchTerm.toLowerCase();
    const matchesSearch =
      !collectionSearchTerm ||
      item.moc?.toLowerCase().includes(searchLower) ||
      item.poNo?.toLowerCase().includes(searchLower) ||
      item.suppliername?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.pcNo?.toLowerCase().includes(searchLower);

    const matchesStatus =
      collectionFilterStatus === "all" ||
      item.status?.toLowerCase() === collectionFilterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Statistics for Chaser Tab
  const totalItems = filteredData.length;
  const completedItems = filteredData.filter(
    (i) =>
      i.STATUS?.toLowerCase() === "collected" ||
      i.STATUS?.toLowerCase() === "completed"
  ).length;
  const pendingItems = filteredData.filter(
    (i) =>
      i.STATUS?.toLowerCase() !== "collected" &&
      i.STATUS?.toLowerCase() !== "completed"
  ).length;

  // Statistics for Collection Tab
  const totalCollectionItems = filteredCollectionData.length;
  const collectedItems = filteredCollectionData.filter(
    (i) => i.status?.toLowerCase() === "collected"
  ).length;
  const pendingCollectionItems = filteredCollectionData.filter(
    (i) => i.status?.toLowerCase() !== "collected"
  ).length;

  // Status visual config
  const getStatusIcon = (status) => {
    const statusMap = {
      collected: {
        icon: CheckCircle,
        pillBg: "#dcfce7",
        pillText: "#15803d",
        badgeGrad: "linear-gradient(135deg, #34d399, #059669)",
        glow: "rgba(16,185,129,0.35)",
        accent: "#10b981",
      },
      completed: {
        icon: CheckCircle,
        pillBg: "#dcfce7",
        pillText: "#15803d",
        badgeGrad: "linear-gradient(135deg, #34d399, #059669)",
        glow: "rgba(16,185,129,0.35)",
        accent: "#10b981",
      },
      pending: {
        icon: Clock,
        pillBg: "#fef3c7",
        pillText: "#b45309",
        badgeGrad: "linear-gradient(135deg, #fbbf24, #d97706)",
        glow: "rgba(217,119,6,0.32)",
        accent: "#f59e0b",
      },
      rejected: {
        icon: AlertCircle,
        pillBg: "#fee2e2",
        pillText: "#dc2626",
        badgeGrad: "linear-gradient(135deg, #f87171, #dc2626)",
        glow: "rgba(220,38,38,0.32)",
        accent: "#ef4444",
      },
      "not available": {
        icon: AlertCircle,
        pillBg: "#fee2e2",
        pillText: "#dc2626",
        badgeGrad: "linear-gradient(135deg, #f87171, #dc2626)",
        glow: "rgba(220,38,38,0.32)",
        accent: "#ef4444",
      },
      partial: {
        icon: Loader2,
        pillBg: "#dbeafe",
        pillText: "#2563eb",
        badgeGrad: "linear-gradient(135deg, #60a5fa, #2563eb)",
        glow: "rgba(37,99,235,0.32)",
        accent: "#3b82f6",
      },
    };
    const normalized = status?.toLowerCase() || "pending";
    return statusMap[normalized] || statusMap.pending;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleCollectionExpand = (id) => {
    setCollectionExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = (dataToExport, filename = `export_${selectedDate}`) => {
    if (dataToExport.length === 0) {
      showToast("No data to export", "error");
      return;
    }

    const headers = [
      "SERIAL_NO",
      "MOC_NO",
      "PO_NO",
      "PC_NO",
      "DESCRIPTION",
      "STATUS",
      "SUPPLIER",
      "HANDLE_BY",
      "CHASER",
      "DATE",
    ];

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((item) =>
        [
          item.SERIAL_NO || item.serialNo || "",
          item.MOC_NO || item.moc || "",
          item.PO_NO || item.poNo || "",
          item.PC_NO || item.pcNo || "",
          `"${(item.DESCRIPTION || item.description || "").replace(/"/g, '""')}"`,
          item.STATUS || item.status || "",
          `"${(item.Sup_Name || item.suppliername || "").replace(/"/g, '""')}"`,
          item.HANDLE_BY || item.handlingAdmin || "",
          item.INVCOLLECTED_BY || item.collectedByChaser || "",
          formatDate(item.DATE || item.date) || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast("Data exported successfully!");
  };

  const formatDisplayDate = (date) => {
    try {
      const d = new Date(date + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

  const getChaserDisplayName = (serviceNo) => {
    if (!serviceNo) return "";
    const chaser = CHASER_OPTIONS.find((o) => o.serviceNo === serviceNo);
    return chaser ? `${chaser.serviceNo} - ${chaser.name}` : serviceNo;
  };

  // Render Chaser Tab
  const renderChaserTab = () => (
    <>
      {/* Header Section */}
      <div
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
          padding: "16px 20px 20px",
          marginBottom: 20,
          boxShadow: "0 6px 18px rgba(124,58,237,0.25)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Chaser Assignment
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              {formatDisplayDate(selectedDate)}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginTop: 12,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>{totalItems}</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Total Items</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: "#a7f3d0" }}>
              {completedItems}
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Completed</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fcd34d" }}>
              {pendingItems}
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Pending</div>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 10,
                opacity: 0.8,
                display: "block",
                marginBottom: 4,
              }}
            >
              <Calendar size={10} style={{ marginRight: 4 }} />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#fff",
                fontSize: 12,
                outline: "none",
                cursor: "pointer",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 10,
                opacity: 0.8,
                display: "block",
                marginBottom: 4,
              }}
            >
              <Filter size={10} style={{ marginRight: 4 }} />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#fff",
                fontSize: 12,
                outline: "none",
              }}
            >
              <option value="all" style={{ color: "#000" }}>
                All Status
              </option>
              <option value="collected" style={{ color: "#000" }}>
                Collected
              </option>
              <option value="pending" style={{ color: "#000" }}>
                Pending
              </option>
              <option value="not available" style={{ color: "#000" }}>
                Not Available
              </option>
              <option value="partial" style={{ color: "#000" }}>
                Partial
              </option>
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 10,
                opacity: 0.8,
                display: "block",
                marginBottom: 4,
              }}
            >
              <Search size={10} style={{ marginRight: 4 }} />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by MOC, PO, Supplier..."
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.56)",
                border: "1px solid rgba(255, 253, 253, 0.35)",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#fff",
                fontSize: 12,
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, color: "#64748b" }}>
          {filteredData.length} items found
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => handleExport(filteredData, `chaser_data_${selectedDate}`)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#fff",
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "60px 24px",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Loader2
            size={40}
            color="#7c3aed"
            className="cdp-spin"
            style={{ margin: "0 auto 16px" }}
          />
          <div style={{ fontSize: 14, color: "#64748b" }}>
            Loading chaser data...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div
          style={{
            background: "#fef2f2",
            borderRadius: 20,
            padding: "48px 24px",
            textAlign: "center",
            border: "1px solid #fecaca",
          }}
        >
          <AlertCircle
            size={40}
            color="#ef4444"
            style={{ margin: "0 auto 16px" }}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#991b1b",
              marginBottom: 8,
            }}
          >
            Error Loading Data
          </div>
          <div style={{ fontSize: 14, color: "#dc2626", marginBottom: 16 }}>
            {error}
          </div>
          <button
            onClick={fetchExecutiveData}
            style={{
              padding: "8px 24px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* No Data */}
      {!loading && !error && filteredData.length === 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "60px 24px",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            No items found
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            Try adjusting your search or filters
          </div>
        </div>
      )}

      {/* Data List */}
      {!loading && !error && filteredData.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredData.map((item) => {
            const statusInfo = getStatusIcon(item.STATUS);
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedItems.has(item.SERIAL_NO);

            return (
              <div
                key={item.SERIAL_NO}
                className="cdp-row-card"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
                  border: "1px solid #eef1f6",
                  borderLeft: `4px solid ${statusInfo.accent}`,
                  overflow: "hidden",
                }}
              >
                {/* Compact View */}
                <div
                  onClick={() => toggleExpand(item.SERIAL_NO)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    padding: "14px 18px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 14.5,
                            color: "#0f172a",
                            letterSpacing: -0.1,
                          }}
                        >
                          {item.MOC_NO}
                        </span>

                        {item.PO_NO && (
                          <span className="cdp-chip">
                            <FileText size={10} />
                            {item.PO_NO}
                          </span>
                        )}

                        {item.PC_NO && (
                          <span className="cdp-chip">
                            <Package size={10} />
                            {item.PC_NO}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "#475569",
                          marginBottom: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.DESCRIPTION || "No description provided"}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          fontSize: 12,
                          color: "#94a3b8",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Building size={11} />
                          {item.Sup_Name || "Supplier not specified"}
                        </span>
                        {item.INVCOLLECTED_BY && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#4338ca",
                              fontWeight: 500,
                            }}
                          >
                            <Truck size={11} />
                            {getChaserDisplayName(item.INVCOLLECTED_BY)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <button
                      className="cdp-chaser-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openChaserModal(item);
                      }}
                    >
                      <Truck size={12} />
                      Chaser
                    </button>

                    <div className="cdp-chevron">
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="cdp-expand-panel">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px 20px",
                        fontSize: 12.5,
                        color: "#334155",
                      }}
                    >
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">Admin</span>
                        <span className="cdp-detail-value">{item.HANDLE_BY || "-"}</span>
                      </div>
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">Supplier</span>
                        <span className="cdp-detail-value">{item.Sup_Name || "-"}</span>
                      </div>
                      <div className="cdp-detail" style={{ gridColumn: "span 2" }}>
                        <span className="cdp-detail-label">Address</span>
                        <span className="cdp-detail-value">{item.Sup_Address || "-"}</span>
                      </div>
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">Contact</span>
                        <span className="cdp-detail-value">{item.Sup_Contact || "-"}</span>
                      </div>
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">JCAT</span>
                        <span className="cdp-detail-value">{item.JCAT || "-"}</span>
                      </div>
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">JMAIN</span>
                        <span className="cdp-detail-value">{item.JMAIN || "-"}</span>
                      </div>
                      <div className="cdp-detail" style={{ gridColumn: "span 2" }}>
                        <span className="cdp-detail-label">End User</span>
                        <span className="cdp-detail-value">{item.End_User_By || "-"}</span>
                      </div>
                      <div className="cdp-detail" style={{ gridColumn: "span 2" }}>
                        <span className="cdp-detail-label">Supplier Code</span>
                        <span className="cdp-detail-value">{item.SUPPLIER_CODE || "-"}</span>
                      </div>

                      {item.CHASER_REMARK && (
                        <div
                          style={{
                            gridColumn: "span 2",
                            background: "#f0f9ff",
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid #bae6fd",
                            marginTop: 2,
                          }}
                        >
                          <strong style={{ color: "#0369a1" }}>Remark:</strong>
                          <span style={{ color: "#0c4a6e", marginLeft: 6 }}>
                            {item.CHASER_REMARK}
                          </span>
                        </div>
                      )}

                      {item.INVCOLLECTED_BY && (
                        <div
                          style={{
                            gridColumn: "span 2",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            color: "#4338ca",
                            fontWeight: 600,
                            marginTop: 2,
                            background: "#eef2ff",
                            padding: "6px 12px",
                            borderRadius: 8,
                          }}
                        >
                          <Truck size={13} />
                          Chaser: {getChaserDisplayName(item.INVCOLLECTED_BY)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  // Render Collection List Tab
  const renderCollectionTab = () => (
    <>
      {/* Header Section */}
      <div
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          padding: "16px 20px 20px",
          marginBottom: 20,
          boxShadow: "0 6px 18px rgba(5,150,105,0.25)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <List size={20} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Collection List
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              {formatDisplayDate(selectedDate)}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginTop: 12,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {totalCollectionItems}
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Total Items</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: "#a7f3d0" }}>
              {collectedItems}
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Collected</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fcd34d" }}>
              {pendingCollectionItems}
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Pending</div>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 10,
                opacity: 0.8,
                display: "block",
                marginBottom: 4,
              }}
            >
              <Filter size={10} style={{ marginRight: 4 }} />
              Status
            </label>
            <select
              value={collectionFilterStatus}
              onChange={(e) => setCollectionFilterStatus(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#fff",
                fontSize: 12,
                outline: "none",
              }}
            >
              <option value="all" style={{ color: "#000" }}>
                All Status
              </option>
              <option value="collected" style={{ color: "#000" }}>
                Collected
              </option>
              <option value="pending" style={{ color: "#000" }}>
                Pending
              </option>
              <option value="not available" style={{ color: "#000" }}>
                Not Available
              </option>
              <option value="partial" style={{ color: "#000" }}>
                Partial
              </option>
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 10,
                opacity: 0.8,
                display: "block",
                marginBottom: 4,
              }}
            >
              <Search size={10} style={{ marginRight: 4 }} />
              Search
            </label>
            <input
              type="text"
              value={collectionSearchTerm}
              onChange={(e) => setCollectionSearchTerm(e.target.value)}
              placeholder="Search by MOC, PO, Supplier..."
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.57)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#fff",
                fontSize: 12,
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, color: "#64748b" }}>
          {filteredCollectionData.length} items found
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => handleExport(filteredCollectionData, `collection_list_${selectedDate}`)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#fff",
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loadingCollection && (
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "60px 24px",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Loader2
            size={40}
            color="#059669"
            className="cdp-spin"
            style={{ margin: "0 auto 16px" }}
          />
          <div style={{ fontSize: 14, color: "#64748b" }}>
            Loading collection list...
          </div>
        </div>
      )}

      {/* No Data */}
      {!loadingCollection && filteredCollectionData.length === 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "60px 24px",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            No collection items found
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            Try adjusting your search or filters
          </div>
        </div>
      )}

      {/* Collection Data List */}
      {!loadingCollection && filteredCollectionData.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredCollectionData.map((item) => {
            const statusInfo = getStatusIcon(item.status);
            const StatusIcon = statusInfo.icon;
            const isExpanded = collectionExpandedItems.has(item.id);

            return (
              <div
                key={item.id}
                className="cdp-row-card"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
                  border: "1px solid #eef1f6",
                  borderLeft: `4px solid ${statusInfo.accent}`,
                  overflow: "hidden",
                }}
              >
                {/* Compact View */}
                <div
                  onClick={() => toggleCollectionExpand(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    padding: "14px 18px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                          marginBottom: 4,
                        }}
                      >
                        

                        {item.poNo && (
                          <span className="cdp-chip">
                            <FileText size={10} />
                            {item.poNo}
                          </span>
                        )}

                        {item.pcNo && (
                          <span className="cdp-chip">
                            <Package size={10} />
                            {item.pcNo}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "#475569",
                          marginBottom: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.description || "No description provided"}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          fontSize: 12,
                          color: "#94a3b8",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Building size={11} />
                          {item.suppliername || "Supplier not specified"}
                        </span>
                        {item.collectedByChaser && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#4338ca",
                              fontWeight: 500,
                            }}
                          >
                            <Truck size={11} />
                            {getChaserDisplayName(item.collectedByChaser)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: statusInfo.pillBg,
                        color: statusInfo.pillText,
                      }}
                    >
                      {item.status || "Pending"}
                    </span>
                    <div className="cdp-chevron">
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="cdp-expand-panel">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px 20px",
                        fontSize: 12.5,
                        color: "#334155",
                      }}
                    >
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">Admin</span>
                        <span className="cdp-detail-value">{item.handlingAdmin || "-"}</span>
                      </div>
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">Supplier</span>
                        <span className="cdp-detail-value">{item.suppliername || "-"}</span>
                      </div>
                      <div className="cdp-detail" style={{ gridColumn: "span 2" }}>
                        <span className="cdp-detail-label">Address</span>
                        <span className="cdp-detail-value">{item.SupplierAddress || "-"}</span>
                      </div>
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">Contact</span>
                        <span className="cdp-detail-value">{item.Sup_Contact || "-"}</span>
                      </div>
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">End User</span>
                        <span className="cdp-detail-value">{item.End_User_By || item.endUser || "-"}</span>
                      </div>
                      <div className="cdp-detail">
                        <span className="cdp-detail-label">Supplier Code</span>
                        <span className="cdp-detail-value">{item.supplierCode || "-"}</span>
                      </div>

                      {item.remark && (
                        <div
                          style={{
                            gridColumn: "span 2",
                            background: "#f0f9ff",
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid #bae6fd",
                            marginTop: 2,
                          }}
                        >
                          <strong style={{ color: "#0369a1" }}>Chaser Remark:</strong>
                          <span style={{ color: "#0c4a6e", marginLeft: 6 }}>
                            {item.remark}
                          </span>
                        </div>
                      )}

                      {item.collectedByChaser && (
                        <div
                          style={{
                            gridColumn: "span 2",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            color: "#4338ca",
                            fontWeight: 600,
                            marginTop: 2,
                            background: "#eef2ff",
                            padding: "6px 12px",
                            borderRadius: 8,
                          }}
                        >
                          <Truck size={13} />
                          Chaser: {getChaserDisplayName(item.collectedByChaser)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <div
      className="cdp-dot-bg"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      <InjectStyles />

      {/* Toast Notification */}
      {toast && (
        <div
          className="cdp-toast-in"
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1000,
            background:
              toast.type === "error"
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : toast.type === "info"
                ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                : "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={18} />
          ) : toast.type === "info" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Chaser Update Modal */}
      {showChaserModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => !chaserUpdateLoading && setShowChaserModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "28px 32px",
              maxWidth: 480,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              animation: "cdp-popIn 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <Truck size={18} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
                  Assign Chaser
                </h2>
              </div>
              <button
                onClick={() => !chaserUpdateLoading && setShowChaserModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "#94a3b8",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#475569")}
                onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
              >
                <X size={20} />
              </button>
            </div>

            {/* Item details (read-only) */}
            {chaserItem && (
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "14px 16px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 16px",
                    fontSize: 13,
                  }}
                >
                  <div style={{ gridColumn: "span 2" }}>
                    <span style={{ color: "#94a3b8", fontSize: 14 }}>
                      PO No:
                    </span>
                    <span style={{ marginLeft: 4, color: "#334155" }}>
                      {chaserItem.PO_NO || "-"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", fontSize: 14 }}>
                      MOC No:
                    </span>
                    <span style={{ fontWeight: 600, marginLeft: 4, color: "#0f172a" }}>
                      {chaserItem.MOC_NO || "-"}
                    </span>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <span style={{ color: "#94a3b8", fontSize: 14 }}>
                      Description:
                    </span>
                    <span style={{ marginLeft: 4, color: "#334155" }}>
                      {chaserItem.DESCRIPTION || "-"}
                    </span>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <span style={{ color: "#94a3b8", fontSize: 14 }}>
                      Supplier:
                    </span>
                    <span style={{ marginLeft: 4, color: "#334155" }}>
                      {chaserItem.Sup_Name || "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Select Chaser
                </label>

                {/* Chaser selection buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {CHASER_OPTIONS.map((chaser) => (
                    <button
                      key={chaser.serviceNo}
                      onClick={() => setSelectedChaserForUpdate(chaser.serviceNo)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: `2px solid ${
                          selectedChaserForUpdate === chaser.serviceNo
                            ? "#6366f1"
                            : "#e2e8f0"
                        }`,
                        background:
                          selectedChaserForUpdate === chaser.serviceNo
                            ? "#eef2ff"
                            : "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedChaserForUpdate !== chaser.serviceNo) {
                          e.currentTarget.style.borderColor = "#a5b4fc";
                          e.currentTarget.style.background = "#f8fafc";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedChaserForUpdate !== chaser.serviceNo) {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.background = "#fff";
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 62,
                            height: 32,
                            borderRadius: "50%",
                            background:
                              selectedChaserForUpdate === chaser.serviceNo
                                ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                                : "#3845f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color:
                              selectedChaserForUpdate === chaser.serviceNo
                                ? "#fff"
                                : "#f3f5f7",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {chaser.serviceNo}
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0f172a",
                            }}
                          >
                            {chaser.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#94a3b8",
                            }}
                          >
                            Service No: {chaser.serviceNo}
                          </div>
                        </div>
                      </div>
                      {selectedChaserForUpdate === chaser.serviceNo && (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#6366f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={12} color="#fff" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 8,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => !chaserUpdateLoading && setShowChaserModal(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "#64748b",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                  disabled={chaserUpdateLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChaserUpdate}
                  disabled={!selectedChaserForUpdate || chaserUpdateLoading}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "none",
                    background:
                      !selectedChaserForUpdate || chaserUpdateLoading
                        ? "#cbd5e1"
                        : "linear-gradient(135deg, #6366f1, #4f46e5)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: !selectedChaserForUpdate || chaserUpdateLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s ease",
                    boxShadow:
                      !selectedChaserForUpdate || chaserUpdateLoading
                        ? "none"
                        : "0 4px 12px rgba(99, 102, 241, 0.35)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChaserForUpdate && !chaserUpdateLoading) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.45)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChaserForUpdate && !chaserUpdateLoading) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.35)";
                    }
                  }}
                >
                  {chaserUpdateLoading ? (
                    <>
                      <Loader2 size={16} className="cdp-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          background: "#fff",
          borderRadius: 16,
          padding: 4,
          boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
          border: "1px solid #eef1f6",
        }}
      >
        <button
          onClick={() => setActiveTab("chaser")}
          style={{
            flex: 1,
            padding: "12px 20px",
            border: "none",
            borderRadius: 12,
            background: activeTab === "chaser" 
              ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" 
              : "transparent",
            color: activeTab === "chaser" ? "#fff" : "#64748b",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: activeTab === "chaser" 
              ? "0 4px 12px rgba(124,58,237,0.25)" 
              : "none",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "chaser") {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#0f172a";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "chaser") {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#64748b";
            }
          }}
        >
          <Truck size={18} />
          Chaser Assignment
          <span
            style={{
              fontSize: 11,
              background: activeTab === "chaser" 
                ? "rgba(255,255,255,0.2)" 
                : "#e2e8f0",
              padding: "2px 10px",
              borderRadius: 12,
              color: activeTab === "chaser" ? "#fff" : "#64748b",
            }}
          >
            {data.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("collection")}
          style={{
            flex: 1,
            padding: "12px 20px",
            border: "none",
            borderRadius: 12,
            background: activeTab === "collection" 
              ? "linear-gradient(135deg, #059669 0%, #047857 100%)" 
              : "transparent",
            color: activeTab === "collection" ? "#fff" : "#64748b",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: activeTab === "collection" 
              ? "0 4px 12px rgba(5,150,105,0.25)" 
              : "none",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "collection") {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#0f172a";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "collection") {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#64748b";
            }
          }}
        >
          <List size={18} />
          Collection List
          <span
            style={{
              fontSize: 11,
              background: activeTab === "collection" 
                ? "rgba(255,255,255,0.2)" 
                : "#e2e8f0",
              padding: "2px 10px",
              borderRadius: 12,
              color: activeTab === "collection" ? "#fff" : "#64748b",
            }}
          >
            {collectionItems.length}
          </span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {activeTab === "chaser" ? renderChaserTab() : renderCollectionTab()}
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        .cdp-dot-bg {
          background: #f8fafc;
        }
        .cdp-toast-in {
          animation: slideInRight 0.3s ease;
        }
        .cdp-spin {
          animation: spin 1s linear infinite;
        }

        .cdp-row-card {
          transition: transform 0.16s ease, box-shadow 0.16s ease,
            border-color 0.16s ease;
        }
        .cdp-row-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09);
          border-color: #e2e8f0;
        }

        .cdp-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 9px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .cdp-chaser-btn {
          padding: 6px 13px;
          border-radius: 8px;
          border: 1.5px solid #c7d2fe;
          background: #eef2ff;
          color: #4338ca;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background 0.15s ease, color 0.15s ease,
            box-shadow 0.15s ease, transform 0.15s ease;
        }
        .cdp-chaser-btn:hover {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 6px 14px rgba(79, 70, 229, 0.32);
          transform: translateY(-1px);
        }

        .cdp-chevron {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          background: #f8fafc;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .cdp-row-card:hover .cdp-chevron {
          background: #ede9fe;
          color: #7c3aed;
        }

        .cdp-expand-panel {
          padding: 14px 18px 18px;
          border-top: 1px solid #f1f5f9;
          background: #fafbfd;
          animation: cdp-expandIn 0.18s ease;
        }

        .cdp-detail {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .cdp-detail-label {
          font-size: 10.5px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .cdp-detail-value {
          font-size: 12.5px;
          color: #334155;
        }

        @keyframes cdp-expandIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media print {
          .cdp-dot-bg {
            background: white;
          }
          * {
            -webkit-print-color-adjust: exact;
          }
        }
        @media (max-width: 640px) {
          .cdp-dot-bg {
            padding: 12px;
          }
          .cdp-dot-bg > div:first-child {
            padding: 12px;
          }
          .cdp-dot-bg > div:first-child > div:last-child {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}