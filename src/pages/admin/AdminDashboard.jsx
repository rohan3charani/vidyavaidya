import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, IndianRupee, Users, FileText, TrendingUp,
  LogOut, Search, Filter, ChevronDown, Eye, Download,
  Heart, BookOpen, Stethoscope, Globe, RefreshCw,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle,
  Clock, ShieldCheck, Menu, X, Bell, BarChart3,
  UserCheck, Wallet, Calendar, Handshake, Plus, Pencil,
  Trash2, ToggleLeft, ToggleRight
} from "lucide-react";
import api from "../../services/api";
import { PartnersSection, StoriesSection, EventsSection, SharedToast } from "./CmsComponents";
import "./AdminDashboard.css";

/* ══════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════ */
const MOCK_DONATIONS = [
  { id: "DON-001", donor: "Priya Sharma",    email: "priya@gmail.com",   phone: "9876543210", amount: 5000,  category: "Education",   type: "One-time",  status: "Successful", date: "2024-04-10", city: "Mumbai" },
  { id: "DON-002", donor: "Rahul Mehta",     email: "rahul@gmail.com",   phone: "9812345678", amount: 1000,  category: "Healthcare",  type: "Monthly",   status: "Successful", date: "2024-04-09", city: "Pune" },
  { id: "DON-003", donor: "Sunita Patel",    email: "sunita@yahoo.com",  phone: "9011234567", amount: 30400,  category: "Community",   type: "One-time",  status: "Pending",    date: "2024-04-08", city: "Ahmedabad" },
  { id: "DON-004", donor: "Arjun Nair",      email: "arjun@gmail.com",   phone: "9988776655", amount: 1056000, category: "Education",   type: "One-time",  status: "Successful", date: "2024-04-08", city: "Kochi" },
  { id: "DON-005", donor: "Meera Iyer",      email: "meera@hotmail.com", phone: "9123456780", amount: 500,   category: "Community",   type: "Monthly",   status: "Failed",     date: "2024-04-07", city: "Chennai" },
  { id: "DON-006", donor: "Vikram Singh",    email: "vikram@gmail.com",  phone: "9765432100", amount: 7000,  category: "Healthcare",  type: "One-time",  status: "Successful", date: "2024-04-06", city: "Delhi" },
  { id: "DON-007", donor: "Ananya Roy",      email: "ananya@gmail.com",  phone: "9654321098", amount: 2000,  category: "Education",   type: "Monthly",   status: "Successful", date: "2024-04-05", city: "Kolkata" },
  { id: "DON-008", donor: "Kiran Reddy",     email: "kiran@gmail.com",   phone: "9543210987", amount: 15000, category: "Healthcare",  type: "One-time",  status: "Successful", date: "2024-04-05", city: "Hyderabad" },
  { id: "DON-009", donor: "Pooja Joshi",     email: "pooja@gmail.com",   phone: "9432109876", amount: 300,   category: "Community",   type: "Monthly",   status: "Pending",    date: "2024-04-04", city: "Jaipur" },
  { id: "DON-010", donor: "Suresh Kumar",    email: "suresh@yahoo.com",  phone: "9321098765", amount: 5000,  category: "Education",   type: "One-time",  status: "Successful", date: "2024-04-03", city: "Bengaluru" },
  { id: "DON-011", donor: "Deepa Nambiar",   email: "deepa@gmail.com",   phone: "9210987654", amount: 1000,  category: "Healthcare",  type: "Monthly",   status: "Successful", date: "2024-04-02", city: "Thiruvananthapuram" },
  { id: "DON-012", donor: "Amit Verma",      email: "amit@gmail.com",    phone: "9109876543", amount: 2500,  category: "Education",   type: "One-time",  status: "Failed",     date: "2024-04-01", city: "Lucknow" },
  { id: "DON-013", donor: "Neha Gupta",      email: "neha@gmail.com",    phone: "9876501234", amount: 3000,  category: "Community",   type: "One-time",  status: "Successful", date: "2024-03-31", city: "Noida" },
  { id: "DON-014", donor: "Ravi Shankar",    email: "ravi@hotmail.com",  phone: "9765012345", amount: 5000,  category: "Healthcare",  type: "Monthly",   status: "Successful", date: "2024-03-30", city: "Nagpur" },
  { id: "DON-015", donor: "Divya Krishnan",  email: "divya@gmail.com",   phone: "9654012345", amount: 7500,  category: "Education",   type: "One-time",  status: "Successful", date: "2024-03-28", city: "Coimbatore" },
];

const MOCK_USERS = [
  { id: "USR-001", name: "Priya Sharma",    email: "priya@gmail.com",   phone: "9876543210", joined: "2024-03-01", lastLogin: "2024-04-10", status: "Active",   donations: 1, totalDonated: 5000 },
  { id: "USR-002", name: "Rahul Mehta",     email: "rahul@gmail.com",   phone: "9812345678", joined: "2024-02-15", lastLogin: "2024-04-09", status: "Active",   donations: 2, totalDonated: 2000 },
  { id: "USR-003", name: "Sunita Patel",    email: "sunita@yahoo.com",  phone: "9011234567", joined: "2024-01-20", lastLogin: "2024-04-08", status: "Pending",  donations: 1, totalDonated: 3000 },
  { id: "USR-004", name: "Arjun Nair",      email: "arjun@gmail.com",   phone: "9988776655", joined: "2024-03-10", lastLogin: "2024-04-08", status: "Active",   donations: 1, totalDonated: 10000 },
  { id: "USR-005", name: "Meera Iyer",      email: "meera@hotmail.com", phone: "9123456780", joined: "2024-02-28", lastLogin: "2024-04-07", status: "Inactive", donations: 1, totalDonated: 500 },
  { id: "USR-006", name: "Vikram Singh",    email: "vikram@gmail.com",  phone: "9765432100", joined: "2024-01-05", lastLogin: "2024-04-06", status: "Active",   donations: 1, totalDonated: 7000 },
  { id: "USR-007", name: "Ananya Roy",      email: "ananya@gmail.com",  phone: "9654321098", joined: "2024-03-22", lastLogin: "2024-04-05", status: "Active",   donations: 2, totalDonated: 4000 },
  { id: "USR-008", name: "Kiran Reddy",     email: "kiran@gmail.com",   phone: "9543210987", joined: "2024-02-10", lastLogin: "2024-04-05", status: "Active",   donations: 1, totalDonated: 15000 },
  { id: "USR-009", name: "Pooja Joshi",     email: "pooja@gmail.com",   phone: "9432109876", joined: "2024-03-18", lastLogin: "2024-04-04", status: "Pending",  donations: 1, totalDonated: 600 },
  { id: "USR-010", name: "Suresh Kumar",    email: "suresh@yahoo.com",  phone: "9321098765", joined: "2024-01-30", lastLogin: "2024-04-03", status: "Active",   donations: 1, totalDonated: 5000 },
  { id: "USR-011", name: "Deepa Nambiar",   email: "deepa@gmail.com",   phone: "9210987654", joined: "2024-02-05", lastLogin: "2024-04-02", status: "Active",   donations: 1, totalDonated: 1000 },
  { id: "USR-012", name: "Amit Verma",      email: "amit@gmail.com",    phone: "9109876543", joined: "2024-03-25", lastLogin: "2024-04-01", status: "Inactive", donations: 1, totalDonated: 2500 },
];

const MONTHLY_DATA = [
  { month: "Nov", amount: 12000 },
  { month: "Dec", amount: 28000 },
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 38000 },
  { month: "Mar", amount: 62000 },
  { month: "Apr", amount: 71500 },
];

const CATEGORY_BREAKDOWN = [
  { label: "Education",  amount: 37500, color: "#1abc9c", pct: 52 },
  { label: "Healthcare", amount: 24000, color: "#0b3c5d", pct: 33 },
  { label: "Community",  amount: 10800, color: "#48c9b0", pct: 15 },
];

const NAV_ITEMS = [
  { id: "overview",       label: "Overview",        icon: LayoutDashboard },
  { id: "donations",      label: "All Donations",   icon: Heart },
  { id: "users",          label: "User Logins",     icon: Users },
  { id: "user-donations", label: "User Donations",  icon: Wallet },
  { id: "analytics",      label: "Analytics",       icon: BarChart3 },
  { id: "partners",       label: "Partners",        icon: Handshake },
  { id: "stories",        label: "Stories",         icon: FileText },
  { id: "events",         label: "Events",          icon: Calendar },
];

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function StatusBadge({ status }) {
  const cls = {
    Successful: "badge-success",
    Failed: "badge-failed",
    Pending: "badge-pending",
    Active: "badge-success",
    Inactive: "badge-inactive",
  }[status] || "badge-pending";
  return <span className={`adm-badge ${cls}`}>{status}</span>;
}

/* ══════════════════════════════════════════════
   OVERVIEW SECTION
══════════════════════════════════════════════ */
function Overview() {
  const totalRaised = MOCK_DONATIONS.filter(d => d.status === "Successful").reduce((s, d) => s + d.amount, 0);
  const totalDonors  = MOCK_USERS.length;
  const successCount = MOCK_DONATIONS.filter(d => d.status === "Successful").length;
  const pendingCount = MOCK_DONATIONS.filter(d => d.status === "Pending").length;
  const maxBar = Math.max(...MONTHLY_DATA.map(m => m.amount));

  const kpis = [
    { label: "Total Funds Raised",  value: fmt(totalRaised), sub: `${successCount} successful donations`, trend: "+18%", up: true, icon: IndianRupee, color: "#1abc9c" },
    { label: "Registered Users",    value: totalDonors,      sub: "All time registrations",              trend: "+12%", up: true, icon: Users,       color: "#0b3c5d" },
    { label: "Pending Approvals",   value: pendingCount,     sub: "Awaiting verification",               trend: "-3",   up: false, icon: Clock,       color: "#f39c12" },
    { label: "Lives Impacted",      value: "15,000+",        sub: "Across education & health",           trend: "+5%",  up: true, icon: Heart,       color: "#e74c3c" },
  ];

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <h2>Foundation Overview</h2>
        <p>Real-time snapshot of VidyaVaidya's impact and operations</p>
      </div>

      {/* KPI Cards */}
      <div className="adm-kpi-grid">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div className="adm-kpi-card" key={k.label}>
              <div className="adm-kpi-top">
                <div className="adm-kpi-icon" style={{ background: `${k.color}18`, color: k.color }}>
                  <Icon size={20} />
                </div>
                <span className={`adm-trend ${k.up ? "trend-up" : "trend-down"}`}>
                  {k.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {k.trend}
                </span>
              </div>
              <div className="adm-kpi-value">{k.value}</div>
              <div className="adm-kpi-label">{k.label}</div>
              <div className="adm-kpi-sub">{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="adm-charts-row">
        {/* Monthly Bar Chart */}
        <div className="adm-panel adm-chart-panel">
          <div className="adm-panel-title">
            <TrendingUp size={16} />
            Monthly Donations (₹)
          </div>
          <div className="adm-bar-chart">
            {MONTHLY_DATA.map((m) => (
              <div className="adm-bar-col" key={m.month}>
                <span className="adm-bar-val">{fmt(m.amount)}</span>
                <div
                  className="adm-bar"
                  style={{ height: `${(m.amount / maxBar) * 100}%` }}
                />
                <span className="adm-bar-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="adm-panel adm-cat-panel">
          <div className="adm-panel-title">
            <BarChart3 size={16} />
            Donation Categories
          </div>
          <div className="adm-cat-list">
            {CATEGORY_BREAKDOWN.map((c) => (
              <div className="adm-cat-row" key={c.label}>
                <div className="adm-cat-info">
                  <span className="adm-cat-dot" style={{ background: c.color }} />
                  <span className="adm-cat-name">{c.label}</span>
                  <span className="adm-cat-pct">{c.pct}%</span>
                </div>
                <div className="adm-cat-bar-bg">
                  <div className="adm-cat-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
                <span className="adm-cat-amount">{fmt(c.amount)}</span>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="adm-quick-stats">
            <div className="adm-qs">
              <CheckCircle2 size={14} color="#1abc9c" />
              <span>{MOCK_DONATIONS.filter(d => d.status === "Successful").length} Successful</span>
            </div>
            <div className="adm-qs">
              <XCircle size={14} color="#e74c3c" />
              <span>{MOCK_DONATIONS.filter(d => d.status === "Failed").length} Failed</span>
            </div>
            <div className="adm-qs">
              <Clock size={14} color="#f39c12" />
              <span>{MOCK_DONATIONS.filter(d => d.status === "Pending").length} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent donations */}
      <div className="adm-panel">
        <div className="adm-panel-title">
          <Calendar size={16} />
          Recent Donations
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DONATIONS.slice(0, 5).map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="adm-donor-cell">
                      <div className="adm-avatar-sm">{d.donor[0]}</div>
                      <div>
                        <div className="adm-donor-name">{d.donor}</div>
                        <div className="adm-donor-email">{d.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><strong className="adm-amount">{fmt(d.amount)}</strong></td>
                  <td><span className="adm-cat-chip">{d.category}</span></td>
                  <td className="adm-muted">{d.date}</td>
                  <td><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ALL DONATIONS SECTION
══════════════════════════════════════════════ */
function AllDonations() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = useMemo(() => {
    return MOCK_DONATIONS.filter(d => {
      const q = search.toLowerCase();
      const matchQ = !q || d.donor.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
      const matchCat = catFilter === "All" || d.category === catFilter;
      const matchType = typeFilter === "All" || d.type === typeFilter;
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      return matchQ && matchCat && matchType && matchStatus;
    });
  }, [search, catFilter, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalAmount = filtered.filter(d => d.status === "Successful").reduce((s, d) => s + d.amount, 0);

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <h2>All Donations</h2>
        <p>Complete donation history with filters and search</p>
      </div>

      {/* Summary strip */}
      <div className="adm-summary-strip">
        <div className="adm-ss-item">
          <span className="adm-ss-label">Filtered Results</span>
          <span className="adm-ss-value">{filtered.length}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Total Amount</span>
          <span className="adm-ss-value adm-green">{fmt(totalAmount)}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Successful</span>
          <span className="adm-ss-value">{filtered.filter(d => d.status === "Successful").length}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Pending</span>
          <span className="adm-ss-value adm-orange">{filtered.filter(d => d.status === "Pending").length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="adm-filters-bar">
        <div className="adm-search-box">
          <Search size={15} />
          <input
            placeholder="Search donor, ID, email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="adm-filter-selects">
          <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
            <option value="All">All Categories</option>
            <option>Education</option>
            <option>Healthcare</option>
            <option>Community</option>
          </select>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
            <option value="All">All Types</option>
            <option>One-time</option>
            <option>Monthly</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="All">All Status</option>
            <option>Successful</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="adm-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Donation ID</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type</th>
                <th>City</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={8} className="adm-empty-row">No donations match your filters</td></tr>
              ) : paged.map(d => (
                <tr key={d.id}>
                  <td><code className="adm-id">{d.id}</code></td>
                  <td>
                    <div className="adm-donor-cell">
                      <div className="adm-avatar-sm">{d.donor[0]}</div>
                      <div>
                        <div className="adm-donor-name">{d.donor}</div>
                        <div className="adm-donor-email">{d.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><strong className="adm-amount">{fmt(d.amount)}</strong></td>
                  <td><span className="adm-cat-chip">{d.category}</span></td>
                  <td><span className="adm-type-chip">{d.type}</span></td>
                  <td className="adm-muted">{d.city}</td>
                  <td className="adm-muted">{d.date}</td>
                  <td><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="adm-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={page === p ? "adm-page-active" : ""} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   USER LOGINS SECTION
══════════════════════════════════════════════ */
function UserLogins() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const q = search.toLowerCase();
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <h2>User Logins & Registrations</h2>
        <p>All registered users, their activity and status</p>
      </div>

      {/* Summary */}
      <div className="adm-summary-strip">
        <div className="adm-ss-item">
          <span className="adm-ss-label">Total Users</span>
          <span className="adm-ss-value">{MOCK_USERS.length}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Active</span>
          <span className="adm-ss-value adm-green">{MOCK_USERS.filter(u => u.status === "Active").length}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Pending</span>
          <span className="adm-ss-value adm-orange">{MOCK_USERS.filter(u => u.status === "Pending").length}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Inactive</span>
          <span className="adm-ss-value">{MOCK_USERS.filter(u => u.status === "Inactive").length}</span>
        </div>
      </div>

      <div className="adm-filters-bar">
        <div className="adm-search-box">
          <Search size={15} />
          <input
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="adm-filter-selects">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="adm-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Donations</th>
                <th>Total Given</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="adm-empty-row">No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id}>
                  <td><code className="adm-id">{u.id}</code></td>
                  <td>
                    <div className="adm-donor-cell">
                      <div className="adm-avatar-sm">{u.name[0]}</div>
                      <div>
                        <div className="adm-donor-name">{u.name}</div>
                        <div className="adm-donor-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="adm-muted">{u.phone}</td>
                  <td className="adm-muted">{u.joined}</td>
                  <td className="adm-muted">{u.lastLogin}</td>
                  <td className="adm-center"><span className="adm-count-badge">{u.donations}</span></td>
                  <td><strong className="adm-amount">{fmt(u.totalDonated)}</strong></td>
                  <td><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   USER DONATIONS SECTION
══════════════════════════════════════════════ */
function UserDonations() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = useMemo(() => {
    if (!search) return MOCK_USERS;
    const q = search.toLowerCase();
    return MOCK_USERS.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [search]);

  const userDonations = useMemo(() => {
    if (!selectedUser) return [];
    return MOCK_DONATIONS.filter(d => d.email === selectedUser.email);
  }, [selectedUser]);

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <h2>User-wise Donations</h2>
        <p>Select a user to view their complete donation history</p>
      </div>

      <div className="adm-ud-layout">
        {/* User List */}
        <div className="adm-panel adm-ud-left">
          <div className="adm-panel-title"><UserCheck size={16} /> Select User</div>
          <div className="adm-search-box adm-ud-search">
            <Search size={14} />
            <input
              placeholder="Search user…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="adm-ud-user-list">
            {filtered.map(u => (
              <div
                key={u.id}
                className={`adm-ud-user-item ${selectedUser?.id === u.id ? "adm-ud-active" : ""}`}
                onClick={() => setSelectedUser(u)}
              >
                <div className="adm-avatar-sm">{u.name[0]}</div>
                <div className="adm-ud-user-info">
                  <div className="adm-donor-name">{u.name}</div>
                  <div className="adm-donor-email">{u.email}</div>
                </div>
                <span className="adm-ud-total">{fmt(u.totalDonated)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Detail */}
        <div className="adm-panel adm-ud-right">
          {!selectedUser ? (
            <div className="adm-ud-placeholder">
              <Wallet size={40} />
              <p>Select a user from the left to view their donations</p>
            </div>
          ) : (
            <>
              <div className="adm-ud-detail-header">
                <div className="adm-avatar-lg">{selectedUser.name[0]}</div>
                <div>
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email} · {selectedUser.phone}</p>
                  <div className="adm-ud-meta-chips">
                    <span>Joined: {selectedUser.joined}</span>
                    <span>Last Login: {selectedUser.lastLogin}</span>
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
                <div className="adm-ud-total-box">
                  <div className="adm-ud-total-label">Total Donated</div>
                  <div className="adm-ud-total-value">{fmt(selectedUser.totalDonated)}</div>
                  <div className="adm-ud-total-sub">{selectedUser.donations} donation(s)</div>
                </div>
              </div>

              <div className="adm-table-wrap adm-ud-table">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Donation ID</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDonations.length === 0 ? (
                      <tr><td colSpan={6} className="adm-empty-row">No donations found for this user</td></tr>
                    ) : userDonations.map(d => (
                      <tr key={d.id}>
                        <td><code className="adm-id">{d.id}</code></td>
                        <td><strong className="adm-amount">{fmt(d.amount)}</strong></td>
                        <td><span className="adm-cat-chip">{d.category}</span></td>
                        <td><span className="adm-type-chip">{d.type}</span></td>
                        <td className="adm-muted">{d.date}</td>
                        <td><StatusBadge status={d.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ANALYTICS SECTION
══════════════════════════════════════════════ */
function Analytics() {
  const totalRaised = MOCK_DONATIONS.filter(d => d.status === "Successful").reduce((s, d) => s + d.amount, 0);
  const avgDonation = Math.round(totalRaised / MOCK_DONATIONS.filter(d => d.status === "Successful").length);
  const topDonor = [...MOCK_USERS].sort((a, b) => b.totalDonated - a.totalDonated)[0];

  const impactMetrics = [
    { icon: BookOpen, label: "Students Supported",     value: "450+",  color: "#1abc9c", desc: "Through education sponsorships" },
    { icon: Stethoscope, label: "Medical Cases",       value: "180+",  color: "#0b3c5d", desc: "Healthcare assistance provided" },
    { icon: Globe, label: "Cities Reached",            value: "12",    color: "#48c9b0", desc: "Across Maharashtra & India" },
    { icon: Heart, label: "Families Helped",           value: "620+",  color: "#e74c3c", desc: "Through community welfare" },
  ];

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <h2>Foundation Analytics & Impact</h2>
        <p>Key metrics and real-world impact of VidyaVaidya Trust</p>
      </div>

      {/* Impact Grid */}
      <div className="adm-impact-grid">
        {impactMetrics.map(m => {
          const Icon = m.icon;
          return (
            <div className="adm-impact-card" key={m.label}>
              <div className="adm-impact-icon" style={{ background: `${m.color}18`, color: m.color }}>
                <Icon size={24} />
              </div>
              <div className="adm-impact-value">{m.value}</div>
              <div className="adm-impact-label">{m.label}</div>
              <div className="adm-impact-desc">{m.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics Row */}
      <div className="adm-analytics-row">
        <div className="adm-panel adm-analytics-panel">
          <div className="adm-panel-title"><TrendingUp size={16} /> Fund Utilisation</div>
          <div className="adm-util-list">
            {[
              { label: "Education Programs",    pct: 45, color: "#1abc9c" },
              { label: "Healthcare & Medicine",  pct: 30, color: "#0b3c5d" },
              { label: "Community Welfare",      pct: 15, color: "#48c9b0" },
              { label: "Operations & Admin",     pct: 10, color: "#95a5a6" },
            ].map(u => (
              <div className="adm-util-row" key={u.label}>
                <div className="adm-util-info">
                  <span className="adm-cat-dot" style={{ background: u.color }} />
                  <span>{u.label}</span>
                  <span className="adm-util-pct" style={{ color: u.color }}>{u.pct}%</span>
                </div>
                <div className="adm-cat-bar-bg">
                  <div className="adm-cat-bar-fill" style={{ width: `${u.pct}%`, background: u.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-panel adm-analytics-panel">
          <div className="adm-panel-title"><BarChart3 size={16} /> Key Statistics</div>
          <div className="adm-stats-list">
            <div className="adm-stat-row">
              <span>Total Funds Raised</span>
              <strong className="adm-green">{fmt(totalRaised)}</strong>
            </div>
            <div className="adm-stat-row">
              <span>Average Donation</span>
              <strong>{fmt(avgDonation)}</strong>
            </div>
            <div className="adm-stat-row">
              <span>Top Donor</span>
              <strong>{topDonor.name}</strong>
            </div>
            <div className="adm-stat-row">
              <span>Top Donation</span>
              <strong className="adm-green">{fmt(topDonor.totalDonated)}</strong>
            </div>
            <div className="adm-stat-row">
              <span>Monthly Donations</span>
              <strong>{MOCK_DONATIONS.filter(d => d.type === "Monthly").length}</strong>
            </div>
            <div className="adm-stat-row">
              <span>One-time Donations</span>
              <strong>{MOCK_DONATIONS.filter(d => d.type === "One-time").length}</strong>
            </div>
            <div className="adm-stat-row">
              <span>Success Rate</span>
              <strong className="adm-green">
                {Math.round((MOCK_DONATIONS.filter(d => d.status === "Successful").length / MOCK_DONATIONS.length) * 100)}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Top Donors */}
      <div className="adm-panel">
        <div className="adm-panel-title"><Heart size={16} /> Top Donors</div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Rank</th><th>Donor</th><th>City</th><th>Total Donated</th><th>Donations</th><th>Status</th></tr>
            </thead>
            <tbody>
              {[...MOCK_USERS].sort((a, b) => b.totalDonated - a.totalDonated).slice(0, 8).map((u, i) => (
                <tr key={u.id}>
                  <td>
                    <span className={`adm-rank ${i < 3 ? "adm-rank-top" : ""}`}>#{i + 1}</span>
                  </td>
                  <td>
                    <div className="adm-donor-cell">
                      <div className="adm-avatar-sm">{u.name[0]}</div>
                      <div>
                        <div className="adm-donor-name">{u.name}</div>
                        <div className="adm-donor-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="adm-muted">India</td>
                  <td><strong className="adm-amount">{fmt(u.totalDonated)}</strong></td>
                  <td className="adm-center"><span className="adm-count-badge">{u.donations}</span></td>
                  <td><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN DASHBOARD SHELL
══════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("vv_admin_auth");
    navigate("/admin");
  };

  const SECTIONS = {
    overview:        <Overview />,
    donations:       <AllDonations />,
    users:           <UserLogins />,
    "user-donations": <UserDonations />,
    analytics:       <Analytics />,
    partners:        <PartnersSection showToast={showToast} />,
    stories:         <StoriesSection showToast={showToast} />,
    events:          <EventsSection showToast={showToast} />,
  };

  return (
    <div className="adm-root">
      {/* SIDEBAR */}
      <aside className={`adm-sidebar ${sidebarOpen ? "adm-sidebar-open" : "adm-sidebar-collapsed"}`}>
        <div className="adm-sidebar-logo">
          <div className="adm-logo-icon"><ShieldCheck size={20} /></div>
          {sidebarOpen && (
            <div className="adm-logo-text">
              <span className="adm-logo-main">VidyaVaidya</span>
              <span className="adm-logo-sub">Admin Panel</span>
            </div>
          )}
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`adm-nav-btn ${activeSection === item.id ? "adm-nav-active" : ""}`}
                onClick={() => setActiveSection(item.id)}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-nav-btn adm-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <button className="adm-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="adm-topbar-title">
            {NAV_ITEMS.find(i => i.id === activeSection)?.label}
          </div>
          <div className="adm-topbar-right">
            <div className="adm-notification">
              <Bell size={18} />
              <span className="adm-notif-dot" />
            </div>
            <div className="adm-admin-chip">
              <div className="adm-admin-avatar">A</div>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="adm-content">
          <div key={activeSection} className="animate-slide-up">
            {SECTIONS[activeSection]}
          </div>
        </main>
      </div>

      <SharedToast toast={toast} />
    </div>
  );
}
