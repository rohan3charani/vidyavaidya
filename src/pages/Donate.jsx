import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Donate.css";

/* ── DATA ───────────────────────────────────────────────── */
const ONETIME_CATEGORIES = [
    {
        id: "edu",
        icon: "",
        label: "Education Support",
        options: [
            { amount: 1000, tag: "Books" },
            { amount: 5000, tag: "Fees" },
            { amount: 10000, tag: "Semester" },
        ],
    },
    {
        id: "health",
        icon: "",
        label: "Healthcare Support",
        options: [
            { amount: 2000, tag: "Treatment" },
            { amount: 7000, tag: "Surgery" },
            { amount: 15000, tag: "Emergency" },
        ],
    },
    {
        id: "community",
        icon: "",
        label: "Community Welfare",
        options: [
            { amount: 500, tag: "Food" },
            { amount: 3000, tag: "Nutrition" },
        ],
    },
];

const MONTHLY_PLANS = [300, 1000, 3000, 5000];
const DURATIONS = [3, 6, 12];

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) => 2025 - i);

const QUERY_TYPES = [
    "General Inquiry",
    "Donation Process",
    "Tax Benefits (FCRA)",
    "Partnership / Collaboration",
    "Volunteer Abroad",
    "Others",
];

/* ── VALIDATION ─────────────────────────────────────────── */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v) => /^\d{10}$/.test(v);
const isValidPAN = (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.trim().toUpperCase());
const isValidPin = (v) => /^\d{6}$/.test(v);

/* ── COMPONENT ───────────────────────────────────────────── */
export default function Donate() {
    const navigate = useNavigate();

    /* redirect if not logged in */
    useEffect(() => {
        if (!localStorage.getItem("vv_auth")) {
            localStorage.setItem("vv_redirect", "/donate");
            navigate("/auth");
        }
    }, [navigate]);

    const [tab, setTab] = useState("onetime");

    /* One-time — MULTI-SELECT */
    const [selectedAmounts, setSelectedAmounts] = useState([]);
    const [customAmount, setCustomAmount] = useState("");

    /* Monthly */
    const [monthlyAmount, setMonthlyAmount] = useState(0);
    const [duration, setDuration] = useState(12);

    /* Common form */
    const [form, setForm] = useState({
        fullName: "", email: "", mobile: "", pan: "", isAlumni: false,
        alumniId: "", yearOfGrad: "",
        address: "", city: "", state: "", country: "India", pincode: "",
    });
    const [errors, setErrors] = useState({});

    /* Foreign donor form */
    const [foreignForm, setForeignForm] = useState({
        firstName: "", lastName: "", email: "", phone: "", queryType: "", message: "",
    });
    const [foreignErrors, setForeignErrors] = useState({});
    const [foreignSubmitted, setForeignSubmitted] = useState(false);

    /* ── Total amount calculation ── */
    const customAmountNum = customAmount ? parseInt(customAmount, 10) || 0 : 0;
    const oneTimeTotalAmount = selectedAmounts.reduce((acc, val) => acc + val, 0) + customAmountNum;
    const displayAmount = tab === "monthly" ? monthlyAmount : oneTimeTotalAmount;

    /* ── Toggle multi-select card ── */
    const toggleAmount = (amount) => {
        setSelectedAmounts((prev) =>
            prev.includes(amount) ? prev.filter((a) => a !== amount) : [...prev, amount]
        );
    };

    /* ── Helpers ── */
    const setField = (key, val) => {
        setForm((p) => ({ ...p, [key]: val }));
        setErrors((p) => ({ ...p, [key]: "" }));
    };

    const setForeignField = (key, val) => {
        setForeignForm((p) => ({ ...p, [key]: val }));
        setForeignErrors((p) => ({ ...p, [key]: "" }));
    };

    /* ── Validation (common form) ── */
    const validateCommon = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!isValidEmail(form.email)) e.email = "Enter a valid email";
        if (!form.mobile.trim()) e.mobile = "Mobile number is required";
        else if (!isValidPhone(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
        if (form.pan && !isValidPAN(form.pan)) e.pan = "PAN format: ABCDE1234F";
        if (form.isAlumni && !form.alumniId.trim()) e.alumniId = "Alumni ID is required";
        if (form.isAlumni && !form.yearOfGrad) e.yearOfGrad = "Select your graduation year";
        if (!form.address.trim()) e.address = "Address is required";
        if (!form.city.trim()) e.city = "City is required";
        if (!form.state) e.state = "State is required";
        if (!form.pincode.trim()) e.pincode = "Pincode is required";
        else if (!isValidPin(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
        return e;
    };

    /* ── Continue handler ── */
    const handleContinue = () => {
        if (displayAmount <= 0) {
            alert("Please select or enter a donation amount.");
            return;
        }
        const e = validateCommon();
        setErrors(e);
        if (Object.keys(e).length === 0) {
            navigate("/payment", {
                state: {
                    amount: displayAmount,
                    isMonthly: tab === "monthly",
                },
            });
        }
    };

    const isContinueEnabled = displayAmount > 0;

    /* ── Foreign donor ── */
    const validateForeign = () => {
        const e = {};
        if (!foreignForm.firstName.trim()) e.firstName = "Required";
        if (!foreignForm.lastName.trim()) e.lastName = "Required";
        if (!foreignForm.email.trim()) e.email = "Required";
        else if (!isValidEmail(foreignForm.email)) e.email = "Invalid email";
        if (!foreignForm.phone.trim()) e.phone = "Required";
        if (!foreignForm.queryType) e.queryType = "Select a query type";
        return e;
    };

    const handleForeignSubmit = () => {
        const e = validateForeign();
        setForeignErrors(e);
        if (Object.keys(e).length === 0) setForeignSubmitted(true);
    };

    /* ── Render ── */
    return (
        <div className="donate-page">

            {/* ══ LEFT PANEL ══ */}
            <div className="donate-left">
                <div className="donate-left-overlay" />
                <img
                    src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&q=80"
                    alt="Children in a classroom"
                    className="donate-left-bg"
                />
                <div className="donate-left-content">
                    <div className="donate-left-inner">
                        <h1 className="donate-brand">VidyaVaidya</h1>
                        <p className="donate-tagline">Educate. Heal. Empower.</p>
                        <p className="donate-desc">
                            VidyaVaidya is committed to uplifting underprivileged communities through
                            education and healthcare. Every donation creates real impact in someone's life.
                        </p>
                        <div className="donate-stats">
                            {[
                                { num: "15K+", label: "Lives Impacted" },
                                { num: "5K+", label: "Students Educated" },
                                { num: "2K+", label: "Medical Cases Supported" },
                            ].map(({ num, label }) => (
                                <div className="donate-stat" key={label}>
                                    <span className="donate-stat-num">{num}</span>
                                    <span className="donate-stat-label">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ RIGHT PANEL ══ */}
            <div className="donate-right">
                <div className="donate-form-wrap">

                    {/* RIGHT SECTION HEADING */}
                    <div className="donate-right-header">
                        <h2 className="donate-right-heading">VidyaVaidya Donations</h2>
                        <p className="donate-right-subheading">
                            Support education and healthcare for a better tomorrow
                        </p>
                    </div>

                    {/* TABS */}
                    <div className="donate-tabs">
                        {[
                            { key: "onetime", label: "One Time" },
                            { key: "monthly", label: "Monthly" },
                            { key: "foreign", label: "Foreign Donor" },
                        ].map((t) => (
                            <button
                                key={t.key}
                                className={`donate-tab-btn ${tab === t.key ? "active" : ""}`}
                                onClick={() => setTab(t.key)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ── ONE TIME ── */}
                    {tab === "onetime" && (
                        <div className="donate-section">
                            <h2 className="donate-section-heading">Make a One-Time Impact</h2>
                            {ONETIME_CATEGORIES.map((cat) => (
                                <div key={cat.id} className="donate-category">
                                    <p className="donate-cat-label">
                                        <span>{cat.icon}</span> {cat.label}
                                    </p>
                                    <div className="donate-amount-grid">
                                        {cat.options.map(({ amount, tag }) => {
                                            const isSelected = selectedAmounts.includes(amount);
                                            return (
                                                <button
                                                    key={amount}
                                                    className={`donate-amount-card ${isSelected ? "selected" : ""}`}
                                                    onClick={() => toggleAmount(amount)}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && <span className="dac-check">✓</span>}
                                                    <span className="dac-tag">{tag}</span>
                                                    <span className="dac-amount">₹{amount.toLocaleString("en-IN")}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Custom amount */}
                            <div className="donate-custom-wrap">
                                <span className="donate-custom-symbol">₹</span>
                                <input
                                    type="number"
                                    className="donate-custom-input"
                                    placeholder="Enter custom amount"
                                    value={customAmount}
                                    min={1}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                />
                            </div>

                            {/* Running total chip */}
                            {oneTimeTotalAmount > 0 && (
                                <div className="donate-running-total">
                                    <span>Running total:</span>
                                    <strong>₹{oneTimeTotalAmount.toLocaleString("en-IN")}</strong>
                                    {selectedAmounts.length > 0 && (
                                        <button className="donate-clear-btn" onClick={() => { setSelectedAmounts([]); setCustomAmount(""); }}>
                                            Clear
                                        </button>
                                    )}
                                </div>
                            )}

                            <CommonForm form={form} errors={errors} setField={setField} />
                        </div>
                    )}

                    {/* ── MONTHLY ── */}
                    {tab === "monthly" && (
                        <div className="donate-section">
                            <h2 className="donate-section-heading">Sustain Change Monthly</h2>
                            <div className="donate-monthly-grid">
                                {MONTHLY_PLANS.map((plan) => (
                                    <button
                                        key={plan}
                                        className={`donate-monthly-card ${monthlyAmount === plan ? "selected" : ""}`}
                                        onClick={() => setMonthlyAmount(plan)}
                                    >
                                        <span className="dmc-amount">₹{plan.toLocaleString("en-IN")}</span>
                                        <span className="dmc-freq">/month</span>
                                    </button>
                                ))}
                            </div>
                            <div className="donate-duration-row">
                                <label htmlFor="duration">Donate for:</label>
                                <select
                                    id="duration"
                                    className="donate-select"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                >
                                    {DURATIONS.map((d) => (
                                        <option key={d} value={d}>{d} months</option>
                                    ))}
                                </select>
                            </div>
                            {monthlyAmount > 0 && (
                                <p className="donate-total-note">
                                    Total commitment: ₹{(monthlyAmount * duration).toLocaleString("en-IN")} over {duration} months
                                </p>
                            )}
                            <CommonForm form={form} errors={errors} setField={setField} />
                        </div>
                    )}

                    {/* ── FOREIGN DONOR ── */}
                    {tab === "foreign" && (
                        <div className="donate-section">
                            <h2 className="donate-section-heading">Foreign Donor Registration</h2>
                            <p className="donate-foreign-sub">
                                If you are a passport holder of a country other than India, please fill this form.
                            </p>

                            {foreignSubmitted ? (
                                <div className="donate-foreign-success">
                                    <div>✅</div>
                                    <h3>Thank you!</h3>
                                    <p>We have received your inquiry and will get back to you within 3 business days.</p>
                                    <button
                                        className="donate-foreign-reset"
                                        onClick={() => {
                                            setForeignSubmitted(false);
                                            setForeignForm({ firstName: "", lastName: "", email: "", phone: "", queryType: "", message: "" });
                                        }}
                                    >
                                        Submit Another
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="donate-form-grid-2">
                                        <FormField label="First Name" required error={foreignErrors.firstName}>
                                            <input className={`df-input ${foreignErrors.firstName ? "err" : ""}`} value={foreignForm.firstName} onChange={(e) => setForeignField("firstName", e.target.value)} placeholder="First Name" />
                                        </FormField>
                                        <FormField label="Last Name" required error={foreignErrors.lastName}>
                                            <input className={`df-input ${foreignErrors.lastName ? "err" : ""}`} value={foreignForm.lastName} onChange={(e) => setForeignField("lastName", e.target.value)} placeholder="Last Name" />
                                        </FormField>
                                    </div>
                                    <div className="donate-form-grid-2">
                                        <FormField label="Email" required error={foreignErrors.email}>
                                            <input type="email" className={`df-input ${foreignErrors.email ? "err" : ""}`} value={foreignForm.email} onChange={(e) => setForeignField("email", e.target.value)} placeholder="you@example.com" />
                                        </FormField>
                                        <FormField label="Phone" required error={foreignErrors.phone}>
                                            <input type="tel" className={`df-input ${foreignErrors.phone ? "err" : ""}`} value={foreignForm.phone} onChange={(e) => setForeignField("phone", e.target.value)} placeholder="+1 234 567 8900" />
                                        </FormField>
                                    </div>
                                    <FormField label="Query Type" required error={foreignErrors.queryType}>
                                        <select className={`df-input ${foreignErrors.queryType ? "err" : ""}`} value={foreignForm.queryType} onChange={(e) => setForeignField("queryType", e.target.value)}>
                                            <option value="">Select query type</option>
                                            {QUERY_TYPES.map((q) => <option key={q} value={q}>{q}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Message / Additional Inquiry" error={foreignErrors.message}>
                                        <textarea className="df-input df-textarea" rows={4} value={foreignForm.message} onChange={(e) => setForeignField("message", e.target.value)} placeholder="Tell us more about your inquiry..." />
                                    </FormField>
                                    <button className="donate-foreign-submit" onClick={handleForeignSubmit}>
                                        Submit Inquiry
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* ── STICKY BOTTOM BAR ── */}
                {tab !== "foreign" && (
                    <div className={`donate-sticky-bar ${displayAmount > 0 ? "bar-active" : ""}`}>
                        <div className="dsb-amount-info">
                            <span className="dsb-label">
                                {tab === "monthly" ? "Monthly Donation" : "Total Donation"}
                            </span>
                            <span className="dsb-value">
                                {displayAmount > 0
                                    ? `₹${displayAmount.toLocaleString("en-IN")}${tab === "monthly" ? "/month" : ""}`
                                    : "₹0"}
                            </span>
                        </div>
                        <button
                            className={`dsb-continue-btn ${!isContinueEnabled ? "disabled" : ""}`}
                            onClick={handleContinue}
                            disabled={!isContinueEnabled}
                        >
                            Continue →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── COMMON FORM ─────────────────────────────────────────── */
function CommonForm({ form, errors, setField }) {
    return (
        <div className="donate-common-form">

            {/* Alumni checkbox — always first */}
            <label className="df-checkbox-row">
                <input
                    type="checkbox"
                    checked={form.isAlumni}
                    onChange={(e) => setField("isAlumni", e.target.checked)}
                />
                <span>Are you a VidyaVaidya Alumni?</span>
            </label>

            {/* Alumni fields — directly below checkbox, conditionally */}
            {form.isAlumni && (
                <div className="df-alumni-fields">
                    <div className="donate-form-grid-2">
                        <FormField label="Alumni ID" required error={errors.alumniId}>
                            <input
                                className={`df-input ${errors.alumniId ? "err" : ""}`}
                                value={form.alumniId}
                                onChange={(e) => setField("alumniId", e.target.value)}
                                placeholder="e.g. VV-2018-042"
                            />
                        </FormField>
                        <FormField label="Year of Graduation" required error={errors.yearOfGrad}>
                            <select
                                className={`df-input ${errors.yearOfGrad ? "err" : ""}`}
                                value={form.yearOfGrad}
                                onChange={(e) => setField("yearOfGrad", e.target.value)}
                            >
                                <option value="">Select year</option>
                                {GRADUATION_YEARS.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </FormField>
                    </div>
                </div>
            )}

            {/* Personal Details */}
            <h3 className="donate-form-section-title">
                Personal Details
            </h3>
            <div className="donate-form-grid-2">
                <FormField label="Full Name" required error={errors.fullName}>
                    <input
                        className={`df-input ${errors.fullName ? "err" : ""}`}
                        value={form.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        placeholder="Your full name"
                    />
                </FormField>
                <FormField label="Email" required error={errors.email}>
                    <input
                        type="email"
                        className={`df-input ${errors.email ? "err" : ""}`}
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="you@example.com"
                    />
                </FormField>
            </div>
            <div className="donate-form-grid-2">
                <FormField label="Mobile" required error={errors.mobile}>
                    <div className="df-phone-wrap">
                        <span className="df-phone-code">+91</span>
                        <input
                            type="tel"
                            className={`df-input df-phone-input ${errors.mobile ? "err" : ""}`}
                            value={form.mobile}
                            onChange={(e) => setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="10-digit mobile"
                        />
                    </div>
                </FormField>
                <FormField label="PAN Card" error={errors.pan}>
                    <input
                        className={`df-input ${errors.pan ? "err" : ""}`}
                        value={form.pan}
                        onChange={(e) => setField("pan", e.target.value.toUpperCase().slice(0, 10))}
                        placeholder="ABCDE1234F"
                    />
                </FormField>
            </div>

            {/* Address Details */}
            <h3 className="donate-form-section-title" style={{ marginTop: "24px" }}>
                Address Details
            </h3>
            <FormField label="Address (No, Street, Area)" required error={errors.address}>
                <input
                    className={`df-input ${errors.address ? "err" : ""}`}
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="House No, Street Name, Area"
                />
            </FormField>
            <div className="donate-form-grid-2">
                <FormField label="City / District" required error={errors.city}>
                    <input
                        className={`df-input ${errors.city ? "err" : ""}`}
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="City"
                    />
                </FormField>
                <FormField label="State" required error={errors.state}>
                    <select
                        className={`df-input ${errors.state ? "err" : ""}`}
                        value={form.state}
                        onChange={(e) => setField("state", e.target.value)}
                    >
                        <option value="">Select state</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </FormField>
            </div>
            <div className="donate-form-grid-2">
                <FormField label="Country" required error={errors.country}>
                    <input
                        className="df-input"
                        value={form.country}
                        onChange={(e) => setField("country", e.target.value)}
                    />
                </FormField>
                <FormField label="Pincode" required error={errors.pincode}>
                    <input
                        className={`df-input ${errors.pincode ? "err" : ""}`}
                        value={form.pincode}
                        onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6-digit pincode"
                    />
                </FormField>
            </div>
        </div>
    );
}

/* ── FIELD WRAPPER ───────────────────────────────────────── */
function FormField({ label, required, error, children }) {
    return (
        <div className="df-field">
            <label className="df-label">
                {label}{required && <span className="df-req"> *</span>}
            </label>
            {children}
            {error && <p className="df-error">{error}</p>}
        </div>
    );
}
