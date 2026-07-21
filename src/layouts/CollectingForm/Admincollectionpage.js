import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  Edit,
  Plus,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  ClipboardList,
  Package,
  Truck,
  Users,
  FileText,
  Clock,
  Loader2,
  ChevronDown,
} from "lucide-react";

import CommonService from "../../service/CommonService";
import {
  ADMIN_OPTIONS,
  END_USER_OPTIONS,
  CHASER_OPTIONS,
  STATUS_OPTIONS,
  defaultForm,
  generateId,
  getBadgeClasses,
  extractLetterFromPoNo,
  getAdminByLetter,
  formatDateForApi,
  normalizeStatusFromApi,
  mapStatusForApi,
  normalizeMocValue,
  splitJobNoValue,
  extractServiceNo,
  InjectStyles,
  inputSx,
  Field,
  SearchableSelect,
} from "./Shared";

const formFields = [
  ["moc", "MOC", "text"],
  ["jobNo", "Job No", "text"],
  ["description", "Description *", "text"],
  ["supplierName", "Supplier Name & Location", "text"],
  ["status", "Status", "status"],
];

function CollectionCard({ item, idx, onEdit, getBadgeClasses }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,74,173,0.07)",
        border: item.collected
          ? "1px solid #86efac"
          : "1px solid rgba(0,74,173,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          cursor: "pointer",
          background: item.collected
            ? "rgba(16,185,129,0.06)"
            : "rgba(0,74,173,0.03)",
          userSelect: "none",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, flexShrink: 0 }}>
              #{idx + 1}
            </span>
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
              color: item.collected ? "#94a3b8" : "#1e293b",
              textDecoration: item.collected ? "line-through" : "none",
              lineHeight: 1.4,
              marginBottom: 2,
              wordBreak: "break-word",
            }}
          >
            {item.description || (
              <span style={{ color: "#cbd5e1", fontStyle: "italic", fontWeight: 400 }}>
                No description
              </span>
            )}
          </div>

          {/* Supplier name — full wrap */}
          {item.suppliername && (
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                display: "flex",
                alignItems: "flex-start",
                gap: 4,
                lineHeight: 1.4,
                wordBreak: "break-word",
              }}
            >
              <Truck size={11} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
              {item.suppliername}
            </div>
          )}
        </div>

        {/* Right: edit + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
            aria-label={`Edit item ${idx + 1}`}
          >
            <Edit size={15} color="#004AAD" />
          </button>
          <ChevronDown
            size={15}
            color="#94a3b8"
            style={{
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      {/* ── Full detail panel (shown when expanded) ── */}
      {open && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(0,74,173,0.06)",
          }}
        >
          {/* Description heading */}
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              textDecoration: item.collected ? "line-through" : "none",
              color: item.collected ? "#94a3b8" : "#1e293b",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FileText size={12} color="#64748b" />
            {item.description || (
              <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>
                No description
              </span>
            )}
          </p>

          {/* Chaser remark */}
          <div
            style={{
              marginBottom: 8,
              fontSize: 11,
              color: "#0f172a",
              background: "#eef2ff",
              padding: "4px 8px",
              borderRadius: 6,
            }}
          >
            <b>Chaser Remark:</b>{" "}
            {item.remark && item.remark.trim()
              ? item.remark
              : "No remark from chaser"}
          </div>

          {/* Detail grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px 16px",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            {item.HANDLE_BY && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={10} /> <b>Handle By:</b> {item.HANDLE_BY}
              </span>
            )}
            {item.endUser && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <User size={10} /> <b>Request By:</b> {item.endUser}
              </span>
            )}
            {item.moc && (
              <span>
                <span
                  style={{
                    background: "rgba(0,74,173,0.08)",
                    color: "#004AAD",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                >
                  {item.moc}
                </span>
              </span>
            )}
            {item.End_User_By && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <FileText size={10} /> <b>End User By:</b> {item.End_User_By}
              </span>
            )}
            {item.End_User && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <FileText size={10} /> <b>Chaser:</b> {item.End_User}
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
            {item.serialNo && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <b>SN:</b> {item.serialNo}
              </span>
            )}
            {item.supplierCode && (
              <span
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Truck size={10} /> <b>Supplier Code:</b> {item.supplierCode}
              </span>
            )}
            {item.suppliername && (
              <span
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Truck size={10} /> <b>Supplier Name:</b> {item.suppliername}
              </span>
            )}
            {item.SupplierAddress && (
              <span
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Truck size={10} /> <b>Supplier Address:</b>{" "}
                {item.SupplierAddress}
              </span>
            )}
            {item.Sup_Contact && (
              <span
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Truck size={10} /> <b>Contact No:</b> {item.Sup_Contact}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCollectionPage() {
  const [view, setView] = useState("list");
  const [items, setItems] = useState([]);
  const itemsRef = useRef([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);

  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedChaser, setSelectedChaser] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filteredItems, setFilteredItems] = useState([]);

  const [poOptions, setPoOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    let filtered = items;

    if (selectedAdmin) {
      const adminServiceNo = extractServiceNo(selectedAdmin);
      filtered = filtered.filter(
        (item) =>
          item.HANDLE_BY === adminServiceNo ||
          item.handlingAdmin === selectedAdmin ||
          extractServiceNo(item.handlingAdmin) === adminServiceNo
      );
    }

    if (selectedChaser) {
      const chaserServiceNo = extractServiceNo(selectedChaser);
      filtered = filtered.filter(
        (item) =>
          item.endUserServiceNo === chaserServiceNo ||
          item.CHASER_ID === chaserServiceNo ||
          item.collectedByChaser === chaserServiceNo
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (a.collected === b.collected) return 0;
      return a.collected ? 1 : -1;
    });

    setFilteredItems(filtered);
  }, [items, selectedAdmin, selectedChaser]);

  useEffect(() => {
    const fetchToDoList = async () => {
      setLoadingOptions(true);
      try {
        const response = await CommonService.GetToDoList();
        if (response.data && response.data.ResultSet) {
          const data = response.data.ResultSet;
          setApiData(data);

          const uniquePoNos = [
            ...new Set(data.map((item) => item.PO_NO).filter(Boolean)),
          ];
          setPoOptions(uniquePoNos);

          const uniqueSuppliers = [
            ...new Set(
              data.map((item) => item.SUPPLIER_NAME).filter(Boolean)
            ),
          ];
          setSupplierOptions(uniqueSuppliers);
        }
      } catch (error) {
        console.error("Error fetching TODO list:", error);
        showToast("Failed to load options from API", "error");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchToDoList();
  }, []);

  const fetchDailyCollect = async () => {
    setLoadingOptions(true);
    try {
      const resp = await CommonService.GetDailyCollect({
        date: formatDateForApi(selectedDate),
      });
      const data =
        resp?.data?.ResultSet || resp?.data?.Result || [];
      if (Array.isArray(data) && data.length > 0) {
        const existingBySerial = new Map(
          itemsRef.current.map((it) => [String(it.serialNo ?? ""), it])
        );

        const mapped = data.map((r, idx) => {
          const id = `${(r.DATE || "")
            .toString()
            .replace(/\s+/g, "_")}_${r.SERIAL_NO ?? idx}_${r.PO_NO ?? ""}`;

          let dateIso = selectedDate;
          try {
            const parsed = new Date(r.DATE);
            if (!Number.isNaN(parsed.getTime()))
              dateIso = parsed.toISOString();
          } catch (e) {}

          const normalizedStatus = normalizeStatusFromApi(r.STATUS);
          const existingItem = existingBySerial.get(
            String(r.SERIAL_NO ?? "")
          );
          const serverRemark = r.CHASER_REMARK || r.REMARK || "";
          const remark = serverRemark || existingItem?.remark || "";

          return {
            id,
            serialNo: r.SERIAL_NO ?? null,
            HANDLE_BY: r.HANDLE_BY || "",
            CHASER_ID: r.CHASER_ID || "",
            handlingAdmin: r.HANDLE_BY || r.HANDLED_BY || "",
            endUser: r.REQUEST_BY || "",
            endUserServiceNo: r.REQUEST_BY || "",
            moc: normalizeMocValue(
              r.MOC_NO ?? r.MOCNO ?? r.MOC ?? r.MOCNo ?? r.MOC_no
            ),
            jobNo: (r.JCAT || "") + (r.JMAIN || ""),
            description: r.DESCRIPTION || "",
            poNo: r.PO_NO || r.PO || "",
            End_User_By: r.End_User_By,
            End_User: r.End_User,
            supplierCode: r.SUPPLIER_NAME || r.SUPPLIER_CODE || "",
            suppliername: r.Sup_Name,
            SupplierAddress: r.Sup_Address,
            Sup_Contact: r.Sup_Contact,
            pcNo: r.PC_NO || r.PCNo || r.PC || "",
            status: normalizedStatus,
            collected: normalizedStatus === "Collected",
            collectedByChaser: r.INVCOLLECTED_BY || "",
            remark,
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

  useEffect(() => {
    if (form.poNo && apiData.length > 0) {
      const matchingItem = apiData.find((item) => item.PO_NO === form.poNo);
      if (matchingItem) {
        const mocValue =
          matchingItem.MOCNO ??
          matchingItem.MOC_NO ??
          matchingItem.MOCNo ??
          matchingItem.MOC_no ??
          matchingItem.MOC ??
          matchingItem.moc ??
          null;
        const normalizedMoc =
          mocValue && String(mocValue).toLowerCase() !== "null"
            ? String(mocValue)
            : "";

        setForm((prev) => ({
          ...prev,
          supplierName: matchingItem.SUPPLIER_NAME || prev.supplierName,
          moc: normalizedMoc || prev.moc,
          jobNo:
            matchingItem.JCAT && matchingItem.JMAIN
              ? `${matchingItem.JCAT}${matchingItem.JMAIN}`
              : prev.jobNo,
        }));
      }

      const letter = extractLetterFromPoNo(form.poNo);
      if (letter) {
        const admin = getAdminByLetter(letter);
        if (admin) {
          const adminValue = `${admin.serviceNo}  `;
          setSelectedAdmin(adminValue);
          setForm((prev) => ({ ...prev, handlingAdmin: adminValue }));
        }
      }
    }
  }, [form.poNo, apiData]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  async function handleSubmit() {
    if (!form.description.trim()) {
      showToast("Description is required!", "error");
      return;
    }

    let existingRemark = "";
    if (editId) {
      const existingItem = items.find((it) => it.id === editId);
      if (existingItem && existingItem.remark)
        existingRemark = existingItem.remark;
    }

    const newItem = {
      ...form,
      id: editId || generateId(),
      collected: false,
      date: selectedDate,
      handlingAdmin: selectedAdmin,
      remark: form.remark || existingRemark,
    };

    const matchingItem =
      apiData.find((it) => it.PO_NO === form.poNo) || {};
    const existingItem = editId
      ? items.find((it) => it.id === editId)
      : null;
    const serialNo = editId
      ? form.serialNo ?? existingItem?.serialNo ?? null
      : null;

    if (editId && !serialNo) {
      showToast("Serial number is required to update.", "error");
      return;
    }

    const { jobCat, jobMain } = splitJobNoValue(
      form.jobNo,
      matchingItem.JCAT || "",
      matchingItem.JMAIN || ""
    );
    const payloadDate = editId
      ? form.date || selectedDate
      : selectedDate;

    const adminServiceNo = extractServiceNo(selectedAdmin);
    const chaserServiceNo = extractServiceNo(selectedChaser);

    const payload = {
      P_MDD_DATE: formatDateForApi(payloadDate),
      P_MDD_CHASER_ID: chaserServiceNo || "1",
      P_MDD_HANDLE_BY: adminServiceNo || form.handlingAdmin || "",
      P_MDD_REQUEST_BY: form.endUserServiceNo || form.endUser || "",
      P_MDD_MOC_NO:
        normalizeMocValue(form.moc) ||
        normalizeMocValue(existingItem?.moc) ||
        normalizeMocValue(matchingItem.MOCNO) ||
        normalizeMocValue(matchingItem.MOC_NO),
      P_MDD_JCAT: jobCat,
      P_MDD_JMAIN: jobMain,
      P_MDD_DESCRIPTION: form.description || "",
      P_MDD_PO_NO: form.poNo || "",
      P_MDD_SUPPLIER_CODE:
        matchingItem.SUPPLIER_CODE || form.supplierName || "",
      P_MDD_CHASER_REMARK: form.remark || "",
      P_MDD_STATUS: mapStatusForApi(form.status),
      P_MDD_PC_NO: form.pcNo || "",
      P_MDD_INVCOLLECTED_BY: form.collectedByChaser || "",
    };

    if (editId && serialNo) {
      payload.P_MDD_SERIAL_NO = serialNo;
    }

    let apiOk = false;
    let successMsg = "";
    setIsSubmitting(true);
    try {
      const resp = editId
        ? await CommonService.UpdateDailyCollect(payload)
        : await CommonService.PostDailyCollect(payload);

      const serverStatus =
        resp?.status ?? resp?.data?.statusCode ?? resp?.data?.StatusCode;
      const serverMsg =
        resp?.data?.Message ??
        resp?.data?.message ??
        resp?.data?.resultMessage ??
        null;

      if (serverStatus === 200 || resp?.status === 200) {
        apiOk = true;
        successMsg = serverMsg || "";
      } else if (resp && resp.data) {
        console.warn("Server returned non-200:", resp);
        showToast(
          serverMsg || "Server returned an error while saving.",
          "error"
        );
      }
    } catch (err) {
      const serverMsg =
        err?.response?.data?.Message ??
        err?.response?.data?.message ??
        err.message ??
        "Network error";
      console.error("PostDailyCollect failed:", err);
      showToast(serverMsg || "Failed to save to server.", "error");
    } finally {
      setIsSubmitting(false);
    }

    if (!apiOk) return;

    if (editId) {
      setItems((prev) =>
        prev.map((it) => (it.id === editId ? newItem : it))
      );
      showToast(successMsg || "Item updated successfully!");
    } else {
      setItems((prev) => [...prev, newItem]);
      showToast(successMsg || "Item added successfully!");
    }

    fetchDailyCollect();
    setForm(defaultForm);
    setEditId(null);
    setSelectedAdmin("");
    setView("list");
  }

  function handleEdit(item) {
    setForm({ ...item });
    setEditId(item.id);
    setSelectedAdmin(item.handlingAdmin);
    setView("form");
  }

  function handleNew() {
    setForm(defaultForm);
    setEditId(null);
    setSelectedAdmin("");
    setView("form");
  }

  const collected = filteredItems.filter((i) => i.collected).length;
  const pending = filteredItems.filter((i) => !i.collected).length;
  const total = filteredItems.length;

  const adminDisplayValue = selectedAdmin
    ? ADMIN_OPTIONS.find(
        (a) =>
          `${a.serviceNo} - ${a.name}` === selectedAdmin ||
          a.serviceNo === extractServiceNo(selectedAdmin)
      )
      ? selectedAdmin
      : selectedAdmin
    : "";

  const chaserDisplayValue = selectedChaser
    ? typeof selectedChaser === "object"
      ? `${selectedChaser.serviceNo} `
      : selectedChaser
    : "";

  return (
    <div
      className="cdp-dot-bg"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <InjectStyles />

      {/* Toast */}
      {toast && (
        <div
          className="cdp-toast-in"
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 100,
            background:
              toast.type === "error"
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
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
            <XCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          {toast.msg}
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "20px 16px 32px",
        }}
      >
        {/* ── Header / stats / selectors ── */}
        <div
          style={{
            borderRadius: 16,
            background: "linear-gradient(135deg, #5B52B3 0%, #004AAD 100%)",
            padding: "12px 14px 18px",
            marginBottom: 20,
            boxShadow: "0 6px 18px rgba(15,23,42,0.25)",
            color: "#ffffff",
          }}
        >
          <div className="cdp-header-top-row">
            <div
              style={{
                marginTop: 2,
                fontSize: 15,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ClipboardList size={16} />
              Daily Collection Detail Sheet
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
              alignItems: "center",
            }}
          >
            {[
              { icon: <ClipboardList size={14} />, label: "Total Items", value: total },
              { icon: <Clock size={14} />, label: "Pending", value: pending },
              { icon: <CheckCircle2 size={14} />, label: "Collected", value: collected },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  background: "rgba(15,23,42,0.12)",
                  borderRadius: 8,
                  padding: "6px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                {icon}
                <div>
                  <div style={{ fontSize: 10, opacity: 0.85 }}>{label}</div>
                  <div style={{ fontWeight: 700 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Date / Admin selectors */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              flexWrap: "nowrap",
              paddingBottom: 6,
            }}
          >
            {/* Date */}
            <div style={{ flex: "1 1 0", minWidth: 0 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                <Calendar size={12} style={{ marginRight: 4 }} />
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
                  borderRadius: 10,
                  padding: "9px 12px",
                  color: "#fff",
                  fontSize: 13,
                  outline: "none",
                  height: 40,
                  boxSizing: "border-box",
                  WebkitAppearance: "none",
                }}
              />
            </div>

            {/* Admin */}
            <div style={{ flex: "1 1 0", minWidth: 0 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                <Users size={12} style={{ marginRight: 4 }} />
                Select Admin
              </label>
              <div style={{ height: 40 }}>
                <SearchableSelect
                  options={[{ serviceNo: "", name: " Admins" }, ...ADMIN_OPTIONS]}
                  value={selectedAdmin}
                  onChange={(v) => {
                    if (typeof v === "object" && v.serviceNo === "") {
                      setSelectedAdmin("");
                    } else {
                      const formatted =
                        typeof v === "object" ? `${v.serviceNo}` : v;
                      setSelectedAdmin(formatted);
                    }
                  }}
                  placeholder="Admins"
                  id="select-admin-header"
                  keepPrimaryBackgroundAfterSelect
                  primaryBackgroundColor="#004AAD"
                  displayValue={adminDisplayValue || " Admins"}
                />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedAdmin || selectedChaser) && (
            <div
              style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}
            >
              {selectedAdmin && (
                <span
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Users size={10} />
                  {selectedAdmin}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedAdmin("")}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedAdmin("")}
                    style={{ cursor: "pointer", opacity: 0.8, marginLeft: 2 }}
                  >
                    ✕
                  </span>
                </span>
              )}
              {selectedChaser && (
                <span
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Truck size={10} />
                  {chaserDisplayValue}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedChaser("")}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedChaser("")
                    }
                    style={{ cursor: "pointer", opacity: 0.8, marginLeft: 2 }}
                  >
                    ✕
                  </span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.95)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(0,74,173,0.06)",
            border: "1px solid rgba(0,74,173,0.06)",
          }}
        >
          {[
            ["list", <><ClipboardList size={14} /> Collection List</>],
            [
              "form",
              editId ? (
                <><Edit size={14} /> Edit Item</>
              ) : (
                <><Plus size={14} /> Add Item</>
              ),
            ],
          ].map(([v, label]) => (
            <button
              key={v}
              onClick={() => (v === "form" ? handleNew() : setView("list"))}
              style={{
                flex: 1,
                border: "none",
                padding: "9px 12px",
                borderRadius: 9,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: view === v ? 700 : 500,
                background:
                  view === v
                    ? "linear-gradient(135deg, #004AAD 0%, #1d4ed8 100%)"
                    : "transparent",
                color: view === v ? "#fff" : "#64748b",
                boxShadow: view === v ? "0 2px 8px rgba(0,74,173,0.25)" : "none",
                transition: "all 0.25s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Form view ── */}
        {view === "form" && (
          <div className="cdp-pop-in" style={{ opacity: 0 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                boxShadow: "0 4px 24px rgba(0,74,173,0.08)",
                border: "1px solid rgba(0,74,173,0.06)",
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderBottom: "1px solid rgba(0,74,173,0.08)",
                  paddingBottom: 16,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(0,74,173,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {editId ? (
                    <Edit size={18} color="#004AAD" />
                  ) : (
                    <Plus size={18} color="#004AAD" />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                    {editId ? "Edit Collection Item" : "New Collection Item"}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Fill in the details below
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Field label="PO No">
                  <SearchableSelect
                    options={poOptions}
                    value={form.poNo}
                    onChange={(v) => setForm({ ...form, poNo: v })}
                    placeholder={loadingOptions ? "Loading..." : "Select PO No"}
                    id="po-poNo-form"
                    usePrimaryPlaceholderStyle={false}
                  />
                </Field>
              </div>

              <div style={{ marginBottom: 20 }}>
                <Field label="Handling Admin (Auto-set from PO No)">
                  <SearchableSelect
                    options={ADMIN_OPTIONS}
                    value={selectedAdmin}
                    onChange={(v) => {
                      const formatted =
                        typeof v === "object"
                          ? `${v.serviceNo} - ${v.name}`
                          : v;
                      setSelectedAdmin(formatted);
                      setForm((prev) => ({
                        ...prev,
                        handlingAdmin: formatted,
                      }));
                    }}
                    placeholder="-- Select Admin --"
                    id="select-admin-form"
                    usePrimaryPlaceholderStyle={false}
                    displayValue={selectedAdmin}
                  />
                </Field>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 14,
                }}
              >
                {formFields.map(([key, label, type]) => (
                  <Field key={key} label={label}>
                    {type === "status" ? (
                      <SearchableSelect
                        options={STATUS_OPTIONS}
                        value={form[key]}
                        onChange={(v) => setForm({ ...form, [key]: v })}
                        placeholder="Select status"
                        id={`status-${key}`}
                      />
                    ) : (
                      <input
                        className="cdp-input"
                        style={inputSx}
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        placeholder={label.replace(" *", "")}
                      />
                    )}
                  </Field>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 20,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAdmin || isSubmitting}
                  style={{
                    background: selectedAdmin
                      ? "linear-gradient(135deg, #004AAD 0%, #1d4ed8 100%)"
                      : "#cbd5e1",
                    color: "#fff",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor:
                      selectedAdmin && !isSubmitting
                        ? "pointer"
                        : "not-allowed",
                    boxShadow: selectedAdmin
                      ? "0 4px 12px rgba(0,74,173,0.3)"
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="cdp-spin" />
                      {editId ? "Updating..." : "Saving..."}
                    </>
                  ) : editId ? (
                    <>
                      <Edit size={14} />
                      Update Item
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Item
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setView("list");
                    setForm(defaultForm);
                    setEditId(null);
                    setSelectedAdmin("");
                  }}
                  style={{
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 10,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <XCircle size={14} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── List view ── */}
        {view === "list" && (
          <div className="cdp-fade-in" style={{ opacity: 0 }}>
            {loadingOptions ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "48px 24px",
                  textAlign: "center",
                  boxShadow: "0 4px 24px rgba(0,74,173,0.06)",
                }}
              >
                <Loader2
                  size={32}
                  color="#004AAD"
                  className="cdp-spin"
                  style={{ margin: "0 auto 12px" }}
                />
                <div style={{ fontSize: 14, color: "#64748b" }}>
                  Loading collection data...
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "48px 24px",
                  textAlign: "center",
                  boxShadow: "0 4px 24px rgba(0,74,173,0.06)",
                }}
              >
                <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
                <div
                  style={{ fontSize: 16, color: "#64748b", marginBottom: 8 }}
                >
                  No collection items found
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    marginBottom: 20,
                  }}
                >
                  {selectedAdmin || selectedChaser
                    ? "No items match the selected filters"
                    : "No items for the selected date"}
                </div>
                <button
                  onClick={handleNew}
                  style={{
                    background:
                      "linear-gradient(135deg, #004AAD 0%, #1d4ed8 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Plus size={14} />
                  Add First Item
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredItems.map((item, idx) => (
                  <CollectionCard
                    key={item.id}
                    item={item}
                    idx={idx}
                    onEdit={handleEdit}
                    getBadgeClasses={getBadgeClasses}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}