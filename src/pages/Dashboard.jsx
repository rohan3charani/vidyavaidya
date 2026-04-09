import { useMemo, useState } from "react";
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
} from "lucide-react";
import "./Dashboard.css";

const USER = {
  name: "VIDYA VAIDYA",
  email: "vidyavaidyanlr@gmail.com",
  phone: "+91 1234567890",
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All types");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState("All status");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleLogout = () => {
    // Clear any auth data if it exists
    localStorage.removeItem("vv_auth");
    navigate("/");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data fetch refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const initial = USER.name.charAt(0);

  return (
    <main className="dashboard-root">
      <section className="dashboard-container">
        <div className="profile-row">
          <div className="profile-id-strip">
            <CircleUserRound size={16} />
            <span>{USER.name}</span>
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
            <h1>{USER.name}</h1>
            <div className="contact-line">
              <span>
                <Mail size={14} /> {USER.email}
              </span>
              <span>
                <Phone size={14} /> {USER.phone}
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
            <h2>₹0</h2>
            <div className="stat-bottom">
              <span>0 Contributions</span>
              <strong>0%</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <p>FAILED</p>
              <span className="stat-icon">
                ✕
              </span>
            </div>
            <h2>0</h2>
            <div className="stat-bottom">
              <span>of 0 Total</span>
              <strong>0%</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <p>RECURRING</p>
              <span className="stat-icon">
                <RefreshCw size={14} />
              </span>
            </div>
            <h2>0</h2>
            <div className="stat-bottom">
              <span>Monthly</span>
              <strong>0%</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <p>ONE-TIME</p>
              <span className="stat-icon">
                ⚡
              </span>
            </div>
            <h2>0</h2>
            <div className="stat-bottom">
              <span>One-time</span>
              <strong>0%</strong>
            </div>
          </article>
        </section>

        <section className="panel transactions-panel">
          <div className="panel-head">
            <h3>All Transactions</h3>
            <span className="count-pill">0</span>
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
            <div className="table-empty">
              <CalendarDays size={18} />
              <p>No transactions found</p>
            </div>
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
                <strong>0</strong>
              </div>
              <div>
                <span className="dot failed" />
                Failed
                <strong>0</strong>
              </div>
              <div>
                <span className="dot pending" />
                Pending
                <strong>0</strong>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
