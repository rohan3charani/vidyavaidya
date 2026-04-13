import { useState } from "react";
import "./PaymentModal.css";

const QR_SVG = (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="8" fill="#f5f5f5" />
        {/* Finder patterns */}
        <rect x="10" y="10" width="30" height="30" rx="2" fill="#0A1F44" />
        <rect x="15" y="15" width="20" height="20" rx="1" fill="#fff" />
        <rect x="18" y="18" width="14" height="14" rx="1" fill="#0A1F44" />

        <rect x="80" y="10" width="30" height="30" rx="2" fill="#0A1F44" />
        <rect x="85" y="15" width="20" height="20" rx="1" fill="#fff" />
        <rect x="88" y="18" width="14" height="14" rx="1" fill="#0A1F44" />

        <rect x="10" y="80" width="30" height="30" rx="2" fill="#0A1F44" />
        <rect x="15" y="85" width="20" height="20" rx="1" fill="#fff" />
        <rect x="18" y="88" width="14" height="14" rx="1" fill="#0A1F44" />

        {/* Data modules (decorative) */}
        <rect x="48" y="10" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="57" y="10" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="66" y="10" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="48" y="19" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="66" y="19" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="48" y="28" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="57" y="28" width="6" height="6" rx="1" fill="#0A1F44" />

        <rect x="10" y="48" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="19" y="48" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="28" y="57" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="10" y="66" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="19" y="57" width="6" height="6" rx="1" fill="#0A1F44" />

        <rect x="85" y="48" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="94" y="57" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="103" y="48" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="85" y="66" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="103" y="66" width="6" height="6" rx="1" fill="#0A1F44" />

        <rect x="48" y="48" width="6" height="6" rx="1" fill="#14B8A6" />
        <rect x="57" y="48" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="66" y="48" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="48" y="57" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="57" y="57" width="6" height="6" rx="1" fill="#14B8A6" />
        <rect x="66" y="57" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="48" y="66" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="66" y="66" width="6" height="6" rx="1" fill="#14B8A6" />

        <rect x="48" y="76" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="57" y="76" width="6" height="6" rx="1" fill="#14B8A6" />
        <rect x="66" y="76" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="76" y="76" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="48" y="85" width="6" height="6" rx="1" fill="#14B8A6" />
        <rect x="66" y="85" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="76" y="85" width="6" height="6" rx="1" fill="#14B8A6" />
        <rect x="48" y="94" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="76" y="94" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="85" y="85" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="94" y="76" width="6" height="6" rx="1" fill="#14B8A6" />
        <rect x="103" y="85" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="94" y="94" width="6" height="6" rx="1" fill="#0A1F44" />
        <rect x="103" y="94" width="6" height="6" rx="1" fill="#14B8A6" />
    </svg>
);

const BANKS = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
];

export default function PaymentModal({ amount, isMonthly, onClose }) {
    const [payTab, setPayTab] = useState("upi");
    const [upiId, setUpiId] = useState("");
    const [bank, setBank] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
        }, 2200);
    };

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const displayAmount = isMonthly
        ? `₹${amount}/month`
        : `₹${amount}`;

    return (
        <div className="pm-backdrop" onClick={handleBackdrop}>
            <div className="pm-modal">
                {/* LEFT – Summary */}
                <div className="pm-left">
                    <div className="pm-org-icon">🎓</div>
                    <h2 className="pm-org-name">VidyaVaidya</h2>
                    <p className="pm-org-tagline">Educate. Heal. Empower.</p>
                    <div className="pm-divider" />
                    <p className="pm-label">Donation Amount</p>
                    <p className="pm-amount">{displayAmount}</p>
                    {isMonthly && <p className="pm-monthly-note">Recurring monthly</p>}
                    <div className="pm-trust-badges">
                        <span className="pm-badge">🔒 Secure</span>
                        <span className="pm-badge">✅ Verified NGO</span>
                    </div>
                </div>

                {/* RIGHT – Payment options */}
                <div className="pm-right">
                    <div className="pm-header-row">
                        <h3 className="pm-right-heading">Complete Payment</h3>
                        <button className="pm-close-btn" onClick={onClose} aria-label="Close">✕</button>
                    </div>

                    {success ? (
                        <div className="pm-success">
                            <div className="pm-success-icon">✅</div>
                            <h3>Payment Successful!</h3>
                            <p>Thank you for your generous donation to VidyaVaidya.<br />You will receive a confirmation email shortly.</p>
                            <button className="pm-done-btn" onClick={onClose}>Done</button>
                        </div>
                    ) : (
                        <>
                            <div className="pm-tabs">
                                {[
                                    { key: "upi", label: "UPI" },
                                    { key: "card", label: "Cards" },
                                    { key: "netbanking", label: "Net Banking" },
                                ].map((t) => (
                                    <button
                                        key={t.key}
                                        className={`pm-tab-btn ${payTab === t.key ? "active" : ""}`}
                                        onClick={() => setPayTab(t.key)}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            <div className="pm-tab-content">
                                {payTab === "upi" && (
                                    <div className="pm-upi">
                                        <p className="pm-upi-heading">Scan QR to Pay</p>
                                        <div className="pm-qr-wrap">{QR_SVG}</div>
                                        <p className="pm-upi-or">— or enter UPI ID —</p>
                                        <div className="pm-input-group">
                                            <input
                                                type="text"
                                                placeholder="yourname@upi"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="pm-input"
                                            />
                                        </div>
                                    </div>
                                )}

                                {payTab === "card" && (
                                    <div className="pm-card-form">
                                        <div className="pm-input-group">
                                            <label>Card Number</label>
                                            <input type="text" placeholder="1234 5678 9012 3456" className="pm-input" maxLength={19} />
                                        </div>
                                        <div className="pm-input-row">
                                            <div className="pm-input-group">
                                                <label>Expiry</label>
                                                <input type="text" placeholder="MM / YY" className="pm-input" />
                                            </div>
                                            <div className="pm-input-group">
                                                <label>CVV</label>
                                                <input type="password" placeholder="•••" className="pm-input" maxLength={4} />
                                            </div>
                                        </div>
                                        <div className="pm-input-group">
                                            <label>Name on Card</label>
                                            <input type="text" placeholder="Full name" className="pm-input" />
                                        </div>
                                    </div>
                                )}

                                {payTab === "netbanking" && (
                                    <div className="pm-netbanking">
                                        <div className="pm-input-group">
                                            <label>Select Your Bank</label>
                                            <select
                                                className="pm-input"
                                                value={bank}
                                                onChange={(e) => setBank(e.target.value)}
                                            >
                                                <option value="">-- Choose Bank --</option>
                                                {BANKS.map((b) => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="pm-netbanking-note">
                                            You will be redirected to your bank's secure portal to complete the payment.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                className={`pm-pay-btn ${processing ? "processing" : ""}`}
                                onClick={handlePay}
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="pm-spinner-row">
                                        <span className="pm-spinner" /> Processing...
                                    </span>
                                ) : (
                                    `Pay ${displayAmount}`
                                )}
                            </button>

                            <p className="pm-secure-note">🔒 Payments are 100% encrypted and secure</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
