import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, IndianRupee, Users, FileText, TrendingUp,
  Search, Heart, Globe,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle,
  Clock, ShieldCheck, Bell, BarChart3,
  UserCheck, Wallet, Calendar, Handshake, Plus,
  Trash2, ToggleLeft, ToggleRight, MessageSquareQuote, User,
  BookOpen, Stethoscope
} from "lucide-react";
import api from "../../services/api";
import { PartnersSection, StoriesSection, EventsSection, TestimonialsSection, SharedToast } from "./CmsComponents";
import ForeignDonorsSection from "./ForeignDonorsSection";
import AdminNavbar from "./AdminNavbar";
import AdminProfilePage from "./AdminProfilePage";
import vidyaLogo from "../../assets/Vidya1.png";
import "./AdminDashboard.css";

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
  const [data, setData] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const [overviewRes, donationsRes] = await Promise.all([
          api.admin.getOverview(),
          api.admin.getDonations(1, 5)
        ]);
        if (active) {
          setData(overviewRes);
          setRecentDonations(donationsRes.donations || []);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load overview data");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="adm-section adm-loading">
        <div className="adm-spinner" />
        <p>Loading overview analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adm-section adm-error">
        <div className="adm-error-alert">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const totalRaised = stats.totalRaised || 0;
  const totalDonors = stats.totalDonors || 0;
  const successCount = stats.successfulDonations || 0;
  const pendingCount = stats.pendingDonations || 0;
  const monthlyGrowth = stats.monthlyGrowth || 12.5;

  const revenueTrend = data?.revenueTrend || [];
  const maxBar = Math.max(...revenueTrend.map(r => r.amount), 1);

  const kpis = [
    { label: "Total Funds Raised",  value: fmt(totalRaised), sub: `${successCount} successful donations`, trend: `+${monthlyGrowth}%`, up: true, icon: IndianRupee, color: "#1abc9c" },
    { label: "Registered Users",    value: totalDonors,      sub: "All time registrations",              trend: "+12%", up: true, icon: Users,       color: "#0b3c5d" },
    { label: "Pending Approvals",   value: pendingCount,     sub: "Awaiting verification",               trend: "-3",   up: false, icon: Clock,       color: "#f39c12" },
    { label: "Lives Impacted",      value: "15,000+",        sub: "Across education & health",           trend: "+5%",  up: true, icon: Heart,       color: "#e74c3c" },
  ];

  const catBreakdown = data?.categoryBreakdown || { Education: 0, Healthcare: 0, Community: 0 };
  const totalCategoryAmount = Object.values(catBreakdown).reduce((s, v) => s + v, 0) || 1;
  const categories = [
    { label: "Education",  amount: catBreakdown.Education || 0, color: "#1abc9c", pct: Math.round(((catBreakdown.Education || 0) / totalCategoryAmount) * 100) },
    { label: "Healthcare", amount: catBreakdown.Healthcare || 0, color: "#0b3c5d", pct: Math.round(((catBreakdown.Healthcare || 0) / totalCategoryAmount) * 100) },
    { label: "Community",  amount: catBreakdown.Community || 0, color: "#48c9b0", pct: Math.round(((catBreakdown.Community || 0) / totalCategoryAmount) * 100) },
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
            Recent Revenue Trend (7 Days)
          </div>
          {revenueTrend.length > 0 ? (
            <div className="adm-bar-chart">
              {revenueTrend.map((m) => (
                <div className="adm-bar-col" key={m.date}>
                  <span className="adm-bar-val">{fmt(m.amount)}</span>
                  <div
                    className="adm-bar"
                    style={{ height: `${(m.amount / maxBar) * 100}%` }}
                  />
                  <span className="adm-bar-label">{m.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="adm-empty-chart" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#888' }}>
              No recent trend data found
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="adm-panel adm-cat-panel">
          <div className="adm-panel-title">
            <BarChart3 size={16} />
            Donation Categories
          </div>
          <div className="adm-cat-list">
            {categories.map((c) => (
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
              <span>{successCount} Successful</span>
            </div>
            <div className="adm-qs">
              <XCircle size={14} color="#e74c3c" />
              <span>{stats.failedDonations || 0} Failed</span>
            </div>
            <div className="adm-qs">
              <Clock size={14} color="#f39c12" />
              <span>{pendingCount} Pending</span>
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
              {recentDonations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="adm-empty-row" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    No donations found
                  </td>
                </tr>
              ) : (
                recentDonations.map(d => {
                  let dateStr = "N/A";
                  if (d.createdAt) {
                    const dateObj = new Date(d.createdAt._seconds ? d.createdAt._seconds * 1000 : (d.createdAt.seconds ? d.createdAt.seconds * 1000 : d.createdAt));
                    dateStr = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                  }
                  const displayStatus = d.status ? (d.status.charAt(0).toUpperCase() + d.status.slice(1)) : "Pending";
                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="adm-donor-cell">
                          <div className="adm-avatar-sm">{(d.donorName || "D")[0]}</div>
                          <div>
                            <div className="adm-donor-name">{d.donorName || "Anonymous"}</div>
                            <div className="adm-donor-email">{d.donorEmail || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong className="adm-amount">{fmt(d.amount)}</strong></td>
                      <td><span className="adm-cat-chip">{d.category || "General"}</span></td>
                      <td className="adm-muted">{dateStr}</td>
                      <td>
                        <StatusBadge status={displayStatus} />
                      </td>
                    </tr>
                  );
                })
              )}
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
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewStats, setOverviewStats] = useState(null);
  const PER_PAGE = 8;

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const filters = {};
        if (search.trim()) filters.search = search.trim();
        if (catFilter !== "All") filters.category = catFilter;
        if (typeFilter !== "All") {
          filters.type = typeFilter === "One-time" ? "one-time" : "monthly";
        }
        if (statusFilter !== "All") {
          filters.status = statusFilter.toLowerCase();
        }

        const res = await api.admin.getDonations(page, PER_PAGE, filters);
        if (active) {
          setDonations(res.donations || []);
          setTotal(res.total || 0);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load donations");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [search, catFilter, typeFilter, statusFilter, page]);

  useEffect(() => {
    api.admin.getOverview().then(res => setOverviewStats(res.stats)).catch(() => {});
  }, []);

  const totalPages = Math.ceil(total / PER_PAGE);

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
          <span className="adm-ss-value">{total}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Total Amount</span>
          <span className="adm-ss-value adm-green">{fmt(overviewStats?.totalRaised || 0)}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Successful</span>
          <span className="adm-ss-value">{overviewStats?.successfulDonations || 0}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Pending</span>
          <span className="adm-ss-value adm-orange">{overviewStats?.pendingDonations || 0}</span>
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
        {loading ? (
          <div className="adm-table-loading" style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="adm-spinner" />
          </div>
        ) : error ? (
          <div className="adm-table-error" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>{error}</div>
        ) : (
          <>
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
                  {donations.length === 0 ? (
                    <tr><td colSpan={8} className="adm-empty-row">No donations match your filters</td></tr>
                  ) : donations.map(d => {
                    let dateStr = "N/A";
                    if (d.createdAt) {
                      const dateObj = new Date(d.createdAt._seconds ? d.createdAt._seconds * 1000 : (d.createdAt.seconds ? d.createdAt.seconds * 1000 : d.createdAt));
                      dateStr = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                    }
                    const displayStatus = d.status ? (d.status.charAt(0).toUpperCase() + d.status.slice(1)) : "Pending";
                    return (
                      <tr key={d.id}>
                        <td><code className="adm-id" title={d.donationId || d.id}>{(d.donationId || d.id).slice(0, 10)}...</code></td>
                        <td>
                          <div className="adm-donor-cell">
                            <div className="adm-avatar-sm">{(d.donorName || "D")[0]}</div>
                            <div>
                              <div className="adm-donor-name">{d.donorName || "Anonymous"}</div>
                              <div className="adm-donor-email">{d.donorEmail || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td><strong className="adm-amount">{fmt(d.amount)}</strong></td>
                        <td><span className="adm-cat-chip">{d.category || "General"}</span></td>
                        <td><span className="adm-type-chip">{d.donationType === "monthly" ? "Monthly" : "One-time"}</span></td>
                        <td className="adm-muted">{d.city || d.donorCity || "India"}</td>
                        <td className="adm-muted">{dateStr}</td>
                        <td><StatusBadge status={displayStatus} /></td>
                      </tr>
                    );
                  })}
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
          </>
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const filters = {};
        if (search.trim()) filters.search = search.trim();
        
        const res = await api.admin.getUsers(1, 1000, filters);
        if (active) {
          let list = res.users || [];
          if (statusFilter !== "All") {
            list = list.filter(u => {
              const uStatus = u.isActive === true ? "Active" : (u.isActive === false ? "Inactive" : "Pending");
              return uStatus === statusFilter;
            });
          }
          setUsers(list);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load users");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [search, statusFilter]);

  const activeCount = users.filter(u => u.isActive === true).length;
  const inactiveCount = users.filter(u => u.isActive === false).length;
  const pendingUserCount = users.filter(u => u.isActive === undefined || u.isActive === null).length;

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
          <span className="adm-ss-value">{users.length}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Active</span>
          <span className="adm-ss-value adm-green">{activeCount}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Pending</span>
          <span className="adm-ss-value adm-orange">{pendingUserCount}</span>
        </div>
        <div className="adm-ss-item">
          <span className="adm-ss-label">Inactive</span>
          <span className="adm-ss-value">{inactiveCount}</span>
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
        {loading ? (
          <div className="adm-table-loading" style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="adm-spinner" />
          </div>
        ) : error ? (
          <div className="adm-table-error" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>{error}</div>
        ) : (
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
                {users.length === 0 ? (
                  <tr><td colSpan={8} className="adm-empty-row">No users found</td></tr>
                ) : users.map(u => {
                  let joinedDateStr = "N/A";
                  if (u.createdAt) {
                    const dateObj = new Date(u.createdAt._seconds ? u.createdAt._seconds * 1000 : (u.createdAt.seconds ? u.createdAt.seconds * 1000 : u.createdAt));
                    joinedDateStr = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                  }
                  let loginDateStr = "N/A";
                  if (u.lastLogin) {
                    const dateObj = new Date(u.lastLogin._seconds ? u.lastLogin._seconds * 1000 : (u.lastLogin.seconds ? u.lastLogin.seconds * 1000 : u.lastLogin));
                    loginDateStr = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                  }
                  const uStatus = u.isActive === true ? "Active" : (u.isActive === false ? "Inactive" : "Pending");
                  return (
                    <tr key={u.id}>
                      <td><code className="adm-id" title={u.id}>{u.id.slice(0, 8)}...</code></td>
                      <td>
                        <div className="adm-donor-cell">
                          <div className="adm-avatar-sm">{(u.fullName || "U")[0]}</div>
                          <div>
                            <div className="adm-donor-name">{u.fullName || "User"}</div>
                            <div className="adm-donor-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="adm-muted">{u.phone || u.mobile || "N/A"}</td>
                      <td className="adm-muted">{joinedDateStr}</td>
                      <td className="adm-muted">{loginDateStr}</td>
                      <td className="adm-center"><span className="adm-count-badge">{u.donationCount || 0}</span></td>
                      <td><strong className="adm-amount">{fmt(u.totalDonated || 0)}</strong></td>
                      <td><StatusBadge status={uStatus} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
  const [users, setUsers] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await api.admin.getUsers(1, 1000);
        if (active) {
          setUsers(res.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setUserDonations([]);
      return;
    }
    let active = true;
    async function loadUserDonations() {
      try {
        const res = await api.admin.getDonations(1, 100, { search: selectedUser.email });
        if (active) {
          setUserDonations(res.donations || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadUserDonations();
    return () => { active = false; };
  }, [selectedUser]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => 
      (u.fullName || "").toLowerCase().includes(q) || 
      (u.email || "").toLowerCase().includes(q)
    );
  }, [users, search]);

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
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="adm-spinner" style={{ margin: 'auto' }} />
            </div>
          ) : (
            <div className="adm-ud-user-list">
              {filteredUsers.map(u => (
                <div
                  key={u.id}
                  className={`adm-ud-user-item ${selectedUser?.id === u.id ? "adm-ud-active" : ""}`}
                  onClick={() => setSelectedUser(u)}
                >
                  <div className="adm-avatar-sm">{(u.fullName || "U")[0]}</div>
                  <div className="adm-ud-user-info">
                    <div className="adm-donor-name">{u.fullName || "User"}</div>
                    <div className="adm-donor-email">{u.email}</div>
                  </div>
                  <span className="adm-ud-total">{fmt(u.totalDonated || 0)}</span>
                </div>
              ))}
            </div>
          )}
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
                <div className="adm-avatar-lg">{(selectedUser.fullName || "U")[0]}</div>
                <div>
                  <h3>{selectedUser.fullName || "User"}</h3>
                  <p>{selectedUser.email} · {selectedUser.phone || selectedUser.mobile || "N/A"}</p>
                  <div className="adm-ud-meta-chips">
                    <span>Joined: {selectedUser.createdAt ? new Date(selectedUser.createdAt._seconds ? selectedUser.createdAt._seconds * 1000 : (selectedUser.createdAt.seconds ? selectedUser.createdAt.seconds * 1000 : selectedUser.createdAt)).toLocaleDateString('en-IN') : "N/A"}</span>
                    <span>Last Login: {selectedUser.lastLogin ? new Date(selectedUser.lastLogin._seconds ? selectedUser.lastLogin._seconds * 1000 : (selectedUser.lastLogin.seconds ? selectedUser.lastLogin.seconds * 1000 : selectedUser.lastLogin)).toLocaleDateString('en-IN') : "N/A"}</span>
                    <StatusBadge status={selectedUser.isActive === true ? "Active" : (selectedUser.isActive === false ? "Inactive" : "Pending")} />
                  </div>
                </div>
                <div className="adm-ud-total-box">
                  <div className="adm-ud-total-label">Total Donated</div>
                  <div className="adm-ud-total-value">{fmt(selectedUser.totalDonated || 0)}</div>
                  <div className="adm-ud-total-sub">{selectedUser.donationCount || 0} donation(s)</div>
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
                    ) : userDonations.map(d => {
                      let dateStr = "N/A";
                      if (d.createdAt) {
                        const dateObj = new Date(d.createdAt._seconds ? d.createdAt._seconds * 1000 : (d.createdAt.seconds ? d.createdAt.seconds * 1000 : d.createdAt));
                        dateStr = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                      }
                      const displayStatus = d.status ? (d.status.charAt(0).toUpperCase() + d.status.slice(1)) : "Pending";
                      return (
                        <tr key={d.id}>
                          <td><code className="adm-id" title={d.donationId || d.id}>{(d.donationId || d.id).slice(0, 10)}...</code></td>
                          <td><strong className="adm-amount">{fmt(d.amount)}</strong></td>
                          <td><span className="adm-cat-chip">{d.category || "General"}</span></td>
                          <td><span className="adm-type-chip">{d.donationType === "monthly" ? "Monthly" : "One-time"}</span></td>
                          <td className="adm-muted">{dateStr}</td>
                          <td><StatusBadge status={displayStatus} /></td>
                        </tr>
                      );
                    })}
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
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const [overviewRes, usersRes] = await Promise.all([
          api.admin.getOverview(),
          api.admin.getUsers(1, 1000)
        ]);
        if (active) {
          setData(overviewRes);
          setUsers(usersRes.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="adm-section adm-loading">
        <div className="adm-spinner" />
        <p>Loading analytics data...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const totalRaised = stats.totalRaised || 0;
  const successfulCount = stats.successfulDonations || 0;
  const avgDonation = successfulCount ? Math.round(totalRaised / successfulCount) : 0;
  const topDonors = [...users].sort((a, b) => (b.totalDonated || 0) - (a.totalDonated || 0)).slice(0, 8);
  const topDonor = topDonors[0] || { fullName: "N/A", totalDonated: 0 };

  const catBreakdown = data?.categoryBreakdown || { Education: 0, Healthcare: 0, Community: 0 };
  const totalCategoryAmount = Object.values(catBreakdown).reduce((s, v) => s + v, 0) || 1;
  const categories = [
    { label: "Education Programs",    pct: Math.round(((catBreakdown.Education || 0) / totalCategoryAmount) * 100), color: "#1abc9c", amount: catBreakdown.Education || 0 },
    { label: "Healthcare & Medicine",  pct: Math.round(((catBreakdown.Healthcare || 0) / totalCategoryAmount) * 100), color: "#0b3c5d", amount: catBreakdown.Healthcare || 0 },
    { label: "Community Welfare",      pct: Math.round(((catBreakdown.Community || 0) / totalCategoryAmount) * 100), color: "#48c9b0", amount: catBreakdown.Community || 0 },
  ];

  const impactMetrics = [
    { icon: BookOpen, label: "Students Supported",     value: "450+",  color: "#1abc9c", desc: "Through education sponsorships" },
    { icon: Stethoscope, label: "Medical Cases",       value: "180+",  color: "#0b3c5d", desc: "Healthcare assistance provided" },
    { icon: Globe, label: "Cities Reached",            value: "12",    color: "#48c9b0", desc: "Across India & Maharashtra" },
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
            {categories.map(u => (
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
              <strong>{topDonor.fullName || "N/A"}</strong>
            </div>
            <div className="adm-stat-row">
              <span>Top Donation</span>
              <strong className="adm-green">{fmt(topDonor.totalDonated || 0)}</strong>
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
              {topDonors.map((u, i) => {
                const uStatus = u.isActive === true ? "Active" : (u.isActive === false ? "Inactive" : "Pending");
                return (
                  <tr key={u.id}>
                    <td>
                      <span className={`adm-rank ${i < 3 ? "adm-rank-top" : ""}`}>#{i + 1}</span>
                    </td>
                    <td>
                      <div className="adm-donor-cell">
                        <div className="adm-avatar-sm">{(u.fullName || "U")[0]}</div>
                        <div>
                          <div className="adm-donor-name">{u.fullName || "User"}</div>
                          <div className="adm-donor-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="adm-muted">{u.city || u.donorCity || "India"}</td>
                    <td><strong className="adm-amount">{fmt(u.totalDonated || 0)}</strong></td>
                    <td className="adm-center"><span className="adm-count-badge">{u.donationCount || 0}</span></td>
                    <td><StatusBadge status={uStatus} /></td>
                  </tr>
                );
              })}
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
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const SECTIONS = {
    overview:         <Overview />,
    donations:        <AllDonations />,
    users:            <UserLogins />,
    "user-donations": <UserDonations />,
    "foreign-donors": <ForeignDonorsSection showToast={showToast} />,
    analytics:        <Analytics />,
    partners:         <PartnersSection showToast={showToast} />,
    stories:          <StoriesSection showToast={showToast} />,
    events:           <EventsSection showToast={showToast} />,
    testimonials:     <TestimonialsSection showToast={showToast} />,
    profile:          <AdminProfilePage showToast={showToast} />,
  };

  const NAV_ITEMS = [
    { id: "overview",       label: "Overview",        icon: LayoutDashboard },
    { id: "donations",      label: "All Donations",   icon: Heart },
    { id: "users",          label: "User Logins",     icon: Users },
    { id: "user-donations", label: "User Donations",  icon: Wallet },
    { id: "foreign-donors", label: "Foreign Donors",  icon: Globe },
    { id: "analytics",      label: "Analytics",       icon: BarChart3 },
    { id: "partners",       label: "Partners",        icon: Handshake },
    { id: "stories",        label: "Stories",         icon: FileText },
    { id: "events",         label: "Events",          icon: Calendar },
    { id: "testimonials",   label: "Testimonials",    icon: MessageSquareQuote },
  ];

  return (
    <div className="adm-root">
      {/* SIDEBAR */}
      <aside className={`adm-sidebar ${sidebarOpen ? "adm-sidebar-open" : "adm-sidebar-collapsed"}`}>
        <div className="adm-sidebar-logo">
          <img src={vidyaLogo} alt="VidyaVaidya Logo" className="adm-logo-img-sidebar" />
          {sidebarOpen && (
            <div className="adm-logo-text">
              <span className="adm-logo-main">VidyaVaidya</span>
              <span className="adm-logo-sub">ADMIN PANEL</span>
            </div>
          )}
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`adm-nav-btn ${activeSection === item.id ? (item.id === "foreign-donors" ? "adm-nav-foreign-active" : "adm-nav-active") : ""}`}
                onClick={() => setActiveSection(item.id)}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="adm-sidebar-footer" />
      </aside>

      {/* MAIN */}
      <div className="adm-main">
        {/* Topbar — redesigned */}
        <AdminNavbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

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
