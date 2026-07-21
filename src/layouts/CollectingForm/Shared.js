import React, { useState, useEffect, useRef } from "react";

// ─── Constants ──────────────────────────────────────────────────────────────
export const MOC_OPTIONS = ["PE", "EM", "PM", "ON", "NC", "CA", "SR", "BS", "OR", "CP"];
export const STATUS_OPTIONS = ["Pending", "Collected", "Not Available", "Partial"];

export const ADMIN_OPTIONS = [
  { serviceNo: "2005593", name: "K.M.O.S.ELAPATHA", letter: "A" },
  { serviceNo: "2005117", name: "H.A.D.LAKMAL", letter: "B" },
  { serviceNo: "2205654", name: "W.A.COLAMBAGE", letter: "M" },
  { serviceNo: "2005114", name: "W.M.R.R.WIJESINGHE", letter: "Q" },
  { serviceNo: "2203769", name: "R.A.W.P.RANASINGHA", letter: "R" },
  { serviceNo: "2005479", name: "S.D.ABEYA GUNASEKARA", letter: "S" },
  { serviceNo: "2305680", name: "G.R.R.D.ABEYSINGHE", letter: "U" },
];

export const END_USER_OPTIONS = [
  { serviceNo: "2005115", name: "D.O. VITHARANA" },
  { serviceNo: "2005185", name: "W.T.S.G.CHAMINDA" },
];

export const CHASER_OPTIONS = [
  { serviceNo: "2005115", name: "D.O. VITHARANA" },
  { serviceNo: "2005185", name: "W.T.S.G.CHAMINDA" },
  { serviceNo: "0004086", name: "Lahiru Chathuranga" },
];

export const defaultForm = {
  handlingAdmin: "",
  endUser: "",
  endUserServiceNo: "",
  endUserText: "",
  moc: "",
  jobNo: "",
  description: "",
  poNo: "",
  supplierName: "",
  pcNo: "",
  status: "Pending",
  collectedByChaser: "",
  remark: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getBadgeClasses(status) {
  const map = {
    Collected: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    "Not Available": "bg-red-100 text-red-800",
    Partial: "bg-blue-100 text-blue-800",
  };
  return map[status] ?? "bg-slate-100 text-slate-700";
}

export function extractLetterFromPoNo(poNo) {
  if (!poNo) return null;
  const match = poNo.match(/^([A-Z])/);
  return match ? match[1] : null;
}

export function getAdminByLetter(letter) {
  if (!letter) return null;
  return ADMIN_OPTIONS.find((admin) => admin.letter === letter) || null;
}

export function formatDateForApi(iso) {
  try {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  } catch (e) {
    return iso;
  }
}

export function normalizeStatusFromApi(raw) {
  if (!raw) return "Pending";
  if (raw === "C" || raw === "Collected" || raw === "Completed") return "Collected";
  if (raw === "P" || raw === "Pending") return "Pending";
  if (raw === "N" || raw === "Not Available") return "Not Available";
  if (raw === "PA" || raw === "Partial") return "Partial";
  return raw;
}

export function mapStatusForApi(s) {
  if (!s) return "P";
  if (s === "Pending") return "P";
  if (s === "Collected" || s === "Completed") return "C";
  if (s === "Not Available") return "N";
  if (s === "Partial") return "PA";
  return s;
}

export function normalizeMocValue(value) {
  if (value == null) return "";
  const str = String(value).trim();
  if (!str || str.toLowerCase() === "null") return "";
  return str;
}

export function splitJobNoValue(jobNoValue, fallbackCat = "", fallbackMain = "") {
  if (jobNoValue && typeof jobNoValue === "string") {
    const trimmed = jobNoValue.trim();
    if (trimmed.length >= 2) {
      return { jobCat: trimmed.slice(0, 2), jobMain: trimmed.slice(2) };
    }
  }
  return { jobCat: fallbackCat, jobMain: fallbackMain };
}

// ─── Extract service number from a formatted option string ────────────────────
export function extractServiceNo(value) {
  if (!value) return "";
  if (typeof value === "object" && value.serviceNo) return value.serviceNo;
  const match = String(value).match(/^(\d+)/);
  return match ? match[1] : String(value);
}

// ─── Global CSS (inject once) ─────────────────────────────────────────────────
export const GLOBAL_CSS = `
  @keyframes cdp-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes cdp-fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes cdp-slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  @keyframes cdp-popIn {
    0%   { opacity: 0; transform: scale(0.92) translateY(8px); }
    100% { opacity: 1; transform: scale(1)    translateY(0);   }
  }
  @keyframes cdp-toastIn {
    0%   { opacity: 0; transform: translateY(-8px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes cdp-spin {
    to { transform: rotate(360deg); }
  }
  .cdp-fade-in  { animation: cdp-fadeIn  0.5s ease forwards; }
  .cdp-slide-in { animation: cdp-slideIn 0.35s ease forwards; }
  .cdp-pop-in   { animation: cdp-popIn   0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .cdp-toast-in { animation: cdp-toastIn 0.3s ease forwards; }
  .cdp-spin     { animation: cdp-spin 0.8s linear infinite; }

  .cdp-shimmer-card {
    background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.8);
    box-shadow: 0 4px 24px rgba(0,74,173,0.06);
    position: relative;
    overflow: hidden;
  }
  .cdp-shimmer-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: cdp-shimmer 1.8s infinite;
    border-radius: 20px;
  }

  .cdp-dot-bg {
    background-color: #f8faff;
    background-image: radial-gradient(rgba(0,74,173,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .cdp-input:focus { border-color: #004AAD; outline: none; }

  .cdp-header-top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
  }

  .cdp-header-meta {
    text-align: right;
    min-width: 140px;
  }

  @media (max-width: 768px) {
    .cdp-mobile-card { margin-bottom: 12px; }
  }

  @media (max-width: 640px) {
    .cdp-header-top-row {
      flex-direction: column;
      align-items: flex-start;
    }
    .cdp-header-meta {
      text-align: left;
      min-width: 0;
      margin-top: 6px;
    }
  }
`;

export function InjectStyles() {
  useEffect(() => {
    if (document.getElementById("cdp-styles")) return;
    const style = document.createElement("style");
    style.id = "cdp-styles";
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);
  return null;
}

// ─── Shared input style ───────────────────────────────────────────────────────
export const inputSx = {
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  padding: "9px 12px",
  fontSize: 14,
  outline: "none",
  color: "#1e293b",
  background: "#fff",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
  width: "100%",
};

// ─── Field wrapper ─────────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Searchable Select ──────────────────────────────────────────────────────
export function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "-- Select --",
  id,
  usePrimaryPlaceholderStyle = true,
  keepPrimaryBackgroundAfterSelect = false,
  primaryBackgroundColor = "#1976d2",
  displayValue = null,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = options.filter((o) => {
    const searchStr = typeof o === "object" ? o.name + " " + o.serviceNo : o;
    return searchStr.toLowerCase().includes(query.toLowerCase());
  });

  const isPlaceholder = !value;
  const usePrimary = usePrimaryPlaceholderStyle && (isPlaceholder || keepPrimaryBackgroundAfterSelect);

  const displayText = () => {
    if (!value) return placeholder;
    if (displayValue) return displayValue;
    if (typeof value === "object") return `${value.serviceNo} - ${value.name}`;
    return value;
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => { setOpen((s) => !s); setQuery(""); }}
        onKeyDown={(e) => { if (e.key === "Enter") { setOpen((s) => !s); setQuery(""); } }}
        style={{
          ...inputSx,
          height: 40,
          padding: "0 12px",
          background: usePrimary ? primaryBackgroundColor : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        id={id}
      >
        <div style={{ color: usePrimary ? "#ffffff" : "#0f172a", flex: 1 }}>{displayText()}</div>
        <div style={{ marginLeft: 8, color: usePrimary ? "#e0f2fe" : "#64748b" }}>{open ? "▴" : "▾"}</div>
      </div>

      {open && (
        <div style={{ position: "absolute", left: 0, right: 0, zIndex: 60 }}>
          <div
            style={{
              padding: 8,
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 8px 30px rgba(2,6,23,0.12)",
              border: "1px solid rgba(2,6,23,0.06)",
            }}
          >
            <input
              autoFocus
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                marginBottom: 8,
                borderRadius: 8,
                border: "1px solid #e6eefc",
                outline: "none",
                fontSize: 13,
              }}
            />
            <div style={{ maxHeight: 220, overflow: "auto" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 8, color: "#94a3b8" }}>No results</div>
              ) : (
                filtered.map((opt) => {
                  const label = typeof opt === "object" ? `${opt.serviceNo} - ${opt.name}` : opt;
                  return (
                    <div
                      key={typeof opt === "object" ? opt.serviceNo : opt}
                      onClick={() => { onChange(opt); setOpen(false); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { onChange(opt); setOpen(false); } }}
                      style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#0f172a" }}
                      role="button"
                      tabIndex={0}
                    >
                      {label}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}