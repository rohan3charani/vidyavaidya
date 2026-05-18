import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CircleUserRound,
  IndianRupee,
  Mail,
  Phone,
  RefreshCw,
  Search,
  TrendingUp,
  FileText,
} from "lucide-react";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All types");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState("All status");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dynamic API State
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const fetchDashboardData = async () => {
    try {
      const profileRes = await api.user.getProfile().catch(() => ({ profile: null }));
      const statsRes = await api.user.getDashboardStats().catch(() => ({ stats: null }));
      const donationsRes = await api.user.getDonations(1, 100).catch(() => ({ donations: [] }));

      setProfile(profileRes.profile);
      setStats(statsRes.stats);
      setDonations(donationsRes.donations || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await api.auth.logout();
    navigate("/");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const handleDownloadReceipt = async (donationId) => {
    try {
      const response = await api.user.getReceiptUrl(donationId);
      if (response.success && response.receiptUrl) {
        window.open(response.receiptUrl, "_blank");
      } else {
        alert("Receipt generation is processing. Please try again in a few moments.");
      }
    } catch (err) {
      alert("Failed to retrieve tax receipt: " + err.message);
    }
  };

  // Safe defaults if API hasn't resolved yet
  const activeUser = {
    name: profile?.fullName || "VIDYA VAIDYA",
    email: profile?.email || "vidyavaidyanlr@gmail.com",
    phone: profile?.phone || "+91 1234567890",
  };

  // Dynamic filter lists for payments
  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const matchesSearch =
        donation.id?.toLowerCase().includes(search.toLowerCase()) ||
        donation.category?.toLowerCase().includes(search.toLowerCase()) ||
        donation.subcategory?.toLowerCase().includes(search.toLowerCase()) ||
        donation.razorpayPaymentId?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All types" ||
        donation.category?.toLowerCase() === category.toLowerCase();

      const matchesType =
        type === "All types" ||
        (type === "Recurring" && donation.isRecurring) ||
        (type === "One-time" && !donation.isRecurring);

      const matchesStatus =
        status === "All status" ||
        donation.status?.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [donations, search, category, type, status]);

  const initial = activeUser.name.charAt(0);



  return (
    <main className="dashboard-root">
      <section className="dashboard-container">
        <div className="profile-row">
          <div className="profile-id-strip">
            <CircleUserRound size={16} />
            <span>{activeUser.name}</span>
          </div>
          <div className="profile-actions">
            <button 
              type="button" 
              className={`ghost-btn ${isRefreshing ? "refreshing" : ""}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={14} className={isRefreshing ? "spin-icon" : ""} /> 
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        <article className="profile-card">
          <div className="avatar">{initial}</div>
          <div className="profile-main">
            <span className="greeting">{greeting}</span>
            <h1>{activeUser.name}</h1>
            <div className="contact-line">
              <span>
                <Mail size={14} /> {activeUser.email}
              </span>
              <span>
                <Phone size={14} /> {activeUser.phone}
              </span>
            </div>
          </div>
        </article>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top">
              <p>TOTAL DONATED</p>
              <span className="stat-icon">
                <IndianRupee size={15} />
              </span>
            </div>
            <h2>₹{stats?.totalDonated || 0}</h2>
            <div className="stat-bottom">
              <span>{stats?.contributionsCount || 0} Contributions</span>
              <strong>100%</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <p>FAILED</p>
              <span className="stat-icon">
                ✕
              </span>
            </div>
            <h2>{stats?.failedCount || 0}</h2>
            <div className="stat-bottom">
              <span>of {donations.length} Total</span>
              <strong>{donations.length ? Math.round(((stats?.failedCount || 0) / donations.length) * 100) : 0}%</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <p>RECURRING</p>
              <span className="stat-icon">
                <RefreshCw size={14} />
              </span>
            </div>
            <h2>{stats?.recurringCount || 0}</h2>
            <div className="stat-bottom">
              <span>Monthly Plans</span>
              <strong>{donations.length ? Math.round(((stats?.recurringCount || 0) / donations.length) * 100) : 0}%</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <p>ONE-TIME</p>
              <span className="stat-icon">
                ⚡
              </span>
            </div>
            <h2>{stats?.oneTimeCount || 0}</h2>
            <div className="stat-bottom">
              <span>One-time Actions</span>
              <strong>{donations.length ? Math.round(((stats?.oneTimeCount || 0) / donations.length) * 100) : 0}%</strong>
            </div>
          </article>
        </section>

        <section className="panel transactions-panel">
          <div className="panel-head">
            <h3>All Transactions</h3>
            <span className="count-pill">{filteredDonations.length}</span>
          </div>
          <div className="filters-row">
            <div className="search-wrap">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search ID, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All types</option>
              <option>Education</option>
              <option>Healthcare</option>
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>All types</option>
              <option>Recurring</option>
              <option>One-time</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>All status</option>
              <option>Successful</option>
              <option>Failed</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="table-wrap">
            <div className="table-header">
              <span>Date</span>
              <span>Transaction ID</span>
              <span>Amount</span>
              <span>Category</span>
              <span>Type</span>
              <span>Status</span>
            </div>
            {filteredDonations.length > 0 ? (
              <div className="table-rows">
                {filteredDonations.map((donation) => {
                  const donationDate = donation.createdAt 
                    ? new Date(donation.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString();

                  return (
                    <div className="table-row" key={donation.id}>
                      <span>{donationDate}</span>
                      <span className="tx-id" title={donation.id}>{donation.id}</span>
                      <span className="amount-cell">₹{donation.amount}</span>
                      <span>{donation.category || "General"}</span>
                      <span>{donation.isRecurring ? "Recurring" : "One-time"}</span>
                      <span className={`status-badge ${donation.status?.toLowerCase() || 'pending'}`}>
                        {donation.status}
                        {donation.status === "successful" && (
                          <button
                            type="button"
                            className="receipt-download-btn"
                            title="Download Tax Receipt"
                            onClick={() => handleDownloadReceipt(donation.id)}
                            style={{
                              marginLeft: '6px',
                              background: 'transparent',
                              border: 'none',
                              color: '#1abc9c',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              verticalAlign: 'middle'
                            }}
                          >
                            <FileText size={13} />
                          </button>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="table-empty">
                <CalendarDays size={18} />
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </section>

        <section className="panel month-panel">
          <div className="panel-heading-row">
            <div>
              <h3>Month Wise Contributions</h3>
              <p>Total amount donated per month</p>
            </div>
            <span className="panel-icon">
              <IndianRupee size={16} />
            </span>
          </div>
          <div className="empty-center">No data yet</div>
        </section>

        <section className="bottom-grid">
          <article className="panel">
            <div className="panel-heading-row">
              <div>
                <h3>Payment Frequency</h3>
                <p>Payments per month - amount shown above each dot</p>
              </div>
              <span className="panel-icon">
                <TrendingUp size={15} />
              </span>
            </div>
            <div className="empty-center">No trend data yet</div>
          </article>

          <article className="panel">
            <div className="panel-heading-row">
              <div>
                <h3>Payment Health</h3>
                <p>Success vs failed breakdown</p>
              </div>
            </div>
            <div className="health-list">
              <div>
                <span className="dot success" />
                Successful
                <strong>{stats?.contributionsCount || 0}</strong>
              </div>
              <div>
                <span className="dot failed" />
                Failed
                <strong>{stats?.failedCount || 0}</strong>
              </div>
              <div>
                <span className="dot pending" />
                Pending
                <strong>{donations.filter(d => d.status?.toLowerCase() === 'pending').length}</strong>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
