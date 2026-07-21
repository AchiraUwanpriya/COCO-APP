// import React, { useState, useEffect, useRef } from "react";
// import {
//   CheckCircle2,
//   XCircle,
//   User,
//   Calendar,
//   ClipboardList,
//   Package,
//   Truck,
//   FileText,
//   Square,
//   Loader2,
//   Clock,
// } from "lucide-react";

// import CommonService from "../../service/CommonService";
// import {
//   CHASER_OPTIONS,
//   getBadgeClasses,
//   formatDateForApi,
//   normalizeStatusFromApi,
//   mapStatusForApi,
//   normalizeMocValue,
//   splitJobNoValue,
//   InjectStyles,
//   SearchableSelect,
// } from "./Shared";

// export default function ChaserCollectionPage() {
//   const [items, setItems] = useState([]);
//   const itemsRef = useRef([]);
//   const [toast, setToast] = useState(null);

//   const [selectedChaser, setSelectedChaser] = useState("Chaser");
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [loadingOptions, setLoadingOptions] = useState(false);
//   const [apiData, setApiData] = useState([]);
//   const [savingRemarkForId, setSavingRemarkForId] = useState(null);
  
//   const [locallyCollectedIds, setLocallyCollectedIds] = useState(new Set());

//   useEffect(() => {
//     itemsRef.current = items;
//   }, [items]);
 
//   useEffect(() => {
//     const fetchToDoList = async () => {
//       try {
//         const response = await CommonService.GetToDoList();
//         if (response.data && response.data.ResultSet) {
//           setApiData(response.data.ResultSet);
//         }
//       } catch (error) {
//         console.error("Error fetching TODO list:", error);
//       }
//     };
//     fetchToDoList();
//   }, []);
 
//   const toIsoDateOnly = (value) => {
//     const parsed = new Date(value);
//     if (Number.isNaN(parsed.getTime())) return null;
//     const y = parsed.getFullYear();
//     const m = String(parsed.getMonth() + 1).padStart(2, "0");
//     const d = String(parsed.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   };
 
//   const fetchDailyCollect = async () => {
//     setLoadingOptions(true);
//     try {
//       const resp = await CommonService.GetChaserDailyCollect({});
//       const rawData = resp?.data?.ResultSet || resp?.data?.Result || [];

//       const data = Array.isArray(rawData)
//         ? rawData.filter((r) => toIsoDateOnly(r.DATE) === selectedDate)
//         : [];

//       if (data.length > 0) {
//         const existingBySerial = new Map(
//           itemsRef.current.map((it) => [String(it.serialNo ?? ""), it])
//         );
//         const mapped = data.map((r, idx) => {
//           const id = `${(r.DATE || "").toString().replace(/\s+/g, "_")}_${r.SERIAL_NO ?? idx}_${r.PO_NO ?? ""}`;
//           let dateIso = selectedDate;
//           try {
//             const parsed = new Date(r.DATE);
//             if (!Number.isNaN(parsed.getTime())) dateIso = parsed.toISOString();
//           } catch (e) {}

//           const normalizedStatus = normalizeStatusFromApi(r.STATUS);
//           const existingItem = existingBySerial.get(String(r.SERIAL_NO ?? ""));
//           const serverRemark = r.CHASER_REMARK || r.REMARK || "";
//           const remark = serverRemark || existingItem?.remark || "";
//           const remarkDraft = existingItem?.remarkDraft || "";

//           return {
//             id,
//             serialNo: r.SERIAL_NO ?? null,
//             handlingAdmin: r.HANDLE_BY || r.HANDLED_BY || "",
//             endUser: r.REQUEST_BY || "",
//             moc: normalizeMocValue(r.MOC_NO ?? r.MOCNO ?? r.MOC ?? r.MOCNo ?? r.MOC_no),
//             jobNo: (r.JCAT || "") + (r.JMAIN || ""),
//             description: r.DESCRIPTION || "",
//             poNo: r.PO_NO || r.PO || "",
//             End_User_By: r.End_User_By,
//             End_User: r.End_User,
//             supplierCode: r.SUPPLIER_NAME || r.SUPPLIER_CODE || "",
//             HANDLE_BY: r.HANDLE_BY || "",
//             suppliername: r.Sup_Name,
//             SupplierAddress: r.Sup_Address,
//             pcNo: r.PC_NO || r.PCNo || r.PC || "",
//             status: normalizedStatus,
//             Sup_Contact: r.Sup_Contact,
//             collected: normalizedStatus === "Collected",
//             collectedByChaser: r.INVCOLLECTED_BY || "",
//             remark,
//             remarkDraft,
//             date: dateIso,
//           };
//         });

//         setItems(mapped);
//       } else { 
//         setItems([]);
//       }
//     } catch (err) {
//       console.error("Error fetching DailyCollect:", err);
//       showToast("Failed to load collection list from server", "error");
//     } finally {
//       setLoadingOptions(false);
//     }
//   };

//   useEffect(() => {
//     fetchDailyCollect();
//   }, [selectedDate]);

//   function showToast(msg, type = "success") {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 2500);
//   }

//   const resolveSupplierCode = (item) => {
//     const matching = apiData.find((it) => it.PO_NO === item.poNo);
//     return matching?.SUPPLIER_CODE || item.supplierCode || "";
//   };

//   const buildChaserPayload = (item, overrides = {}) => {
//     const updated = { ...item, ...overrides };
//     const { jobCat, jobMain } = splitJobNoValue(updated.jobNo, "", "");
//     const payloadDate = updated.date || selectedDate;

//     let adminServiceNo = "";
//     if (updated.handlingAdmin) {
//       const adminMatch = updated.handlingAdmin.match(/^(\d+)/);
//       if (adminMatch) adminServiceNo = adminMatch[1];
//     }

//     return {
//       P_MDD_DATE: formatDateForApi(payloadDate),
//       P_MDD_SERIAL_NO: updated.serialNo,
//       P_MDD_HANDLE_BY: adminServiceNo || updated.handlingAdmin || "",
//       P_MDD_REQUEST_BY: updated.endUser || "",
//       P_MDD_MOC_NO: normalizeMocValue(updated.moc),
//       P_MDD_JCAT: jobCat,
//       P_MDD_JMAIN: jobMain,
//       P_MDD_DESCRIPTION: updated.description || "",
//       P_MDD_PO_NO: updated.poNo || "",
//       P_MDD_SUPPLIER_CODE: resolveSupplierCode(updated),
//       P_MDD_CHASER_REMARK: updated.remark || "",
//       P_MDD_STATUS: mapStatusForApi(updated.status),
//       P_MDD_PC_NO: updated.pcNo || "",
//       P_MDD_INVCOLLECTED_BY: updated.endUser || "",
//     };
//   };

//   const updateChaserItem = async (itemId, overrides = {}, successToast) => {
//     const currentItem = items.find((it) => it.id === itemId);
//     if (!currentItem) return;

//     const serialNo = currentItem.serialNo;
//     if (!serialNo) {
//       showToast("Serial number is required to update.", "error");
//       return;
//     }

//     const payload = buildChaserPayload(currentItem, overrides);
//     try {
//       const resp = await CommonService.UpdateDailyCollect(payload);
//       const serverStatus = resp?.status ?? resp?.data?.statusCode ?? resp?.data?.StatusCode;
//       if (serverStatus === 200 || resp?.status === 200) {
//         setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, ...overrides } : it)));
//         if (successToast) showToast(successToast);
//         fetchDailyCollect();
//       } else {
//         showToast("Update failed on server.", "error");
//       }
//     } catch (err) {
//       const serverMsg = err?.response?.data?.Message ?? err?.response?.data?.message ?? err.message ?? "Network error";
//       showToast(serverMsg || "Update failed.", "error");
//     }
//   };

//   // MODIFIED: Now only updates local state, no API call
//   const handleLocalCollection = (itemId) => {
//     setLocallyCollectedIds(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(itemId)) {
//         newSet.delete(itemId);
//       } else {
//         newSet.add(itemId);
//       }
//       return newSet;
//     });
//   };

//   // MODIFIED: Handle remark update and collection together
//   const handleRemarkUpdate = async (itemId) => {
//     const currentItem = items.find((it) => it.id === itemId);
//     if (!currentItem) return;
    
//     setSavingRemarkForId(itemId);
    
//     const draft = currentItem.remarkDraft || "";
//     const nextRemark = draft.trim() ? draft : currentItem.remark || "";
    
//     // Check if this item was locally marked for collection
//     const shouldCollect = locallyCollectedIds.has(itemId);
    
//     // Prepare overrides
//     const overrides = {
//       remark: nextRemark,
//       remarkDraft: "",
//     };
    
//     if (shouldCollect) {
//       overrides.collected = true;
//       overrides.collectedByChaser = selectedChaser;
//       overrides.collectedAt = new Date().toISOString();
//       overrides.status = "Collected";
//     }
    
//     await updateChaserItem(
//       itemId, 
//       overrides, 
//       shouldCollect ? "Item collected and remark updated!" : "Remark updated"
//     );
    
//     // Remove from local collection set after successful API call
//     setLocallyCollectedIds(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(itemId);
//       return newSet;
//     });
    
//     setSavingRemarkForId(null);
//   };

//   // REMOVED: handleCollection function no longer needed (replaced by handleLocalCollection)
  
//   function handleRemarkChange(itemId, remarkText) {
//     setItems((prev) =>
//       prev.map((it) => (it.id === itemId ? { ...it, remarkDraft: remarkText } : it))
//     );
//   }

//   // MODIFIED: Handle collect all with new flow
//   const handleCollectAll = () => {
//     if (!selectedChaser) {
//       showToast("Please select a chaser first!", "error");
//       return;
//     }
//     if (pendingItems.length === 0) {
//       showToast("No pending items to collect!", "error");
//       return;
//     }
//     // Mark all pending items locally
//     const allIds = new Set(pendingItems.map(item => item.id));
//     setLocallyCollectedIds(allIds);
//     showToast(`${pendingItems.length} items marked for collection. Click Update on each item to confirm.`, "success");
//   };

//   // MODIFIED: Cancel all selected collections
//   const handleCancelAll = () => {
//     if (locallyCollectedIds.size === 0) {
//       showToast("No items to cancel", "error");
//       return;
//     }
//     setLocallyCollectedIds(new Set());
//     showToast("All collection selections cancelled", "success");
//   };

//   const pendingItems = items.filter(item => !item.collected);
//   const collectedItems = items.filter(item => item.collected);
 
//   const itemsByChaser = collectedItems.reduce((acc, item) => {
//     if (item.collectedByChaser) {
//       if (!acc[item.collectedByChaser]) acc[item.collectedByChaser] = [];
//       acc[item.collectedByChaser].push(item);
//     }
//     return acc;
//   }, {});

//   return (
//     <div className="cdp-dot-bg" style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
//       <InjectStyles />

//       {toast && (
//         <div
//           className="cdp-toast-in"
//           style={{
//             position: "fixed",
//             top: 16,
//             right: 16,
//             zIndex: 100,
//             background: toast.type === "error" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #10b981, #059669)",
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
//           {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
//           {toast.msg}
//         </div>
//       )}

//       <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "20px 16px 32px" }}>
//         {/* ── Date + Chaser selectors ── */}
//         <div
//           style={{
//             background: "#ffffff",
//             borderRadius: 14,
//             padding: "10px 14px 12px",
//             marginBottom: 16,
//             boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
//             border: "1px solid rgba(148,163,184,0.25)",
//             display: "flex",
//             gap: 10,
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ flex: "1 1 160px" }}>
//             <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4, fontWeight: 600 }}>
//               <Calendar size={12} style={{ marginRight: 4 }} />
//               Select Date
//             </label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               style={{
//                 width: "100%",
//                 background: "#f8fafc",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: 10,
//                 padding: "8px 10px",
//                 color: "#0f172a",
//                 fontSize: 13,
//                 outline: "none",
//               }}
//             />
//           </div> 
//         </div>

//         {/* ── PENDING ITEMS SECTION ── */}
//         <div style={{ marginBottom: 24 }}>
//           <div
//             style={{
//               background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
//               borderRadius: 12,
//               padding: "12px 16px",
//               marginBottom: 12,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <Clock size={18} color="#fff" />
//               <div>
//                 <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Pending Items</div>
//                 <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
//                   {pendingItems.length} items waiting for collection
//                   {locallyCollectedIds.size > 0 && (
//                     <span style={{ marginLeft: 8, background: "rgba(255,255,255,0.2)", padding: "1px 8px", borderRadius: 10 }}>
//                       {locallyCollectedIds.size} selected
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 8 }}>
//               {locallyCollectedIds.size > 0 && (
//                 <button
//                   onClick={handleCancelAll}
//                   style={{
//                     background: "rgba(239, 68, 68, 0.8)",
//                     border: "1px solid rgba(239, 68, 68, 0.5)",
//                     color: "#fff",
//                     padding: "6px 14px",
//                     borderRadius: 8,
//                     fontSize: 11,
//                     fontWeight: 600,
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                   }}
//                   onMouseEnter={(e) => e.target.style.background = "rgba(239, 68, 68, 1)"}
//                   onMouseLeave={(e) => e.target.style.background = "rgba(239, 68, 68, 0.8)"}
//                 >
//                   Cancel All
//                 </button>
//               )}
//               {selectedChaser && pendingItems.length > 0 && (
//                 <button
//                   onClick={handleCollectAll}
//                   style={{
//                     background: "rgba(255,255,255,0.2)",
//                     border: "1px solid rgba(255,255,255,0.3)",
//                     color: "#fff",
//                     padding: "6px 14px",
//                     borderRadius: 8,
//                     fontSize: 11,
//                     fontWeight: 600,
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                   }}
//                   onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
//                   onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
//                 >
//                   Select All
//                 </button>
//               )}
//             </div>
//           </div>

//           {pendingItems.length === 0 ? (
//             <div
//               style={{
//                 background: "#f0fdf4",
//                 borderRadius: 12,
//                 padding: "32px 20px",
//                 textAlign: "center",
//                 border: "1px dashed #86efac",
//               }}
//             >
//               <CheckCircle2 size={32} color="#10b981" />
//               <div style={{ fontSize: 15, color: "#059669", marginTop: 8, fontWeight: 600 }}>All caught up!</div>
//               <div style={{ fontSize: 13, color: "#6ee7b7", marginTop: 4 }}>No pending items to collect.</div>
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               {pendingItems.map((item, idx) => {
//                 const isLocallyCollected = locallyCollectedIds.has(item.id);
                
//                 return (
//                   <div
//                     key={item.id}
//                     style={{
//                       background: "#fff",
//                       borderRadius: 16,
//                       boxShadow: "0 2px 12px rgba(0,74,173,0.07)",
//                       border: isLocallyCollected ? "2px solid #10b981" : "2px solid #fbbf24",
//                       overflow: "hidden",
//                       transition: "all 0.2s",
//                       opacity: isLocallyCollected ? 0.85 : 1,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         padding: "10px 16px",
//                         background: isLocallyCollected ? "rgba(16,185,129,0.08)" : "rgba(251, 191, 36, 0.08)",
//                       }}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//                         <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>#{idx + 1}</span>
//                         <button
//                           onClick={() => handleLocalCollection(item.id)}
//                           style={{
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             padding: 0,
//                             display: "inline-flex",
//                             transition: "transform 0.2s",
//                           }}
//                           onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
//                           onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
//                         >
//                           {isLocallyCollected ? (
//                             <CheckCircle2 size={18} color="#10b981" />
//                           ) : (
//                             <Square size={18} color="#f59e0b" />
//                           )}
//                         </button>
//                         {isLocallyCollected && (
//                           <span
//                             style={{
//                               fontSize: 10,
//                               background: "#d1fae5",
//                               color: "#059669",
//                               padding: "1px 10px",
//                               borderRadius: 12,
//                               fontWeight: 700,
//                               letterSpacing: "0.5px",
//                             }}
//                           >
//                             READY TO COLLECT
//                           </span>
//                         )}
//                         <span
//                           className={getBadgeClasses(item.status)}
//                           style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}
//                         >
//                           {item.status}
//                         </span>
//                         {!isLocallyCollected && (
//                           <span
//                             style={{
//                               fontSize: 10,
//                               background: "#fef3c7",
//                               color: "#d97706",
//                               padding: "1px 10px",
//                               borderRadius: 12,
//                               fontWeight: 700,
//                               letterSpacing: "0.5px",
//                             }}
//                           >
//                             PENDING
//                           </span>
//                         )}
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                         <span style={{ fontSize: 11, color: "#94a3b8" }}>
//                           {item.serialNo ? `#${item.serialNo}` : ""}
//                         </span>
//                       </div>
//                     </div>

//                     <div style={{ padding: "12px 16px" }}>
//                       <p
//                         style={{
//                           fontWeight: 600,
//                           fontSize: 14,
//                           color: isLocallyCollected ? "#94a3b8" : "#1e293b",
//                           marginBottom: 8,
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 6,
//                           textDecoration: isLocallyCollected ? "line-through" : "none",
//                         }}
//                       >
//                         <FileText size={12} color="#64748b" />
//                         {item.description || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>No description</span>}
//                       </p>

//                       <div style={{ marginBottom: 8 }}>
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
//                           <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Chaser Remark</div>
//                           {savingRemarkForId === item.id && (
//                             <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#0ea5e9" }}>
//                               <Loader2 size={12} className="cdp-spin" />
//                               Saving...
//                             </div>
//                           )}
//                           {isLocallyCollected && (
//                             <div style={{ fontSize: 10, color: "#10b981", background: "#d1fae5", padding: "1px 8px", borderRadius: 4 }}>
//                               Will be collected
//                             </div>
//                           )}
//                         </div>
//                         <textarea
//                           value={item.remarkDraft || ""}
//                           onChange={(e) => handleRemarkChange(item.id, e.target.value)}
//                           placeholder={item.remark && item.remark.trim() ? `Current: ${item.remark}. Type update then click Update.` : "Type remark then click Update."}
//                           rows={2}
//                           style={{
//                             width: "100%",
//                             resize: "vertical",
//                             fontSize: 12,
//                             padding: "6px 8px",
//                             borderRadius: 8,
//                             border: "1px solid #e2e8f0",
//                             outline: "none",
//                             fontFamily: "inherit",
//                             background: isLocallyCollected ? "#f0fdf4" : "#ffffff",
//                           }}
//                         />
//                         <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end", gap: 8 }}>
//                           {isLocallyCollected && (
//                             <button
//                               onClick={() => handleLocalCollection(item.id)}
//                               style={{
//                                 background: "none",
//                                 border: "1px solid #ef4444",
//                                 color: "#ef4444",
//                                 padding: "6px 12px",
//                                 borderRadius: 8,
//                                 fontSize: 12,
//                                 fontWeight: 600,
//                                 cursor: "pointer",
//                                 transition: "all 0.2s",
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.target.style.background = "#ef4444";
//                                 e.target.style.color = "#fff";
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.target.style.background = "none";
//                                 e.target.style.color = "#ef4444";
//                               }}
//                             >
//                               Cancel Collection
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleRemarkUpdate(item.id)}
//                             disabled={savingRemarkForId === item.id}
//                             style={{
//                               background: isLocallyCollected 
//                                 ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
//                                 : "linear-gradient(135deg, #004AAD 0%, #1d4ed8 100%)",
//                               color: "#fff",
//                               border: "none",
//                               padding: "6px 16px",
//                               borderRadius: 8,
//                               fontSize: 12,
//                               fontWeight: 600,
//                               cursor: savingRemarkForId === item.id ? "not-allowed" : "pointer",
//                               boxShadow: isLocallyCollected 
//                                 ? "0 3px 10px rgba(5,150,105,0.3)"
//                                 : "0 3px 10px rgba(0,74,173,0.25)",
//                               transition: "all 0.2s",
//                               minWidth: isLocallyCollected ? "140px" : "80px",
//                             }}
//                           >
//                             {isLocallyCollected ? "Collect & Update" : "Update"}
//                           </button>
//                         </div>
//                       </div>

//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", fontSize: 12, color: "#64748b" }}>
//                         {item.endUser && (
//                           <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                             <User size={10} /> <b>Chaser:</b> {item.endUser}
//                           </span>
//                         )}
//                         {item.moc && (
//                           <span>
//                             <b>MOC:</b>{" "}
//                             <span style={{ background: "rgba(0,74,173,0.08)", color: "#004AAD", fontWeight: 700, padding: "1px 6px", borderRadius: 4, fontSize: 11 }}>
//                               {item.moc}
//                             </span>
//                           </span>
//                         )}
//                         {item.jobNo && (
//                           <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                             <FileText size={10} /> <b>Job No:</b> {item.jobNo}
//                           </span>
//                         )}
//                         {item.poNo && (
//                           <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                             <Package size={10} /> <b>PO No:</b> {item.poNo}
//                           </span>
//                         )}
//                         {item.supplierCode && (
//                           <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
//                             <Truck size={10} /> <b>Supplier Code:</b> {item.supplierCode}
//                           </span>
//                         )}
//                         {item.SupplierAddress && (
//                           <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
//                             <Truck size={10} /> <b>Supplier Address:</b> {item.SupplierAddress}
//                           </span>
//                         )}
//                         {item.Sup_Contact && (
//                           <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
//                             <Truck size={10} /> <b>Contact No:</b> {item.Sup_Contact}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* ── COLLECTED ITEMS SECTION ── */}
//         {collectedItems.length > 0 && (
//           <div style={{ marginTop: 8 }}>
//             <div
//               style={{
//                 background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                 borderRadius: 12,
//                 padding: "12px 16px",
//                 marginBottom: 12,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <CheckCircle2 size={18} color="#fff" />
//                 <div>
//                   <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Collected Items</div>
//                   <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
//                     {collectedItems.length} items collected
//                   </div>
//                 </div>
//               </div>
//               <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
//                 {selectedChaser ? `Showing ${selectedChaser}'s collections` : "All collections"}
//               </div>
//             </div>

//             {selectedChaser && itemsByChaser[selectedChaser] ? (
//               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                 {itemsByChaser[selectedChaser].map((item, idx) => (
//                   <div
//                     key={item.id}
//                     style={{
//                       background: "#fff",
//                       borderRadius: 16,
//                       boxShadow: "0 2px 12px rgba(0,74,173,0.07)",
//                       border: "1px solid #86efac",
//                       opacity: 0.85,
//                       overflow: "hidden",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         padding: "10px 16px",
//                         background: "rgba(16,185,129,0.06)",
//                       }}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//                         <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>#{idx + 1}</span>
//                         <CheckCircle2 size={18} color="#10b981" />
//                         <span
//                           className={getBadgeClasses(item.status)}
//                           style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}
//                         >
//                           {item.status}
//                         </span>
//                         <span
//                           style={{
//                             fontSize: 10,
//                             background: "#d1fae5",
//                             color: "#059669",
//                             padding: "1px 10px",
//                             borderRadius: 12,
//                             fontWeight: 700,
//                             letterSpacing: "0.5px",
//                           }}
//                         >
//                           COLLECTED
//                         </span>
//                       </div>
//                       <div style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
//                         <User size={12} />
//                         {item.collectedByChaser}
//                       </div>
//                     </div>

//                     <div style={{ padding: "12px 16px" }}>
//                       <p
//                         style={{
//                           fontWeight: 600,
//                           fontSize: 14,
//                           textDecoration: "line-through",
//                           color: "#94a3b8",
//                           marginBottom: 8,
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 6,
//                         }}
//                       >
//                         <FileText size={12} color="#94a3b8" />
//                         {item.description || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>No description</span>}
//                       </p>

//                       <div style={{ marginBottom: 8 }}>
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
//                           <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Chaser Remark</div>
//                           {item.remark && (
//                             <span style={{ fontSize: 10, color: "#10b981", background: "#d1fae5", padding: "1px 8px", borderRadius: 4 }}>
//                               Saved
//                             </span>
//                           )}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: 12,
//                             color: "#475569",
//                             padding: "6px 8px",
//                             background: "#f8fafc",
//                             borderRadius: 8,
//                             border: "1px solid #e2e8f0",
//                             minHeight: "40px",
//                           }}
//                         >
//                           {item.remark || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>No remark</span>}
//                         </div>
//                       </div>

//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", fontSize: 12, color: "#64748b" }}>
//                         {item.endUser && (
//                           <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                             <User size={10} /> <b>Chaser:</b> {item.endUser}
//                           </span>
//                         )}
//                         {item.moc && (
//                           <span>
//                             <b>MOC:</b>{" "}
//                             <span style={{ background: "rgba(0,74,173,0.08)", color: "#004AAD", fontWeight: 700, padding: "1px 6px", borderRadius: 4, fontSize: 11 }}>
//                               {item.moc}
//                             </span>
//                           </span>
//                         )}
//                         {item.jobNo && (
//                           <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                             <FileText size={10} /> <b>Job No:</b> {item.jobNo}
//                           </span>
//                         )}
//                         {item.poNo && (
//                           <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                             <Package size={10} /> <b>PO No:</b> {item.poNo}
//                           </span>
//                         )}
//                         {item.supplierCode && (
//                           <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
//                             <Truck size={10} /> <b>Supplier Code:</b> {item.supplierCode}
//                           </span>
//                         )}
//                         {item.SupplierAddress && (
//                           <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
//                             <Truck size={10} /> <b>Supplier Address:</b> {item.SupplierAddress}
//                           </span>
//                         )}
//                         {item.Sup_Contact && (
//                           <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
//                             <Truck size={10} /> <b>Contact No:</b> {item.Sup_Contact}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   borderRadius: 12,
//                   padding: "24px 16px",
//                   textAlign: "center",
//                   border: "1px dashed #e2e8f0",
//                 }}
//               >
//                 <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
//                 <div style={{ color: "#64748b", fontSize: 14 }}>
//                   No items collected by <strong>{selectedChaser || "selected chaser"}</strong>
//                 </div>
//                 <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
//                   Collect pending items above to see them here
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  ClipboardList,
  Package,
  Truck,
  FileText,
  Square,
  Loader2,
  Clock,
  ChevronDown,
} from "lucide-react";

import CommonService from "../../service/CommonService";
import {
  CHASER_OPTIONS,
  getBadgeClasses,
  formatDateForApi,
  normalizeStatusFromApi,
  mapStatusForApi,
  normalizeMocValue,
  splitJobNoValue,
  InjectStyles,
  SearchableSelect,
} from "./Shared";

// ─────────────────────────────────────────────
// Expandable Card — compact row + full details
// ─────────────────────────────────────────────
function ChaserCard({ item, idx, isLocallyCollected, savingRemarkForId, onToggleCollect, onRemarkChange, onRemarkUpdate, getBadgeClasses }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,74,173,0.07)",
        border: isLocallyCollected ? "2px solid #10b981" : "2px solid #fbbf24",
        overflow: "hidden",
        transition: "all 0.2s",
        opacity: isLocallyCollected ? 0.9 : 1,
      }}
    >
      {/* ── Compact summary row (always visible) ── */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          cursor: "pointer",
          background: isLocallyCollected ? "rgba(16,185,129,0.08)" : "rgba(251,191,36,0.08)",
          userSelect: "none",
        }}
      >
        {/* Left: all text content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top micro row: index, checkbox, badges, PO */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, flexShrink: 0 }}>
              #{idx + 1}
            </span>

            {/* Checkbox toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleCollect(item.id); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", flexShrink: 0 }}
              aria-label="Toggle collection"
            >
              {isLocallyCollected
                ? <CheckCircle2 size={16} color="#10b981" />
                : <Square size={16} color="#f59e0b" />}
            </button>

            {isLocallyCollected && (
              <span style={{ fontSize: 10, background: "#d1fae5", color: "#059669", padding: "1px 8px", borderRadius: 12, fontWeight: 700, flexShrink: 0 }}>
                READY
              </span>
            )}

            <span
              className={getBadgeClasses(item.status)}
              style={{ padding: "1px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0 }}
            >
              {item.status}
            </span>

            {item.poNo && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "#004AAD", flexShrink: 0 }}>
                {item.poNo}
              </span>
            )}
          </div>

          {/* Description — full wrap */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: isLocallyCollected ? "#94a3b8" : "#1e293b",
              textDecoration: isLocallyCollected ? "line-through" : "none",
              lineHeight: 1.4,
              marginBottom: 2,
              wordBreak: "break-word",
            }}
          >
            {item.description || (
              <span style={{ color: "#cbd5e1", fontStyle: "italic", fontWeight: 400 }}>No description</span>
            )}
          </div>

          {/* Supplier name — full wrap */}
          {item.suppliername && (
            <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "flex-start", gap: 4, lineHeight: 1.4, wordBreak: "break-word" }}>
              <Truck size={11} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
              {item.suppliername}
            </div>
          )}
        </div>

        {/* Right: chevron */}
        <ChevronDown
          size={15}
          color="#94a3b8"
          style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {/* ── Expanded detail panel ── */}
      {open && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,74,173,0.06)" }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: isLocallyCollected ? "#94a3b8" : "#1e293b",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
              textDecoration: isLocallyCollected ? "line-through" : "none",
            }}
          >
            <FileText size={12} color="#64748b" />
            {item.description || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>No description</span>}
          </p>

          {/* Remark textarea */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Chaser Remark</div>
              {savingRemarkForId === item.id && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#0ea5e9" }}>
                  <Loader2 size={12} className="cdp-spin" />
                  Saving...
                </div>
              )}
              {isLocallyCollected && (
                <div style={{ fontSize: 10, color: "#10b981", background: "#d1fae5", padding: "1px 8px", borderRadius: 4 }}>
                  Will be collected
                </div>
              )}
            </div>
            <textarea
              value={item.remarkDraft || ""}
              onChange={(e) => onRemarkChange(item.id, e.target.value)}
              placeholder={item.remark?.trim() ? `Current: ${item.remark}. Type update then click Update.` : "Type remark then click Update."}
              rows={2}
              style={{
                width: "100%",
                resize: "vertical",
                fontSize: 12,
                padding: "6px 8px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                outline: "none",
                fontFamily: "inherit",
                background: isLocallyCollected ? "#f0fdf4" : "#ffffff",
                boxSizing: "border-box",
              }}
            />
            <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              {isLocallyCollected && (
                <button
                  onClick={() => onToggleCollect(item.id)}
                  style={{
                    background: "none",
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => onRemarkUpdate(item.id)}
                disabled={savingRemarkForId === item.id}
                style={{
                  background: isLocallyCollected
                    ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                    : "linear-gradient(135deg, #004AAD 0%, #1d4ed8 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: savingRemarkForId === item.id ? "not-allowed" : "pointer",
                  minWidth: isLocallyCollected ? 140 : 80,
                }}
              >
                {isLocallyCollected ? "Collect & Update" : "Update"}
              </button>
            </div>
          </div>

          {/* Detail grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", fontSize: 12, color: "#64748b" }}>
            {item.endUser && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <User size={10} /> <b>Chaser:</b> {item.endUser}
              </span>
            )}
            {item.moc && (
              <span>
                <b>MOC:</b>{" "}
                <span style={{ background: "rgba(0,74,173,0.08)", color: "#004AAD", fontWeight: 700, padding: "1px 6px", borderRadius: 4, fontSize: 11 }}>
                  {item.moc}
                </span>
              </span>
            )}
            {item.jobNo && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <FileText size={10} /> <b>Job No:</b> {item.jobNo}
              </span>
            )}
            {item.poNo && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Package size={10} /> <b>PO No:</b> {item.poNo}
              </span>
            )}
            {item.supplierCode && (
              <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
                <Truck size={10} /> <b>Supplier Code:</b> {item.supplierCode}
              </span>
            )}
            {item.suppliername && (
              <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
                <Truck size={10} /> <b>Supplier Name:</b> {item.suppliername}
              </span>
            )}
            {item.SupplierAddress && (
              <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
                <Truck size={10} /> <b>Supplier Address:</b> {item.SupplierAddress}
              </span>
            )}
            {item.Sup_Contact && (
              <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}>
                <Truck size={10} /> <b>Contact No:</b> {item.Sup_Contact}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Collected Card — compact row + expandable
// ─────────────────────────────────────────────
function CollectedCard({ item, idx, getBadgeClasses }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,74,173,0.07)",
        border: "1px solid #86efac",
        overflow: "hidden",
        opacity: 0.85,
      }}
    >
      {/* Compact row */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          cursor: "pointer",
          background: "rgba(16,185,129,0.06)",
          userSelect: "none",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top micro row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, flexShrink: 0 }}>#{idx + 1}</span>
            <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0 }} />
            <span
              className={getBadgeClasses(item.status)}
              style={{ padding: "1px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0 }}
            >
              {item.status}
            </span>
            <span style={{ fontSize: 10, background: "#d1fae5", color: "#059669", padding: "1px 8px", borderRadius: 12, fontWeight: 700, flexShrink: 0 }}>
              COLLECTED
            </span>
            {item.poNo && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "#004AAD", flexShrink: 0 }}>{item.poNo}</span>
            )}
          </div>

          {/* Description — full wrap */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#94a3b8",
              textDecoration: "line-through",
              lineHeight: 1.4,
              marginBottom: 2,
              wordBreak: "break-word",
            }}
          >
            {item.description || <span style={{ fontStyle: "italic", fontWeight: 400 }}>No description</span>}
          </div>

          {/* Supplier name — full wrap */}
          {item.suppliername && (
            <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "flex-start", gap: 4, lineHeight: 1.4, wordBreak: "break-word" }}>
              <Truck size={11} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
              {item.suppliername}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {item.collectedByChaser && (
            <span style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 3 }}>
              <User size={11} /> {item.collectedByChaser}
            </span>
          )}
          <ChevronDown
            size={15}
            color="#94a3b8"
            style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,74,173,0.06)" }}>
          <p style={{ fontWeight: 600, fontSize: 14, textDecoration: "line-through", color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <FileText size={12} color="#94a3b8" />
            {item.description || <span style={{ fontStyle: "italic" }}>No description</span>}
          </p>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Chaser Remark</div>
              {item.remark && (
                <span style={{ fontSize: 10, color: "#10b981", background: "#d1fae5", padding: "1px 8px", borderRadius: 4 }}>Saved</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#475569", padding: "6px 8px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", minHeight: 40 }}>
              {item.remark || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>No remark</span>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", fontSize: 12, color: "#64748b" }}>
            {item.endUser && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><User size={10} /> <b>Chaser:</b> {item.endUser}</span>}
            {item.moc && <span><b>MOC:</b> <span style={{ background: "rgba(0,74,173,0.08)", color: "#004AAD", fontWeight: 700, padding: "1px 6px", borderRadius: 4, fontSize: 11 }}>{item.moc}</span></span>}
            {item.jobNo && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FileText size={10} /> <b>Job No:</b> {item.jobNo}</span>}
            {item.poNo && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Package size={10} /> <b>PO No:</b> {item.poNo}</span>}
            {item.supplierCode && <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}><Truck size={10} /> <b>Supplier Code:</b> {item.supplierCode}</span>}
            {item.suppliername && <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}><Truck size={10} /> <b>Supplier Name:</b> {item.suppliername}</span>}
            {item.SupplierAddress && <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}><Truck size={10} /> <b>Supplier Address:</b> {item.SupplierAddress}</span>}
            {item.Sup_Contact && <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 4 }}><Truck size={10} /> <b>Contact No:</b> {item.Sup_Contact}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function ChaserCollectionPage() {
  const [items, setItems] = useState([]);
  const itemsRef = useRef([]);
  const [toast, setToast] = useState(null);

  const [selectedChaser, setSelectedChaser] = useState("Chaser");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [savingRemarkForId, setSavingRemarkForId] = useState(null);
  const [locallyCollectedIds, setLocallyCollectedIds] = useState(new Set());

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        const response = await CommonService.GetToDoList();
        if (response.data && response.data.ResultSet) {
          setApiData(response.data.ResultSet);
        }
      } catch (error) {
        console.error("Error fetching TODO list:", error);
      }
    };
    fetchToDoList();
  }, []);

  const toIsoDateOnly = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const fetchDailyCollect = async () => {
    setLoadingOptions(true);
    try {
      const resp = await CommonService.GetChaserDailyCollect({});
      const rawData = resp?.data?.ResultSet || resp?.data?.Result || [];

      const data = Array.isArray(rawData)
        ? rawData.filter((r) => toIsoDateOnly(r.DATE) === selectedDate)
        : [];

      if (data.length > 0) {
        const existingBySerial = new Map(
          itemsRef.current.map((it) => [String(it.serialNo ?? ""), it])
        );
        const mapped = data.map((r, idx) => {
          const id = `${(r.DATE || "").toString().replace(/\s+/g, "_")}_${r.SERIAL_NO ?? idx}_${r.PO_NO ?? ""}`;
          let dateIso = selectedDate;
          try {
            const parsed = new Date(r.DATE);
            if (!Number.isNaN(parsed.getTime())) dateIso = parsed.toISOString();
          } catch (e) {}

          const normalizedStatus = normalizeStatusFromApi(r.STATUS);
          const existingItem = existingBySerial.get(String(r.SERIAL_NO ?? ""));
          const serverRemark = r.CHASER_REMARK || r.REMARK || "";
          const remark = serverRemark || existingItem?.remark || "";
          const remarkDraft = existingItem?.remarkDraft || "";

          return {
            id,
            serialNo: r.SERIAL_NO ?? null,
            handlingAdmin: r.HANDLE_BY || r.HANDLED_BY || "",
            endUser: r.REQUEST_BY || "",
            moc: normalizeMocValue(r.MOC_NO ?? r.MOCNO ?? r.MOC ?? r.MOCNo ?? r.MOC_no),
            jobNo: (r.JCAT || "") + (r.JMAIN || ""),
            description: r.DESCRIPTION || "",
            poNo: r.PO_NO || r.PO || "",
            End_User_By: r.End_User_By,
            End_User: r.End_User,
            supplierCode: r.SUPPLIER_NAME || r.SUPPLIER_CODE || "",
            HANDLE_BY: r.HANDLE_BY || "",
            suppliername: r.Sup_Name,
            SupplierAddress: r.Sup_Address,
            pcNo: r.PC_NO || r.PCNo || r.PC || "",
            status: normalizedStatus,
            Sup_Contact: r.Sup_Contact,
            collected: normalizedStatus === "Collected",
            collectedByChaser: r.INVCOLLECTED_BY || "",
            remark,
            remarkDraft,
            date: dateIso,
          };
        });
        setItems(mapped);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching DailyCollect:", err);
      showToast("Failed to load collection list from server", "error");
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchDailyCollect();
  }, [selectedDate]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  const resolveSupplierCode = (item) => {
    const matching = apiData.find((it) => it.PO_NO === item.poNo);
    return matching?.SUPPLIER_CODE || item.supplierCode || "";
  };

  const buildChaserPayload = (item, overrides = {}) => {
    const updated = { ...item, ...overrides };
    const { jobCat, jobMain } = splitJobNoValue(updated.jobNo, "", "");
    const payloadDate = updated.date || selectedDate;

    let adminServiceNo = "";
    if (updated.handlingAdmin) {
      const adminMatch = updated.handlingAdmin.match(/^(\d+)/);
      if (adminMatch) adminServiceNo = adminMatch[1];
    }

    return {
      P_MDD_DATE: formatDateForApi(payloadDate),
      P_MDD_SERIAL_NO: updated.serialNo,
      P_MDD_HANDLE_BY: adminServiceNo || updated.handlingAdmin || "",
      P_MDD_REQUEST_BY: updated.endUser || "",
      P_MDD_MOC_NO: normalizeMocValue(updated.moc),
      P_MDD_JCAT: jobCat,
      P_MDD_JMAIN: jobMain,
      P_MDD_DESCRIPTION: updated.description || "",
      P_MDD_PO_NO: updated.poNo || "",
      P_MDD_SUPPLIER_CODE: resolveSupplierCode(updated),
      P_MDD_CHASER_REMARK: updated.remark || "",
      P_MDD_STATUS: mapStatusForApi(updated.status),
      P_MDD_PC_NO: updated.pcNo || "",
      P_MDD_INVCOLLECTED_BY: updated.endUser || "",
    };
  };

  const updateChaserItem = async (itemId, overrides = {}, successToast) => {
    const currentItem = items.find((it) => it.id === itemId);
    if (!currentItem) return;

    const serialNo = currentItem.serialNo;
    if (!serialNo) {
      showToast("Serial number is required to update.", "error");
      return;
    }

    const payload = buildChaserPayload(currentItem, overrides);
    try {
      const resp = await CommonService.UpdateDailyCollect(payload);
      const serverStatus = resp?.status ?? resp?.data?.statusCode ?? resp?.data?.StatusCode;
      if (serverStatus === 200 || resp?.status === 200) {
        setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, ...overrides } : it)));
        if (successToast) showToast(successToast);
        fetchDailyCollect();
      } else {
        showToast("Update failed on server.", "error");
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.Message ?? err?.response?.data?.message ?? err.message ?? "Network error";
      showToast(serverMsg || "Update failed.", "error");
    }
  };

  const handleLocalCollection = (itemId) => {
    setLocallyCollectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleRemarkUpdate = async (itemId) => {
    const currentItem = items.find((it) => it.id === itemId);
    if (!currentItem) return;

    setSavingRemarkForId(itemId);

    const draft = currentItem.remarkDraft || "";
    const nextRemark = draft.trim() ? draft : currentItem.remark || "";
    const shouldCollect = locallyCollectedIds.has(itemId);

    const overrides = { remark: nextRemark, remarkDraft: "" };

    if (shouldCollect) {
      overrides.collected = true;
      overrides.collectedByChaser = selectedChaser;
      overrides.collectedAt = new Date().toISOString();
      overrides.status = "Collected";
    }

    await updateChaserItem(itemId, overrides, shouldCollect ? "Item collected and remark updated!" : "Remark updated");

    setLocallyCollectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });

    setSavingRemarkForId(null);
  };

  function handleRemarkChange(itemId, remarkText) {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, remarkDraft: remarkText } : it))
    );
  }

  const handleCollectAll = () => {
    if (!selectedChaser) { showToast("Please select a chaser first!", "error"); return; }
    if (pendingItems.length === 0) { showToast("No pending items to collect!", "error"); return; }
    setLocallyCollectedIds(new Set(pendingItems.map((item) => item.id)));
    showToast(`${pendingItems.length} items marked. Click Update on each to confirm.`, "success");
  };

  const handleCancelAll = () => {
    if (locallyCollectedIds.size === 0) { showToast("No items to cancel", "error"); return; }
    setLocallyCollectedIds(new Set());
    showToast("All selections cancelled", "success");
  };

  const pendingItems = items.filter((item) => !item.collected);
  const collectedItems = items.filter((item) => item.collected);

  const itemsByChaser = collectedItems.reduce((acc, item) => {
    if (item.collectedByChaser) {
      if (!acc[item.collectedByChaser]) acc[item.collectedByChaser] = [];
      acc[item.collectedByChaser].push(item);
    }
    return acc;
  }, {});

  return (
    <div className="cdp-dot-bg" style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <InjectStyles />

      {toast && (
        <div
          className="cdp-toast-in"
          style={{
            position: "fixed", top: 16, right: 16, zIndex: 100,
            background: toast.type === "error" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff", padding: "12px 20px", borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)", fontSize: 14, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.msg}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "20px 16px 32px" }}>
        {/* Date selector */}
        <div
          style={{
            background: "#ffffff", borderRadius: 14, padding: "10px 14px 12px",
            marginBottom: 16, boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
            border: "1px solid rgba(148,163,184,0.25)", display: "flex", gap: 10, flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 160px" }}>
            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4, fontWeight: 600 }}>
              <Calendar size={12} style={{ marginRight: 4 }} />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: 10, padding: "8px 10px", color: "#0f172a", fontSize: 13, outline: "none",
              }}
            />
          </div>
        </div>

        {/* ── PENDING ITEMS SECTION ── */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderRadius: 12, padding: "12px 16px", marginBottom: 12,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={18} color="#fff" />
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Pending Items</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
                  {pendingItems.length} items waiting for collection
                  {locallyCollectedIds.size > 0 && (
                    <span style={{ marginLeft: 8, background: "rgba(255,255,255,0.2)", padding: "1px 8px", borderRadius: 10 }}>
                      {locallyCollectedIds.size} selected
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {locallyCollectedIds.size > 0 && (
                <button
                  onClick={handleCancelAll}
                  style={{ background: "rgba(239,68,68,0.8)", border: "1px solid rgba(239,68,68,0.5)", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel All
                </button>
              )}
              {selectedChaser && pendingItems.length > 0 && (
                <button
                  onClick={handleCollectAll}
                  style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                >
                  Select All
                </button>
              )}
            </div>
          </div>

          {loadingOptions ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
              <Loader2 size={28} color="#f59e0b" className="cdp-spin" style={{ margin: "0 auto 10px" }} />
              <div style={{ fontSize: 13, color: "#64748b" }}>Loading items...</div>
            </div>
          ) : pendingItems.length === 0 ? (
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "32px 20px", textAlign: "center", border: "1px dashed #86efac" }}>
              <CheckCircle2 size={32} color="#10b981" />
              <div style={{ fontSize: 15, color: "#059669", marginTop: 8, fontWeight: 600 }}>All caught up!</div>
              <div style={{ fontSize: 13, color: "#6ee7b7", marginTop: 4 }}>No pending items to collect.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pendingItems.map((item, idx) => (
                <ChaserCard
                  key={item.id}
                  item={item}
                  idx={idx}
                  isLocallyCollected={locallyCollectedIds.has(item.id)}
                  savingRemarkForId={savingRemarkForId}
                  onToggleCollect={handleLocalCollection}
                  onRemarkChange={handleRemarkChange}
                  onRemarkUpdate={handleRemarkUpdate}
                  getBadgeClasses={getBadgeClasses}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── COLLECTED ITEMS SECTION ── */}
        {collectedItems.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderRadius: 12, padding: "12px 16px", marginBottom: 12,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={18} color="#fff" />
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Collected Items</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>{collectedItems.length} items collected</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                {selectedChaser ? `Showing ${selectedChaser}'s collections` : "All collections"}
              </div>
            </div>

            {selectedChaser && itemsByChaser[selectedChaser] ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {itemsByChaser[selectedChaser].map((item, idx) => (
                  <CollectedCard key={item.id} item={item} idx={idx} getBadgeClasses={getBadgeClasses} />
                ))}
              </div>
            ) : (
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "24px 16px", textAlign: "center", border: "1px dashed #e2e8f0" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
                <div style={{ color: "#64748b", fontSize: 14 }}>
                  No items collected by <strong>{selectedChaser || "selected chaser"}</strong>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Collect pending items above to see them here</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}