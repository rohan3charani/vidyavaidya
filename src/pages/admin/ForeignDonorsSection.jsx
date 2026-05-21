import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Mail, Clock, CheckCircle2, AlertTriangle, ArrowUpRight,
  Send, Trash2, ChevronDown, Sparkles, Inbox, X, Building, Calendar,
  Search, Check, MessageSquare
} from "lucide-react";
import api from "../../services/api";

// Strictly A -> Z Alphabetical Global Country List
const COUNTRIES_LIST = [
  "All Countries",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua & Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia & Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts & Nevis",
  "Saint Lucia",
  "Samoa",
  "San Marino",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad & Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

// Mock Sample Data (Using strict country names and zero shortcodes)
const MOCK_DONORS_INITIAL = [
  {
    id: "donor-1",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@globalcare.org",
    country: "United States",
    organization: "Global Care Foundation",
    queryType: "Donation Process",
    createdAt: "2026-05-18T10:15:30.000Z",
    message: "Greetings! Our foundation is highly interested in supporting VidyaVaidya's health initiatives in rural regions of Andhra Pradesh. We want to understand if there is a minimum threshold for overseas funds and if you can provide audited financial statements for the past three fiscal years. Specifically, we would like to direct our donation to your mobile medical vans program. Please let us know the appropriate compliance procedure for wire transfer.",
    status: "Pending",
    adminResponse: "",
    repliedAt: null
  },
  {
    id: "donor-2",
    firstName: "David",
    lastName: "Miller",
    email: "david.miller@hopecharity.uk",
    country: "United Kingdom",
    organization: "Hope Charity UK",
    queryType: "Partnership / Collaboration",
    createdAt: "2026-05-17T14:22:10.000Z",
    message: "We are currently looking for a local NGO partner in Nellore to run educational programs and primary care clinics. Our proposal involves establishing a co-branded program aimed at school-aged children. Can you share details on your current footprint and operational capabilities? Specifically, what is the volunteer-to-student ratio, and how do you track long-term learning outcomes? Let's arrange a call.",
    status: "Solved",
    adminResponse: "Hello David, thank you for reaching out. We would be delighted to partner with Hope Charity UK. VidyaVaidya currently supports over 12 centers in Nellore with a 1:15 volunteer-student ratio. We use standardized periodic progress assessments to track learning outcomes. We will schedule a Microsoft Teams meeting with our partnership board. Looking forward to speaking soon!",
    repliedAt: "2026-05-17T18:45:00.000Z"
  },
  {
    id: "donor-3",
    firstName: "Elena",
    lastName: "Petrov",
    email: "elena.petrov@excellence.ca",
    country: "Canada",
    organization: "Elena & Friends NGO",
    queryType: "Tax Benefits (FCRA)",
    createdAt: "2026-05-16T09:05:15.000Z",
    message: "Hello, I would like to sponsor the higher education of 10 students from your program for the upcoming academic year. Could you send me the profiles or case studies of eligible candidates, and outline how the funds are disbursed? I want to ensure my contribution covers tuition, books, and living expenses. Thanks!",
    status: "Pending",
    adminResponse: "",
    repliedAt: null
  },
  {
    id: "donor-4",
    firstName: "Oliver",
    lastName: "Smith",
    email: "oliver.smith@act-now.au",
    country: "Australia",
    organization: "ActNow Australia",
    queryType: "Volunteer Abroad",
    createdAt: "2026-05-15T11:40:00.000Z",
    message: "Greetings from Sydney! We have a group of 5 skilled medical volunteers (general practitioners and pediatricians) who are planning a trip to Nellore in late 2026. We would love to dedicate 2 weeks to run free health camps in collaboration with VidyaVaidya. What are the local administrative requirements, and can your organization help coordinate site access, logistics, and local language translators for our volunteers during the camp?",
    status: "In Progress",
    adminResponse: "",
    repliedAt: null
  },
  {
    id: "donor-5",
    firstName: "Sophia",
    lastName: "Schneider",
    email: "sophia.schneider@heidelberg-aid.de",
    country: "Germany",
    organization: "Heidelberg Aid",
    queryType: "Tax Benefits (FCRA)",
    createdAt: "2026-05-14T08:30:00.000Z",
    message: "We wish to make a substantial corporate contribution, but we must verify if Heidelberg Aid will be eligible for a tax exemption certificate under the 80G equivalent in Germany or via international treaties. Can you provide your FCRA registration number, your tax exemption status in India, and the necessary paperwork for cross-border tax compliance? This is critical for our audit purposes.",
    status: "Solved",
    adminResponse: "Dear Sophia, thank you for your query. VidyaVaidya is fully registered under the Foreign Contribution Regulation Act (FCRA). We will email you our official registration certificate, our 80G tax exemption number, and a standard cross-border payment compliance guide. We will also provide a tax receipt validating the transaction. Let us know if you need any other legal document.",
    repliedAt: "2026-05-14T11:20:00.000Z"
  },
  {
    id: "donor-6",
    firstName: "Thomas",
    lastName: "Wagner",
    email: "thomas.w@munich-action.de",
    country: "Germany",
    organization: "Munich Action Group",
    queryType: "Partnership / Collaboration",
    createdAt: "2026-05-13T16:50:00.000Z",
    message: "Hello! We are seeking an NGO collaboration focused on primary health education. We have successfully launched programs in nearby regions and want to expand our outreach by integrating our interactive hygiene kits with your rural health modules. Let us know your thoughts on setting up a collaboration pilot.",
    status: "Pending",
    adminResponse: "",
    repliedAt: null
  }
];

export default function ForeignDonorsSection({ showToast: parentShowToast }) {
  // Local state for live data from Firestore
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDonors = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await api.foreignDonors.list();
      setDonors(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch foreign donor inquiries.");
      triggerToast(err.message || "Failed to fetch foreign donor inquiries.", "error");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // Dropdown states
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [queryTypeFilter, setQueryTypeFilter] = useState("All");
  const [isQueryTypeOpen, setIsQueryTypeOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Local Toast notification state
  const [toast, setToast] = useState(null);

  // Expanded query message toggles
  const [expandedMessages, setExpandedMessages] = useState({});

  // Active reply fields
  const [replyTexts, setReplyTexts] = useState({});

  // Dropdown options lists matching provided spec exactly
  const queryTypesList = [
    "All",
    "General Inquiry",
    "Donation Process",
    "Tax Benefits (FCRA)",
    "Partnership / Collaboration",
    "Volunteer Abroad",
    "Other"
  ];

  const statusesList = ["All", "Pending", "In Progress", "Solved"];

  // Refs for clickaway
  const countryRef = useRef(null);
  const queryTypeRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
      if (queryTypeRef.current && !queryTypeRef.current.contains(event.target)) {
        setIsQueryTypeOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show customized Toast notifications
  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    if (parentShowToast) {
      parentShowToast(message, type);
    }
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Toggle full query visibility
  const toggleMessageExpand = (id) => {
    setExpandedMessages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle Response Reply submission
  const handleSubmitReply = async (id) => {
    const text = replyTexts[id];
    if (!text || !text.trim()) {
      triggerToast("Please enter an answer before submitting.", "error");
      return;
    }

    try {
      await api.foreignDonors.respond(id, text.trim(), "Solved");
      // Clear reply text field
      setReplyTexts(prev => ({ ...prev, [id]: "" }));
      triggerToast(`Response answer submitted and email sent successfully!`, "success");
      await fetchDonors(true); // reload list silently
    } catch (err) {
      triggerToast(err.message || "Failed to submit response", "error");
    }
  };

  // Handle deleting a donor record locally
  const handleDeleteDonor = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this foreign donor query?")) return;
    try {
      await api.foreignDonors.delete(id);
      triggerToast("Donor registration deleted successfully.", "info");
      await fetchDonors(true); // reload list silently
    } catch (err) {
      triggerToast(err.message || "Failed to delete query", "error");
    }
  };

  // Change status of a query directly from Actions
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.foreignDonors.updateStatus(id, newStatus);
      triggerToast(`Query status updated to ${newStatus}.`, "info");
      await fetchDonors(true); // reload list silently
    } catch (err) {
      triggerToast(err.message || "Failed to update status", "error");
    }
  };

  // Format dates elegantly (robust to ISO strings, numbers, or Firestore object formats)
  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    let date;
    if (typeof dateInput === "object") {
      if (dateInput._seconds) {
        date = new Date(dateInput._seconds * 1000);
      } else if (dateInput.seconds) {
        date = new Date(dateInput.seconds * 1000);
      } else {
        date = new Date(dateInput);
      }
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Filter donor list dynamically
  const filteredDonors = useMemo(() => {
    return donors.filter(d => {
      const matchCountry = countryFilter === "All Countries" || d.country === countryFilter;
      const matchQueryType = queryTypeFilter === "All" || d.queryType === queryTypeFilter;
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      return matchCountry && matchQueryType && matchStatus;
    });
  }, [donors, countryFilter, queryTypeFilter, statusFilter]);

  // Filter countries for searchable list in strict A-Z order
  const filteredCountriesSearch = useMemo(() => {
    return COUNTRIES_LIST.filter(c =>
      c.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  // Auto-expand textareas dynamically while typing
  const handleTextareaInput = (e, id) => {
    setReplyTexts(prev => ({ ...prev, [id]: e.target.value }));
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const cardVariants = {
    hidden: { y: 15, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 14 }
    }
  };

  if (loading) {
    return (
      <div className="adm-section adm-loading">
        <div className="adm-spinner" />
        <p>Loading foreign donors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adm-section adm-error">
        <div className="adm-error-alert" style={{ background: '#f2dede', color: '#a94442', padding: '15px', borderRadius: '8px', border: '1px solid #ebccd1' }}>
          <strong>Error:</strong> {error}
          <button onClick={() => fetchDonors(false)} className="ml-4 px-3 py-1 bg-rose-700 text-white rounded text-[10px] uppercase font-bold" style={{ cursor: 'pointer' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-section">
      
      {/* Self-contained Premium floating Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className="fixed bottom-5 right-5 z-[9999] pointer-events-auto"
          >
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border text-xs font-bold ${
              toast.type === "success" ? "bg-emerald-600 text-white border-emerald-500" :
              toast.type === "error" ? "bg-rose-600 text-white border-rose-500" :
              "bg-teal-600 text-white border-teal-500"
            }`}>
              {toast.type === "success" ? <CheckCircle2 size={18} /> :
               toast.type === "error" ? <AlertTriangle size={18} /> :
               <Globe size={18} />}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clean Premium Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-5 mb-8">
        <div className="adm-section-header" style={{ marginBottom: 0 }}>
          <h2>Foreign Donors</h2>
          <p>Manage and respond to foreign donor queries and registrations</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Total Queries: {filteredDonors.length}
          </span>
        </div>
      </div>

      {/* Modern SaaS Dropdown Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-50">
        
        {/* Custom Searchable Country Dropdown */}
        <div className="space-y-1.5" ref={countryRef}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Country Filter</label>
          <div className="relative">
            <button
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="w-full h-11 rounded-xl border border-slate-200 hover:border-slate-350 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none bg-white px-4 py-2.5 font-bold text-slate-800 text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-between text-left"
            >
              <span>{countryFilter}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            <AnimatePresence>
              {isCountryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <Search size={12} className="text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-700 outline-none w-full placeholder-slate-400"
                    />
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
                    {filteredCountriesSearch.length === 0 ? (
                      <p className="p-3 text-[10px] font-bold text-slate-400 text-center">No countries matched</p>
                    ) : (
                      filteredCountriesSearch.map(c => (
                        <div
                          key={c}
                          onClick={() => {
                            setCountryFilter(c);
                            setIsCountryOpen(false);
                            setCountrySearch("");
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                            countryFilter === c
                              ? "bg-teal-600 text-white"
                              : "text-slate-700 hover:bg-teal-600 hover:text-white"
                          }`}
                        >
                          <span>{c}</span>
                          {countryFilter === c && <Check size={12} />}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Custom Styled Query Type Dropdown */}
        <div className="space-y-1.5" ref={queryTypeRef}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Query Type Filter</label>
          <div className="relative">
            <button
              onClick={() => setIsQueryTypeOpen(!isQueryTypeOpen)}
              className="w-full h-11 rounded-xl border border-slate-200 hover:border-slate-350 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none bg-white px-4 py-2.5 font-bold text-slate-800 text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-between text-left"
            >
              <span>{queryTypeFilter === "All" ? "All Query Types" : queryTypeFilter}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            <AnimatePresence>
              {isQueryTypeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-1.5"
                >
                  {queryTypesList.map(q => (
                    <div
                      key={q}
                      onClick={() => {
                        setQueryTypeFilter(q);
                        setIsQueryTypeOpen(false);
                      }}
                      className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                        queryTypeFilter === q
                          ? "bg-teal-600 text-white"
                          : "text-slate-700 hover:bg-teal-600 hover:text-white"
                      }`}
                    >
                      <span>{q === "All" ? "All Query Types" : q}</span>
                      {queryTypeFilter === q && <Check size={12} />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Custom Styled Status Dropdown */}
        <div className="space-y-1.5" ref={statusRef}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status Filter</label>
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full h-11 rounded-xl border border-slate-200 hover:border-slate-350 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none bg-white px-4 py-2.5 font-bold text-slate-800 text-xs transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-between text-left"
            >
              <span>{statusFilter === "All" ? "All Statuses" : statusFilter}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            <AnimatePresence>
              {isStatusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-1.5"
                >
                  {statusesList.map(s => (
                    <div
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setIsStatusOpen(false);
                      }}
                      className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                        statusFilter === s
                          ? "bg-teal-600 text-white"
                          : "text-slate-700 hover:bg-teal-600 hover:text-white"
                      }`}
                    >
                      <span>{s === "All" ? "All Statuses" : s}</span>
                      {statusFilter === s && <Check size={12} />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Main SaaS Card-Style Rows Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 z-10 relative"
      >
        {filteredDonors.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl py-24 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto px-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
                <Inbox size={30} />
              </div>
              <h4 className="font-black text-black text-base leading-none">No Registrations Found</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                No foreign donor inquiries match your current filters. Try resetting the country, status, or query type selections.
              </p>
              <button
                onClick={() => { setCountryFilter("All Countries"); setQueryTypeFilter("All"); setStatusFilter("All"); }}
                className="mt-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-black text-xs transition-all cursor-pointer shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          filteredDonors.map((donor) => {
            const isExpanded = expandedMessages[donor.id];
            const messageText = donor.message;
            const isLongMessage = messageText.length > 130;

            const statusColors = {
              Pending: "bg-amber-50 text-amber-800 border-amber-200",
              "In Progress": "bg-blue-50 text-blue-800 border-blue-200",
              Solved: "bg-emerald-50 text-emerald-800 border-emerald-200"
            }[donor.status] || "bg-slate-50 text-slate-500 border-slate-200";

            // Determine if Submit button should be enabled
            const hasResponseText = replyTexts[donor.id] && replyTexts[donor.id].trim().length > 0;

            return (
              <motion.div
                key={donor.id}
                variants={cardVariants}
                className="bg-white border border-slate-200 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                
                {/* 1. Header Metadata Section (Clean typography & Perfect Spacing) */}
                <div className="p-6 md:px-8 md:py-6 bg-slate-50/40 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 items-center">
                  
                  {/* Name & Organization */}
                  <div className="lg:col-span-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center font-black text-teal-700 text-xs shadow-sm flex-shrink-0">
                      {donor.firstName[0]}{donor.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-black leading-none tracking-tight">
                        {donor.firstName} {donor.lastName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1.5 flex items-center gap-1.5 uppercase">
                        <Building size={10} /> {donor.organization || "Private Individual"}
                      </p>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="lg:col-span-1.5 min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Email Address</span>
                    <a href={`mailto:${donor.email}`} className="text-xs font-bold text-black hover:text-teal-600 transition-colors flex items-center gap-1.5 truncate">
                      <Mail size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{donor.email}</span>
                    </a>
                  </div>

                  {/* Strictly Full Country Name (No codes like US, DE) */}
                  <div className="lg:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Country</span>
                    <span className="text-xs font-bold text-black flex items-center gap-1.5">
                      <span>{donor.country}</span>
                    </span>
                  </div>

                  {/* Submitted Date */}
                  <div className="lg:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Submitted</span>
                    <span className="text-xs font-bold text-black flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400 flex-shrink-0" />
                      <span>{formatDate(donor.createdAt).split(",")[0]}</span>
                    </span>
                  </div>

                  {/* Status Badge & Trash Action */}
                  <div className="lg:col-span-0.5 flex items-center justify-between sm:justify-end gap-3 lg:justify-end">
                    <span className={`inline-flex px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${statusColors}`}>
                      {donor.status}
                    </span>
                    
                    <button
                      onClick={() => handleDeleteDonor(donor.id)}
                      className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-100 shadow-sm transition-all cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                </div>

                {/* 2. Inner Grid Section: Highlighted Message Container vs Custom Response Box */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Left Column: Highlighted Donor Message Box */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        Donor Message
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-wider">
                        {donor.queryType}
                      </span>
                    </div>
                    
                    {/* Emphasized message box container with elegant borders & visual depth */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
                      <div className="text-xs text-black leading-relaxed font-bold tracking-wide">
                        {isExpanded || !isLongMessage ? (
                          <p>{messageText}</p>
                        ) : (
                          <p>{messageText.slice(0, 130)}...</p>
                        )}
                      </div>
                      
                      {isLongMessage && (
                        <button
                          onClick={() => toggleMessageExpand(donor.id)}
                          className="mt-3 text-teal-600 hover:text-teal-700 font-black text-[10px] tracking-widest uppercase flex items-center gap-1.5 hover:underline cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? "Show Less" : "Read Full Message"}</span>
                          <ArrowUpRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Response Input Panels */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Admin Response
                    </span>

                    <AnimatePresence mode="wait">
                      {donor.status === "Solved" ? (
                        // Solved State Card (Footnote completely removed)
                        <motion.div
                          key="solved"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-emerald-500/5 border-2 border-emerald-100 rounded-2xl p-5 space-y-3 shadow-inner"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 size={11} className="text-emerald-700" /> Solved Successfully
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">
                              Replied {formatDate(donor.repliedAt)}
                            </span>
                          </div>
                          
                          <div className="bg-white border border-emerald-100 p-4 rounded-xl shadow-sm">
                            <p className="text-black leading-relaxed font-bold italic text-xs">
                              "{donor.adminResponse}"
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        // Editing / Typing state
                        <motion.div
                          key="editing"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          <div className="relative">
                            <textarea
                              rows={3}
                              placeholder="Type a professional response answer for this foreign donor..."
                              value={replyTexts[donor.id] || ""}
                              onChange={(e) => handleTextareaInput(e, donor.id)}
                              className="w-full text-xs p-4 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none bg-white font-bold text-black leading-relaxed resize-none shadow-sm transition-all duration-300 placeholder-slate-350 overflow-hidden"
                            />
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                            {/* Inline status select */}
                            <div className="flex-1 flex items-center gap-2 border-2 border-slate-200 rounded-xl px-3 bg-white h-10">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Mark Status:</span>
                              <select
                                value={donor.status}
                                onChange={(e) => handleUpdateStatus(donor.id, e.target.value)}
                                className="text-[10px] font-black text-slate-800 bg-transparent focus:outline-none cursor-pointer w-full"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Solved">Solved</option>
                              </select>
                            </div>

                            {/* Submit Answer (Initially disabled, transitions cleanly to glowing gradient on typing) */}
                            <button
                              onClick={() => handleSubmitReply(donor.id)}
                              disabled={!hasResponseText}
                              className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-black transition-all duration-300 ${
                                hasResponseText
                                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 cursor-pointer opacity-100"
                                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <Send size={12} className="relative top-[0.5px]" />
                              <span>Submit Answer</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </motion.div>
            );
          })
        )}
      </motion.div>

    </div>
  );
}
