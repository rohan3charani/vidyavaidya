import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search,
  Calendar, FileText, Handshake, X, Download, ShieldAlert,
  Users, CheckSquare, Square, Building2, HeartPulse, HandHeart,
  GraduationCap, BriefcaseBusiness, Eye, Check, AlertCircle,
  MapPin, Globe, Phone, Mail, User, Info, ArrowRight, ExternalLink,
  Newspaper, Sparkles, Clock, Video, Image, BookOpen, Tags, EyeOff, Play, Film,
  CalendarDays, Clapperboard, Images, CalendarHeart, MessageSquareQuote, Star
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

/* ══════════════════════════════════════════════
   HELPERS & COMMON COMPONENT UTILITIES
   ══════════════════════════════════════════════ */

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const fmtDate = (dStr) => {
  if (!dStr) return "—";
  
  // Handle Firestore Timestamp objects gracefully
  if (typeof dStr === 'object' && dStr._seconds) {
    const d = new Date(dStr._seconds * 1000);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  try {
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return String(dStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch (e) {
    return String(dStr);
  }
};

export const handleFileUpload = async (file, onUrlChange) => {
  try {
    const response = await api.stories.getUploadUrl(file.name, file.type);
    const { uploadUrl, publicUrl } = response;
    
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    onUrlChange(publicUrl);
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

/* ══════════════════════════════════════════════
   SHARED CMS UI COMPONENTS
   ══════════════════════════════════════════════ */

export function SkeletonRows({ cols }) {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <tr key={i}>
          <td colSpan={cols} style={{ padding: 0 }}>
            <div className="adm-skeleton-row">
              <div className="adm-skeleton-line" style={{ width: '85%' }} />
              <div className="adm-skeleton-line" style={{ width: '60%' }} />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function LiveImagePreview({ url }) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!url) {
      setIsValid(false);
      return;
    }
    const img = new Image();
    img.src = url;
    img.onload = () => setIsValid(true);
    img.onerror = () => setIsValid(false);
  }, [url]);

  return (
    <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
      {url ? (
        isValid ? (
          <img src={url} className="w-full h-full object-cover" alt="Live preview" />
        ) : (
          <div className="text-[9px] font-bold text-rose-500 text-center leading-tight p-1 uppercase">Invalid</div>
        )
      ) : (
        <div className="text-[9px] font-bold text-slate-400 text-center leading-tight p-1 uppercase">No Image</div>
      )}
    </div>
  );
}

export function ImageUrlWithUpload({ label, value, onChange, onUploadError }) {
  const [uploading, setUploading] = useState(false);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await handleFileUpload(file, onChange);
    } catch (err) {
      if (onUploadError) onUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex gap-3 items-start w-full">
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-200"
            placeholder="Paste URL or upload file..."
          />
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-100/60 text-teal-700 font-extrabold text-[10px] transition-all cursor-pointer select-none">
              {uploading ? "Uploading..." : "Upload File"}
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {value && <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">✓ Loaded</span>}
          </div>
        </div>
        <LiveImagePreview url={value} />
      </div>
    </div>
  );
}

export function TagInput({ tags = [], onChange, placeholder = "Type and press Enter..." }) {
  const [input, setInput] = useState("");
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.trim();
      if (val && !tags.includes(val)) {
        onChange([...tags, val]);
      }
      setInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="adm-tag-input-box">
      {tags.map((tag, index) => (
        <span key={index} className="adm-tag-chip">
          {tag}
          <button type="button" onClick={() => removeTag(index)}>×</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
      />
    </div>
  );
}

export function RepeatableGroup({ items = [], onChange, onAddItem, label, fields }) {
  const handleFieldChange = (index, fieldName, value) => {
    const updated = items.map((item, i) => {
      if (i === index) {
        return { ...item, [fieldName]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const removeItem = (indexToRemove) => {
    onChange(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="adm-repeatable-group">
      {items.map((item, index) => (
        <div key={index} className="adm-repeatable-item">
          <div className="adm-repeatable-item-header">
            <span className="adm-repeatable-item-title">{label} #{index + 1}</span>
            <button
              type="button"
              className="adm-repeatable-remove"
              onClick={() => removeItem(index)}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="adm-form-row">
            {fields.map((f) => (
              <div key={f.name} className="adm-form-group">
                <label>{f.label}</label>
                <input
                  type={f.type || "text"}
                  value={item[f.name] || ""}
                  placeholder={f.placeholder || ""}
                  onChange={(e) => handleFieldChange(index, f.name, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="button" className="adm-add-group-btn" onClick={onAddItem}>
        + Add {label}
      </button>
    </div>
  );
}

export function SharedDrawer({ isOpen, onClose, title, children, footer }) {
  if (typeof window === "undefined" || !document.body) return null;
  return createPortal(
    <>
      {isOpen && <div className="adm-drawer-overlay" onClick={onClose} />}
      <div className={`adm-drawer ${isOpen ? "open" : ""}`}>
        <div className="adm-drawer-header">
          <h3>{title}</h3>
          <button type="button" className="adm-drawer-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="adm-drawer-body">
          {children}
        </div>
        {footer && <div className="adm-drawer-footer">{footer}</div>}
      </div>
    </>,
    document.body
  );
}

export function MultiImageInput({ value = [], onChange, showToast }) {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleAdd = () => {
    const url = input.trim();
    if (url && !value.includes(url)) {
      onChange([...value, url]);
    }
    setInput("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await handleFileUpload(file, (url) => {
        onChange([...value, url]);
      });
    } catch (err) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (urlToRemove) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="adm-form-group">
      <label>Gallery Images</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Paste URL or select file..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="button" className="adm-btn adm-btn-primary" style={{ height: '42px' }} onClick={handleAdd}>Add</button>
        <label className="adm-btn adm-btn-ghost" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', height: '42px' }}>
          {uploading ? "..." : "Upload"}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '10px' }}>
        {value.map((url, i) => (
          <div key={i} style={{ position: 'relative', width: '80px', height: '80px', border: '1px dashed var(--ad-border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery preview" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(231,76,60,0.9)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PARTNERS SECTION
   ══════════════════════════════════════════════ */

const optStr = () => z.string().optional().default("");

const partnerSchema = z.object({
  name: z.string().min(2, { message: "Partner Name must be at least 2 characters" }),
  type: z.enum(["hospital", "ngo", "educational", "corporate", "government"]),
  city:                optStr(),
  state:               optStr(),
  description:         optStr(),
  shortBio:            optStr(),
  logoUrl:             optStr(),
  coverImageUrl:       optStr(),
  websiteUrl:          optStr(),
  contactEmail:        optStr(),
  contactPhone:        optStr(),
  partnershipStartDate: optStr(),
  displayOrder:        z.coerce.number().int().optional().default(10),
  isFeatured:          z.boolean().optional().default(false),
  isActive:            z.boolean().optional().default(true),
  address:             optStr(),
  country:             optStr(),
  linkedinUrl:         optStr(),
  twitterUrl:          optStr(),
  facebookUrl:         optStr(),
  instagramUrl:        optStr()
});

export function PartnersSection({ showToast }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editPartner, setEditPartner] = useState(null);
  const [viewPartner, setViewPartner] = useState(null);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState(0);
  const [isFromHeader, setIsFromHeader] = useState(false);
  const PER_PAGE = 8;

  useEffect(() => {
    if (drawerOpen || viewDrawerOpen || deleteModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, viewDrawerOpen, deleteModalOpen]);

  const { register, handleSubmit, reset, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      type: "hospital",
      shortBio: "",
      description: "",
      logoUrl: "",
      coverImageUrl: "",
      websiteUrl: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      partnershipStartDate: "",
      displayOrder: 10,
      isFeatured: false,
      isActive: true,
      linkedinUrl: "",
      twitterUrl: "",
      facebookUrl: "",
      instagramUrl: ""
    }
  });
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await api.partners.list();
      setPartners(data.partners || []);
    } catch (err) {
      showToast(err.message || "Failed to load partners", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const stats = useMemo(() => {
    const total = partners.length;
    const hospitals = partners.filter(p => p.type === 'hospital').length;
    const ngos = partners.filter(p => p.type === 'ngo').length;
    const educational = partners.filter(p => p.type === 'educational').length;
    const corporate = partners.filter(p => p.type === 'corporate').length;
    const volunteer = partners.filter(p => p.type === 'government').length;
    return { total, hospitals, ngos, educational, corporate, volunteer };
  }, [partners]);

  const partnerTypes = [
    {
      type: "hospital",
      title: "Hospital",
      desc: "Medical care networks, health centers, and clinical partners.",
      icon: HeartPulse,
      color: "text-teal-600",
      border: "border-teal-500",
      bg: "bg-teal-50"
    },
    {
      type: "ngo",
      title: "NGO",
      desc: "Non-profit groups, charities, and grassroots organizations.",
      icon: HandHeart,
      color: "text-orange-600",
      border: "border-orange-500",
      bg: "bg-orange-50"
    },
    {
      type: "educational",
      title: "Educational Institution",
      desc: "Schools, universities, and academic trust alliances.",
      icon: GraduationCap,
      color: "text-blue-600",
      border: "border-blue-500",
      bg: "bg-blue-50"
    },
    {
      type: "corporate",
      title: "Corporate",
      desc: "CSR partners, corporate sponsors, and business alliances.",
      icon: BriefcaseBusiness,
      color: "text-purple-600",
      border: "border-purple-500",
      bg: "bg-purple-50"
    },
    {
      type: "government",
      title: "Volunteer Network",
      desc: "Active volunteers, community groups, and local workers.",
      icon: Users,
      color: "text-rose-600",
      border: "border-rose-500",
      bg: "bg-rose-50"
    }
  ];

  const handleOpenAdd = (preselectedType = "hospital", fromHeader = false) => {
    setIsFromHeader(fromHeader);
    setEditPartner(null);
    setActiveFormTab(0);
    reset({
      name: "",
      type: preselectedType,
      shortBio: "",
      description: "",
      logoUrl: "",
      coverImageUrl: "",
      websiteUrl: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      partnershipStartDate: "",
      displayOrder: 10,
      isFeatured: false,
      isActive: true,
      linkedinUrl: "",
      twitterUrl: "",
      facebookUrl: "",
      instagramUrl: ""
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (partner) => {
    setIsFromHeader(false);
    setEditPartner(partner);
    setActiveFormTab(0);
    reset({
      name: partner.name || "",
      type: partner.type || "hospital",
      shortBio: partner.shortBio || "",
      description: partner.description || "",
      logoUrl: partner.logoUrl || "",
      coverImageUrl: partner.coverImageUrl || "",
      websiteUrl: partner.websiteUrl || "",
      contactEmail: partner.contactEmail || "",
      contactPhone: partner.contactPhone || "",
      address: partner.address || "",
      city: partner.city || "",
      state: partner.state || "",
      country: partner.country || "India",
      partnershipStartDate: partner.partnershipStartDate || "",
      displayOrder: partner.displayOrder ?? 10,
      isFeatured: !!partner.isFeatured,
      isActive: !!partner.isActive,
      linkedinUrl: partner.linkedinUrl || "",
      twitterUrl: partner.twitterUrl || "",
      facebookUrl: partner.facebookUrl || "",
      instagramUrl: partner.instagramUrl || ""
    });
    setDrawerOpen(true);
  };

  const handleNextStep = async () => {
    let fieldsToValidate = [];
    if (activeFormTab === 0) {
      fieldsToValidate = ["name"];
    }
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setActiveFormTab(prev => prev + 1);
    }
  };

  const handleOpenView = (partner) => {
    setViewPartner(partner);
    setViewDrawerOpen(true);
  };

  const handleDeleteClick = (partner) => {
    setPartnerToDelete(partner);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!partnerToDelete) return;
    try {
      await api.partners.delete(partnerToDelete.id);
      showToast("Partner deleted successfully", "success");
      setDeleteModalOpen(false);
      setPartnerToDelete(null);
      fetchPartners();
    } catch (err) {
      showToast(err.message || "Failed to delete partner", "error");
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editPartner) {
        await api.partners.update(editPartner.id, data);
        showToast("Partner updated successfully", "success");
      } else {
        await api.partners.create(data);
        showToast("Partner created successfully", "success");
      }
      setDrawerOpen(false);
      fetchPartners();
    } catch (err) {
      showToast(err.message || "Failed to save partner", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (partner) => {
    try {
      const updatedStatus = !partner.isActive;
      await api.partners.update(partner.id, { isActive: updatedStatus });
      showToast(`Partner ${updatedStatus ? "activated" : "deactivated"} successfully`, "success");
      fetchPartners();
    } catch (err) {
      showToast(err.message || "Failed to toggle partner status", "error");
    }
  };

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "All" || p.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [partners, search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="adm-section">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="adm-section-header">
          <h2>Partners</h2>
          <p>Manage VidyaVaidya collaborations, medical networks, and CSR alignments</p>
        </div>
        <button 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/20 flex items-center gap-2 border-none text-sm"
          onClick={() => handleOpenAdd("hospital", true)}
        >
          <Plus className="w-5 h-5" /> Add New Partner
        </button>
      </div>

      {/* Analytics dashboard widgets - Matched exactly to the names below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { title: "Hospital", count: stats.hospitals, icon: HeartPulse, text: "text-teal-600" },
          { title: "NGO", count: stats.ngos, icon: HandHeart, text: "text-orange-600" },
          { title: "Educational Institution", count: stats.educational, icon: GraduationCap, text: "text-blue-600" },
          { title: "Corporate", count: stats.corporate, icon: BriefcaseBusiness, text: "text-purple-600" },
          { title: "Volunteer Network", count: stats.volunteer, icon: Users, text: "text-rose-600" }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between transition-all duration-300"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h4 className="text-3xl font-extrabold text-slate-800 mt-1">{card.count}</h4>
              </div>
              <div className={`p-3 rounded-xl bg-slate-50 ${card.text}`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Filter Clear Control (Search Box Completely Removed) */}
      {typeFilter !== "All" && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => { setTypeFilter("All"); setPage(1); }}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 shadow-sm transition-colors"
          >
            Clear Filter: <span className="capitalize font-bold">{typeFilter}</span> ×
          </button>
        </div>
      )}

      {/* Modern Clickable Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {partnerTypes.map((pt) => {
          const Icon = pt.icon;
          const isSelected = typeFilter === pt.type;
          return (
            <motion.div
              key={pt.type}
              whileHover={{ y: -4 }}
              onClick={() => {
                setTypeFilter(isSelected ? "All" : pt.type);
                setPage(1);
              }}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center min-h-[170px] ${
                isSelected
                  ? "border-teal-600 bg-white shadow-lg shadow-teal-600/5 ring-1 ring-teal-600"
                  : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              
              {/* Centered Glowing Glassmorphism Icon with CSS transitions */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md mb-4 border ${
                pt.type === 'hospital' ? 'text-teal-600 shadow-teal-500/10 border-teal-100 bg-teal-50/50' :
                pt.type === 'ngo' ? 'text-orange-600 shadow-orange-500/10 border-orange-100 bg-orange-50/50' :
                pt.type === 'educational' ? 'text-blue-600 shadow-blue-500/10 border-blue-100 bg-blue-50/50' :
                pt.type === 'corporate' ? 'text-purple-600 shadow-purple-500/10 border-purple-100 bg-purple-50/50' :
                'text-rose-600 shadow-rose-500/10 border-rose-100 bg-rose-50/50'
              }`}>
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h4 className="font-extrabold text-slate-800 text-sm leading-snug mb-3">{pt.title}</h4>
              
              <div className="flex flex-col items-center gap-2 w-full mt-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {partners.filter(p => p.type === pt.type).length} Active
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAdd(pt.type);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 border-none flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main SaaS Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Logo / Partner</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">Display Order</th>
                <th className="py-4 px-6">Featured</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Established</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <SkeletonRows cols={8} />
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                        <Handshake className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800">No Matching Partners Registered</h4>
                      <button
                        onClick={() => {
                          setSearch("");
                          setTypeFilter("All");
                          setPage(1);
                        }}
                        className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-md shadow-slate-800/10 border-none"
                      >
                        Display All Partners Details
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors text-slate-600 text-sm">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {p.logoUrl ? (
                          <img src={p.logoUrl} className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm" alt={p.name} />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shadow-sm">🤝</div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800 text-base">{p.name}</p>
                          <p className="text-xs text-slate-400 max-w-[200px] truncate">{p.shortBio || "No overview provided"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                        p.type === 'hospital' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                        p.type === 'ngo' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        p.type === 'educational' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        p.type === 'corporate' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">{p.city || "—"}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{p.displayOrder ?? 10}</td>
                    <td className="py-4 px-6">
                      {p.isFeatured ? (
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">Featured</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                          p.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {p.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-semibold">{fmtDate(p.created_at || p.createdAt)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 transition-colors"
                          title="Edit Partner"
                          onClick={() => handleOpenEdit(p)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-colors"
                          title="Delete Partner"
                          onClick={() => handleDeleteClick(p)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-bold">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    page === p
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Centered Form Modal Overlay (No Scroll, Perfectly Aligned & Fixed) */}
      {typeof window !== "undefined" && document.body && createPortal(
        <AnimatePresence>
          {drawerOpen && (
            <div 
              className="fixed inset-0 z-[1500] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
              onClick={() => setDrawerOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden h-full max-h-[85vh] md:max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
              {/* Modal Header */}
              <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editPartner ? "Edit Partner Alignment" : "Add Partner Alignment"}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Define collaboration profile and digital credentials</p>
                </div>
                <button
                  type="button"
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Tab Navigation (Clicking Disabled to Enforce Step Progress) */}
              <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex gap-2">
                {[
                  { name: "1. Basic Info", fields: ["name", "type", "shortBio", "description"] },
                  { name: "2. Contact & Location", fields: ["city", "state", "websiteUrl", "contactEmail", "contactPhone", "address", "country"] },
                  { name: "3. Partnership & Socials", fields: ["partnershipStartDate", "displayOrder", "linkedinUrl", "twitterUrl", "facebookUrl", "instagramUrl"] }
                ].map((t, idx) => {
                  const hasErrors = t.fields.some(f => !!errors[f]);
                  return (
                    <div
                      key={idx}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 select-none ${
                        activeFormTab === idx
                          ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                          : "bg-slate-50 text-slate-400"
                      } ${hasErrors ? "ring-2 ring-rose-500/30 text-rose-600 bg-rose-50" : ""}`}
                    >
                      {t.name}
                      {hasErrors && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                    </div>
                  );
                })}
              </div>

              {/* Modal Body - Fixed, perfectly sized, no outer scrollbar for the modal */}
              <div className="p-4 md:p-5 flex-1 overflow-hidden flex flex-col min-h-0 justify-between">
                <form className="space-y-3.5 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
                  {activeFormTab === 0 && (
                    <div className="space-y-3.5">
                      {/* Basic Info Section Card */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                          <FileText className="w-4.5 h-4.5 text-teal-600" />
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Basic Info</h4>
                        </div>
                        
                        {isFromHeader ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Name *</label>
                              <input
                                type="text"
                                {...register("name")}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                                placeholder="Hospital/Company/Organization Name"
                              />
                              {errors.name && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.name.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Type *</label>
                              <select
                                {...register("type")}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-bold text-slate-700 cursor-pointer"
                              >
                                <option value="hospital">Hospital</option>
                                <option value="ngo">NGO</option>
                                <option value="educational">Educational Institution</option>
                                <option value="corporate">Corporate</option>
                                <option value="government">Volunteer Network</option>
                              </select>
                              {errors.type && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.type.message}</span>}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Name *</label>
                            <input
                              type="text"
                              {...register("name")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                              placeholder="Hospital/Company/Organization Name"
                            />
                            {errors.name && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.name.message}</span>}
                          </div>
                        )}

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Person & Short Bio (max 150 chars)</label>
                          <textarea
                            {...register("shortBio")}
                            maxLength={150}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                            placeholder="e.g. Dr. A. K. Sharma (Medical Chief) — Delivering pediatric support campaigns."
                            rows={2}
                          />
                          <span className="text-[10px] text-right font-bold text-slate-400">{(watch("shortBio") || "").length}/150</span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Collaboration Description</label>
                          <textarea
                            {...register("description")}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                            placeholder="Detail the collaborative partnership scope, goals, and key accomplishments..."
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Media Uploads Section Card */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                          <Building2 className="w-4.5 h-4.5 text-teal-600" />
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Media Uploads</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <ImageUrlWithUpload
                            label="Partner Logo URL / Image Upload"
                            value={watch("logoUrl")}
                            onChange={(url) => setValue("logoUrl", url, { shouldValidate: true })}
                            onUploadError={(err) => showToast(err, "error")}
                          />
                          <ImageUrlWithUpload
                            label="Cover Banner URL / Image Upload"
                            value={watch("coverImageUrl")}
                            onChange={(url) => setValue("coverImageUrl", url, { shouldValidate: true })}
                            onUploadError={(err) => showToast(err, "error")}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFormTab === 1 && (
                    <div className="space-y-4">
                      {/* Contact Details Card */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                          <Phone className="w-4.5 h-4.5 text-teal-600" />
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Details</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
                            <input
                              type="text"
                              {...register("websiteUrl")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                              placeholder="https://example.com"
                            />
                            {errors.websiteUrl && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.websiteUrl.message}</span>}
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Email</label>
                            <input
                              type="email"
                              {...register("contactEmail")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                              placeholder="partner@example.com"
                            />
                            {errors.contactEmail && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.contactEmail.message}</span>}
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Phone</label>
                            <input
                              type="text"
                              {...register("contactPhone")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                              placeholder="9876543210"
                            />
                            {errors.contactPhone && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.contactPhone.message}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Location Details Card */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                          <MapPin className="w-4.5 h-4.5 text-teal-600" />
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Location Details</h4>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Street Address</label>
                          <input
                            type="text"
                            {...register("address")}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                            placeholder="Building, Street, Area"
                          />
                          {errors.address && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.address.message}</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City *</label>
                            <input
                              type="text"
                              {...register("city")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                              placeholder="e.g. Nellore"
                            />
                            {errors.city && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.city.message}</span>}
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State *</label>
                            <input
                              type="text"
                              {...register("state")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                              placeholder="e.g. Andhra Pradesh"
                            />
                            {errors.state && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.state.message}</span>}
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country *</label>
                            <input
                              type="text"
                              {...register("country")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                              placeholder="India"
                            />
                            {errors.country && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.country.message}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFormTab === 2 && (
                    <div className="space-y-4">
                      {/* Partnership Details Card */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                          <Handshake className="w-4.5 h-4.5 text-teal-600" />
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Partnership Details</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partnership Start Date</label>
                            <input
                              type="date"
                              {...register("partnershipStartDate")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                            />
                            {errors.partnershipStartDate && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.partnershipStartDate.message}</span>}
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Order (Priority) *</label>
                            <input
                              type="number"
                              {...register("displayOrder")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-semibold"
                              placeholder="10"
                            />
                            {errors.displayOrder && <span className="text-rose-500 text-[11px] font-bold mt-0.5">{errors.displayOrder.message}</span>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                          <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                            <span className="text-xs font-bold text-slate-600">Featured Placement</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                {...register("isFeatured")}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                            </div>
                          </label>

                          <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                            <span className="text-xs font-bold text-slate-600">Active status</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                {...register("isActive")}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Social Links Card */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                          <Globe className="w-4.5 h-4.5 text-teal-600" />
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Social Links</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
                            <input
                              type="text"
                              {...register("linkedinUrl")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium text-slate-700"
                              placeholder="https://linkedin.com/company/..."
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Twitter URL</label>
                            <input
                              type="text"
                              {...register("twitterUrl")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium text-slate-700"
                              placeholder="https://twitter.com/..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Facebook URL</label>
                            <input
                              type="text"
                              {...register("facebookUrl")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium text-slate-700"
                              placeholder="https://facebook.com/..."
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instagram URL</label>
                            <input
                              type="text"
                              {...register("instagramUrl")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium text-slate-700"
                              placeholder="https://instagram.com/..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {Object.keys(errors).length > 0 ? (
                  <div className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 animate-bounce" /> Please fix validation errors.
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">Step {activeFormTab + 1} of 3</span>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Cancel
                  </button>
                  {activeFormTab > 0 && (
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                      onClick={() => setActiveFormTab(activeFormTab - 1)}
                    >
                      Previous
                    </button>
                  )}
                  {activeFormTab < 2 ? (
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                      onClick={handleNextStep}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-lg shadow-teal-600/15"
                      onClick={handleSubmit(onSubmit)}
                      disabled={saving}
                    >
                      {saving ? "Saving Changes..." : "Save Partner"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}



      {/* Delete Confirmation Dialog Modal */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setPartnerToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Confirm Partner Removal"
        message={`Are you absolute sure you want to permanently delete partner "${partnerToDelete?.name}"? All related collaboration bio files and directory entries will be unlinked.`}
      />

    </div>
  );
}

function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (typeof window === "undefined" || !document.body) return null;
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100"
          >
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <ShieldAlert className="w-8 h-8" />
              <h3 className="text-xl font-extrabold text-slate-800">{title}</h3>
            </div>
            <p className="text-slate-500 text-sm font-semibold mb-6 leading-relaxed">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/20"
              >
                Yes, Remove Partner
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ══════════════════════════════════════════════
   NEWS ARTICLES & MEDIA SECTION (REDESIGNED)
   ══════════════════════════════════════════════ */

// Zod Schema for Article / Story validation
const storySchema = z.object({
  type: z.string().optional().default("news"),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  content: z.string().optional().default(""),
  excerpt: z.string().optional().default(""),
  coverImageUrl: z.string().optional().default(""),
  galleryImages: z.array(z.string()).optional().default([]),
  videoUrl: z.string().optional().default(""),
  videoDuration: z.string().optional().default(""),
  videoThumbnailUrl: z.string().optional().default(""),
  externalUrl: z.string().optional().default(""),
  sourceByline: z.string().optional().default("Vidyavaidya Board"),
  authorName: z.string().optional().default("Vidyavaidya Board"),
  publishedAt: z.string().optional().default(""),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([])
});

export function StoriesSection({ showToast }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Preview Modal States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewStory, setPreviewStory] = useState(null);

  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const { register, handleSubmit, control, reset, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(storySchema),
    defaultValues: {
      type: "news",
      title: "",
      content: "",
      excerpt: "",
      coverImageUrl: "",
      galleryImages: [],
      videoUrl: "",
      videoDuration: "",
      videoThumbnailUrl: "",
      externalUrl: "",
      sourceByline: "Vidyavaidya Board",
      authorName: "",
      publishedAt: new Date().toISOString().substring(0, 16),
      isFeatured: false,
      isPublished: false,
      tags: []
    }
  });

  const selectedType = watch("type");
  const excerptVal = watch("excerpt") || "";
  const titleVal = watch("title") || "";

  // Dynamic background scrolling control
  useEffect(() => {
    if (isModalOpen || isPreviewOpen || deleteModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isPreviewOpen, deleteModalOpen]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const data = await api.stories.list();
      setStories(data.stories || []);
    } catch (err) {
      showToast(err.message || "Failed to load articles", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Story Category Stats Widgets
  const stats = useMemo(() => {
    const total = stories.length;
    const news = stories.filter(s => s.type === 'news' || s.type === 'press').length;
    const impact = stories.filter(s => s.type === 'impact').length;
    const blog = stories.filter(s => s.type === 'blog').length;
    const media = stories.filter(s => s.type === 'gallery_photo' || s.type === 'gallery_video' || s.type === 'publishing').length;
    return { total, news, impact, blog, media };
  }, [stories]);

  const handleOpenAdd = () => {
    setEditStory(null);
    reset({
      type: "news",
      title: "",
      content: "",
      excerpt: "",
      coverImageUrl: "",
      galleryImages: [],
      videoUrl: "",
      videoDuration: "",
      videoThumbnailUrl: "",
      externalUrl: "",
      sourceByline: "Vidyavaidya Board",
      authorName: "Vidyavaidya Board",
      publishedAt: new Date().toISOString().substring(0, 16),
      isFeatured: false,
      isPublished: false,
      tags: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (story) => {
    setEditStory(story);
    reset({
      type: story.type || "news",
      title: story.title || "",
      content: story.content || "",
      excerpt: story.excerpt || "",
      coverImageUrl: story.coverImageUrl || "",
      galleryImages: story.galleryImages || [],
      videoUrl: story.videoUrl || "",
      videoDuration: story.videoDuration || "",
      videoThumbnailUrl: story.videoThumbnailUrl || "",
      externalUrl: story.externalUrl || "",
      sourceByline: story.sourceByline || "Vidyavaidya Board",
      authorName: story.authorName || "",
      publishedAt: story.publishedAt ? new Date(story.publishedAt).toISOString().substring(0, 16) : new Date().toISOString().substring(0, 16),
      isFeatured: !!story.isFeatured,
      isPublished: !!story.isPublished,
      tags: story.tags || []
    });
    setIsModalOpen(true);
  };

  const handleOpenPreview = (story) => {
    setPreviewStory(story);
    setIsPreviewOpen(true);
  };

  const handleDeleteClick = (story) => {
    setStoryToDelete(story);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!storyToDelete) return;
    try {
      await api.stories.delete(storyToDelete.id);
      showToast("Article deleted successfully", "success");
      setDeleteModalOpen(false);
      setStoryToDelete(null);
      fetchStories();
    } catch (err) {
      showToast(err.message || "Failed to delete article", "error");
    }
  };

  const handleTogglePublished = async (story) => {
    try {
      const newPublished = !story.isPublished;
      const updateData = { isPublished: newPublished };
      if (newPublished && !story.publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }
      await api.stories.update(story.id, updateData);
      showToast(`Article ${newPublished ? "published" : "drafted"} successfully`, "success");
      fetchStories();
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const onSubmit = async (data) => {
    if (!data.title) return showToast("Article title is required", "error");
    if (!data.coverImageUrl) return showToast("Please upload an image", "error");

    setSaving(true);
    try {
      const dataToSave = {
        ...data,
        type: "news",
        isPublished: true,
        isFeatured: true,
        content: data.content || "Vidyavaidya featured article.",
        excerpt: data.excerpt || "Vidyavaidya featured article.",
        publishedAt: new Date().toISOString()
      };

      if (editStory) {
        await api.stories.update(editStory.id, dataToSave);
        showToast("Article updated successfully", "success");
      } else {
        await api.stories.create(dataToSave);
        showToast("Article created successfully", "success");
      }
      setIsModalOpen(false);
      fetchStories();
    } catch (err) {
      showToast(err.message || "Failed to save article", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredStories = useMemo(() => {
    if (!searchQuery) return stories;
    const query = searchQuery.toLowerCase();
    return stories.filter((s) => {
      const titleMatch = s.title?.toLowerCase().includes(query);
      const authorMatch = s.authorName?.toLowerCase().includes(query);
      const typeMatch = s.type?.toLowerCase().includes(query);
      const excerptMatch = s.excerpt?.toLowerCase().includes(query);
      const tagMatch = s.tags?.some(tag => tag.toLowerCase().includes(query));
      return titleMatch || authorMatch || typeMatch || excerptMatch || tagMatch;
    });
  }, [stories, searchQuery]);

  const totalPages = Math.ceil(filteredStories.length / PER_PAGE);
  const pagedStories = filteredStories.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="adm-section animate-fadeIn">
      
      {/* Redesigned Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="adm-section-header">
          <h2>Stories</h2>
          <p>Publish and manage news content, media assets, announcements, and public stories</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-teal-600 hover:bg-teal-700 hover:-translate-y-0.5 text-white font-extrabold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-teal-600/10 flex items-center gap-2 border-none text-sm group"
        >
          <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" /> 
          Add Story
        </button>
      </div>

      {/* Dashboard Metrics and Controls removed for clean UI */}

      {/* Main SaaS Card Grid Container */}
      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse space-y-3">
                <div className="w-full h-44 bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[350px] bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center space-y-4 animate-fadeIn">
            <div className="p-4 bg-teal-50 text-teal-600 rounded-full">
              <Newspaper className="w-12 h-12 stroke-[1.5]" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-lg font-bold text-slate-800">No Articles Added Yet</h4>
              <p className="text-xs text-slate-400">
                Publishing featured updates, trust insights, and community stories made easy. Start by adding your first article.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-6 py-2.5 text-xs font-black text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-md shadow-teal-600/15 border-none cursor-pointer"
            >
              Add First Article
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
            {filteredStories.map((story) => (
              <motion.div
                key={story.id}
                layout
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden border-b border-slate-50">
                  {story.coverImageUrl ? (
                    <img
                      src={story.coverImageUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      alt={story.title}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=Vidyavaidya'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-3xl">📰</div>
                  )}
                </div>

                {/* Info & Actions */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors" title={story.title}>
                    {story.title}
                  </h4>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => handleOpenEdit(story)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-700 font-extrabold text-[10px] transition-all border border-teal-100/50 cursor-pointer shadow-sm shadow-teal-600/5 hover:-translate-y-0.5"
                      title="Edit"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(story)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-extrabold text-[10px] transition-all border border-rose-100/50 cursor-pointer shadow-sm shadow-rose-600/5 hover:-translate-y-0.5"
                      title="Delete"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────
          FORM INPUT MODAL (PORTALIZED + TOP ALIGNED & FULLY VISIBLE)
          ────────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
              {/* Clickable transparent overlay background to close */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-transparent -z-10"
              />
              
              {/* Modal Body container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.23, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
              >
              
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    {editStory ? "Edit News Article" : "Create News Article"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a high-quality featured cover image and provide a catchy headline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 border-none cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Internal Scrollable Content Container */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
                
                {/* Minimal clean form layout */}
                <div className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Article Title *</label>
                    <input
                      type="text"
                      {...register("title")}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-750 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                      placeholder="Enter article title"
                    />
                    {errors.title && <span className="text-[10px] text-rose-500 font-bold">{errors.title.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Controller
                      control={control}
                      name="coverImageUrl"
                      render={({ field }) => (
                        <ImageUrlWithUpload
                          label="Upload Image *"
                          value={field.value}
                          onChange={field.onChange}
                          onUploadError={(err) => showToast(err, "error")}
                        />
                      )}
                    />
                  </div>
                </div>

              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all duration-200 shadow-md shadow-teal-600/10 flex items-center gap-1.5"
                >
                  {saving ? "Saving Article..." : editStory ? "Save Changes" : "Publish Article"}
                </button>
              </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ──────────────────────────────────────────────
          ARTICLE PREVIEW MODAL (PORTALIZED + TOP ALIGNED)
          ────────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {isPreviewOpen && previewStory && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
              {/* Clickable transparent overlay background to close */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPreviewOpen(false)}
                className="fixed inset-0 bg-transparent -z-10"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
              >
              {/* Header Image cover preview */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-900 flex-shrink-0">
                {previewStory.coverImageUrl ? (
                  <img src={previewStory.coverImageUrl} className="w-full h-full object-cover opacity-80" alt={previewStory.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-950 text-teal-300 font-extrabold text-2xl uppercase">
                    📰 Vidyavaidya Media
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-slate-900/50 hover:bg-slate-900/80 rounded-full text-white transition-all"
                >
                  <X size={18} />
                </button>
                
                {/* Badges on image */}
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight mt-1">
                      {previewStory.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Read Only Scrollable Contents */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
                
                {/* Metadata strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <User size={14} className="text-teal-600" />
                      By <span className="font-bold text-slate-700">{previewStory.authorName || "Vidyavaidya Board"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-teal-600" />
                      Published <span className="font-bold text-slate-700">{fmtDate(previewStory.publishedAt || previewStory.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-slate-500">
                    <Eye size={14} className="text-teal-600" />
                    <span className="font-bold text-slate-700">{previewStory.views ?? 0}</span> views recorded
                  </div>
                </div>

                {/* Excerpt */}
                {previewStory.excerpt && (
                  <div className="border-l-4 border-teal-500 pl-4 py-1 italic text-slate-600 text-sm font-medium leading-relaxed bg-teal-50/20 rounded-r-xl">
                    {previewStory.excerpt}
                  </div>
                )}

                {/* Full text content */}
                {previewStory.content ? (
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {previewStory.content}
                  </div>
                ) : (
                  previewStory.type !== "gallery_photo" && previewStory.type !== "gallery_video" && (
                    <div className="text-slate-400 italic text-xs text-center py-6">
                      No descriptive content has been recorded.
                    </div>
                  )
                )}

                {/* Gallery photo items */}
                {previewStory.type === "gallery_photo" && previewStory.galleryImages && previewStory.galleryImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Photo Gallery Asset List</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {previewStory.galleryImages.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                          <img src={img} className="w-full h-full object-cover hover:scale-105 transition-all animate-fadeIn" alt="Gallery item" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery video preview URL link */}
                {previewStory.type === "gallery_video" && previewStory.videoUrl && (
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Video Attachment Details</h4>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-pink-100 bg-pink-50/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pink-100 text-pink-600 rounded-xl"><Video size={18} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Media Video Source</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{previewStory.videoUrl}</p>
                        </div>
                      </div>
                      <a
                        href={previewStory.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-white text-pink-700 border border-pink-200 hover:bg-pink-50 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1"
                      >
                        Play Video <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Source or External Article Links */}
                {previewStory.externalUrl && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-teal-100 bg-teal-50/25">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <Globe size={14} className="text-teal-600" />
                      Read the full press coverage directly on the original publishing site.
                    </div>
                    <a
                      href={previewStory.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-bold rounded-xl shadow-md shadow-teal-600/10 transition-all flex items-center gap-1.5"
                    >
                      Visit Article <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Tags mapping */}
                {previewStory.tags && previewStory.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Tagged:</span>
                    {previewStory.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 z-10 flex justify-end p-5 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-600/10 transition-all"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* ──────────────────────────────────────────────
          CONFIRM DELETE MODAL
          ────────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {deleteModalOpen && storyToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
              {/* Clickable transparent overlay background to close */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteModalOpen(false)}
                className="fixed inset-0 bg-transparent -z-10"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-150 z-10 text-center space-y-4"
              >
              <div className="w-14 h-14 bg-rose-50 text-rose-600 border border-rose-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Trash2 size={24} />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-800">Unpublish & Remove Article?</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-slate-700">"{storyToDelete.title}"</span>? This will immediately remove it from public view and delete all associated media associations.
                </p>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all"
                >
                  No, Keep It
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/10"
                >
                  Yes, Remove
                </button>
              </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}

/* ══════════════════════════════════════════════
   EVENTS SECTION
   ══════════════════════════════════════════════ */

const SPEAKER_FIELDS = [
  { name: "name", label: "Speaker Name *" },
  { name: "designation", label: "Designation" },
  { name: "photoUrl", label: "Photo URL" },
  { name: "topic", label: "Topic" }
];

export function EventsSection({ showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Unified Media Hub Active Tab (photo or video)
  const [activeTab, setActiveTab] = useState("photo");

  // Active Category filter for Photos
  const [photoCategory, setPhotoCategory] = useState("All");

  // Modals
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Health",
    startDate: "",
    shortDescription: "",
    description: "",
    location: "",
    organizer: "Vidyavaidya Foundation",
    thumbnailUrl: "",
    galleryImages: [],
    videoUrl: "",
    isFeatured: false,
    status: "upcoming",
    tags: []
  });

  // Lightbox & Video Player State
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);

  // Body Scroll Locking & Background/Sidebar Blurring when Modals are open
  useEffect(() => {
    if (photoModalOpen || videoModalOpen || lightboxOpen || videoPlayerOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open-blur");
    } else {
      document.body.style.overflow = "auto";
      document.body.classList.remove("modal-open-blur");
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.classList.remove("modal-open-blur");
    };
  }, [photoModalOpen, videoModalOpen, lightboxOpen, videoPlayerOpen]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.events.list();
      setEvents(data?.events || (Array.isArray(data) ? data : []));
    } catch (err) {
      showToast(err.message || "Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Split events dynamically by eventType or structural attributes
  const photoEvents = useMemo(() => {
    return events.filter(e => e.eventType === "photo" || (!e.videoUrl && e.eventType !== "video"));
  }, [events]);

  const videoEvents = useMemo(() => {
    return events.filter(e => e.eventType === "video" || !!e.videoUrl);
  }, [events]);

  // Derived stats
  const stats = useMemo(() => {
    const totalPhotos = photoEvents.reduce((acc, curr) => acc + (curr.galleryImages?.length || curr.galleryUrls?.length || 0), 0);
    return {
      totalGalleries: events.length,
      photoCount: photoEvents.length,
      videoCount: videoEvents.length,
      featuredCount: events.filter(e => e.isFeatured).length,
      totalPhotos
    };
  }, [events, photoEvents, videoEvents]);

  // Photo Category Tabs
  const photoCategories = ["All", "Education", "Health", "Community Trust", "Empowerment", "Volunteers"];

  const filteredPhotoEvents = useMemo(() => {
    if (photoCategory === "All") return photoEvents;
    return photoEvents.filter(e => e.category === photoCategory);
  }, [photoEvents, photoCategory]);

  const filteredVideoEvents = useMemo(() => {
    return videoEvents;
  }, [videoEvents]);

  const handleOpenAdd = (type) => {
    setEditEvent(null);
    const preassignedCategory = type === "video" ? "Video" : (photoCategory === "All" ? "Health" : photoCategory);
    setFormData({
      title: "",
      category: preassignedCategory,
      startDate: new Date().toISOString().split("T")[0],
      shortDescription: "",
      description: "",
      location: "",
      organizer: "Vidyavaidya Foundation",
      thumbnailUrl: "",
      galleryImages: [],
      videoUrl: "",
      isFeatured: false,
      status: "upcoming",
      tags: []
    });

    if (type === "photo") {
      setPhotoModalOpen(true);
    } else {
      setVideoModalOpen(true);
    }
  };

  const handleOpenEdit = (evt, type) => {
    setEditEvent(evt);
    
    let formattedDate = "";
    if (evt.startDate) {
      const dateObj = evt.startDate._seconds 
        ? new Date(evt.startDate._seconds * 1000) 
        : new Date(evt.startDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split("T")[0];
      }
    }

    const preassignedCategory = type === "video" ? "Video" : (photoCategory === "All" ? (evt.category || "Health") : photoCategory);
    setFormData({
      title: evt.title || "",
      category: preassignedCategory,
      startDate: formattedDate,
      shortDescription: evt.shortDescription || "",
      description: evt.description || "",
      location: evt.location || "",
      organizer: evt.organizer || "Vidyavaidya Foundation",
      thumbnailUrl: evt.thumbnailUrl || "",
      galleryImages: evt.galleryImages || evt.galleryUrls || [],
      videoUrl: evt.videoUrl || "",
      isFeatured: !!evt.isFeatured,
      status: evt.status || "upcoming",
      tags: evt.tags || []
    });

    if (type === "photo") {
      setPhotoModalOpen(true);
    } else {
      setVideoModalOpen(true);
    }
  };

  const handleDelete = async (evt) => {
    if (!window.confirm("Are you sure you want to remove this gallery event?")) return;
    try {
      await api.events.delete(evt.id);
      showToast("Media event removed successfully", "success");
      fetchEvents();
    } catch (err) {
      showToast(err.message || "Failed to remove event", "error");
    }
  };

  const handleSave = async (e, type) => {
    e.preventDefault();
    if (!formData.title) return showToast("Title is required", "error");
    if (!formData.startDate) return showToast("Date is required", "error");
    
    const finalDescription = type === "photo" ? (formData.description || formData.shortDescription || "Event photo gallery") : formData.description;
    if (!finalDescription) return showToast("Description is required", "error");

    const payload = {
      ...formData,
      description: finalDescription,
      eventType: type,
      startDate: formData.startDate,
      endDate: formData.startDate,
      registrationDeadline: formData.startDate,
      galleryUrls: type === "photo" ? formData.galleryImages : [],
      galleryImages: type === "photo" ? formData.galleryImages : [],
      videoUrl: type === "video" ? formData.videoUrl : "",
      totalSeats: 100
    };

    setSaving(true);
    try {
      if (editEvent) {
        await api.events.update(editEvent.id, payload);
        showToast(`${type === "photo" ? "Photo Gallery" : "Video Gallery"} updated successfully`, "success");
      } else {
        await api.events.create(payload);
        showToast(`${type === "photo" ? "Photo Gallery" : "Video Gallery"} created successfully`, "success");
      }
      setPhotoModalOpen(false);
      setVideoModalOpen(false);
      setEditEvent(null);
      fetchEvents();
    } catch (err) {
      showToast(err.message || "Failed to save media event", "error");
    } finally {
      setSaving(false);
    }
  };

  // Open Lightbox Image Viewer
  const handleOpenLightbox = (images, index) => {
    if (!images || images.length === 0) return;
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Open Video popup
  const handlePlayVideo = (url) => {
    if (!url) return;
    setActiveVideoUrl(url);
    setVideoPlayerOpen(true);
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
      const vimeoReg = /vimeo\.com\/(\d+)/;
      const vimeoMatch = url.match(vimeoReg);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
    } catch (e) {
      console.error(e);
    }
    return url;
  };

  const renderEmptyState = (type) => (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-slate-50/30 rounded-3xl border-2 border-dashed border-slate-200 max-w-lg mx-auto my-4 transition-all duration-200 hover:border-slate-350/80 hover:shadow-lg hover:shadow-slate-100/50">
      <div className={`w-14 h-14 mb-4 flex items-center justify-center rounded-2xl shadow-sm ${
        type === "photo" ? "bg-teal-50 text-teal-600 shadow-teal-100/50" : "bg-indigo-50 text-indigo-600 shadow-indigo-100/50"
      }`}>
        {type === "photo" ? <Images size={24} /> : <Clapperboard size={22} />}
      </div>
      <h3 className="font-extrabold text-slate-850 text-sm mb-1.5">
        No {type === "photo" ? "Photo Galleries" : "Videos"} Found
      </h3>
      <p className="text-slate-500 text-xs leading-relaxed max-w-sm mb-6">
        Begin showcasing your {type === "photo" ? "photo gallery collection" : "awareness video reels"} by setting up and uploading your first entry.
      </p>
      <button 
        onClick={() => handleOpenAdd(type)}
        className={`flex items-center justify-center gap-2 h-10 px-5 rounded-2xl text-white font-extrabold text-xs shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
          type === "photo" 
            ? "bg-teal-600 hover:bg-teal-700 shadow-teal-600/15" 
            : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/15"
        }`}
      >
        <Plus size={14} strokeWidth={3} /> Add First {type === "photo" ? "Photo Gallery" : "Video"}
      </button>
    </div>
  );

  const getCategoryCount = (cat) => {
    if (cat === "All") return photoEvents.length;
    return photoEvents.filter(e => e.category === cat).length;
  };

  return (
    <div className="adm-section space-y-6">
      {/* Dynamic Style Overrides for Background Blurring & Form Polish */}
      <style>{`
        body.modal-open-blur .adm-root {
          filter: blur(12px) grayscale(20%);
          pointer-events: none;
          transition: filter 0.3s ease-in-out;
        }
        
        /* Premium solid borders and crisp visibility for inputs */
        .adm-form-group input,
        .adm-form-group select,
        .adm-form-group textarea {
          border: 1.5px solid #cbd5e1 !important;
          background-color: #ffffff !important;
          color: #0f172a !important;
          font-size: 0.875rem !important;
          border-radius: 12px !important;
          padding: 0.625rem 1rem !important;
          transition: all 0.2s ease-in-out !important;
          outline: none !important;
        }
        
        .adm-form-group input:focus,
        .adm-form-group select:focus,
        .adm-form-group textarea:focus {
          border-color: #0d9488 !important;
          box-shadow: 0 0 0 3.5px rgba(13, 148, 136, 0.18) !important;
        }
        
        .adm-form-group label {
          color: #334155 !important;
          font-weight: 750 !important;
          font-size: 0.8rem !important;
          margin-bottom: 5px !important;
        }
        
        .adm-form-group textarea {
          min-height: 100px !important;
          padding: 0.75rem 1rem !important;
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100 mb-8">
        <div className="adm-section-header">
          <h2>Events</h2>
          <p>Organize and showcase event galleries, awareness drives, healthcare initiatives, and community impact stories</p>
        </div>
      </div>

      {/* PREMIUM UNIFIED EVENT MEDIA HUB CARD */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/50 p-6 sm:p-8 space-y-8 relative overflow-hidden">
        
        {/* Soft Background Gradient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />



        {/* TOP TAB SWITCHER SELECTOR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab("photo")}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-350 relative group overflow-hidden cursor-pointer ${
              activeTab === "photo" 
                ? "bg-gradient-to-br from-teal-50/60 to-emerald-50/10 border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/30 scale-[1.01] font-black" 
                : "bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-350 hover:shadow-md hover:scale-[1.005]"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "photo" ? "bg-teal-600 text-white shadow-lg shadow-teal-600/25" : "bg-slate-200/60 text-slate-500 group-hover:bg-slate-200 transition-colors"
            }`}>
              <Images size={22} />
            </div>
            <div className="text-left">
              <span className={`block font-extrabold text-sm ${activeTab === "photo" ? "text-teal-900" : "text-slate-700"}`}>Photo Gallery</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Manage event photos, health camps, and volunteer programs.</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-350 relative group overflow-hidden cursor-pointer ${
              activeTab === "video" 
                ? "bg-gradient-to-br from-indigo-50/60 to-indigo-50/10 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/30 scale-[1.01] font-black" 
                : "bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-350 hover:shadow-md hover:scale-[1.005]"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "video" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25" : "bg-slate-200/60 text-slate-500 group-hover:bg-slate-200 transition-colors"
            }`}>
              <Clapperboard size={20} />
            </div>
            <div className="text-left">
              <span className={`block font-extrabold text-sm ${activeTab === "video" ? "text-indigo-900" : "text-slate-700"}`}>Video Gallery</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Manage awareness videos, interview highlights, and campaign reels.</span>
            </div>
          </button>
        </div>

        {/* GLOBAL CATEGORY SWITCHER & ACTION CONTROLS */}
        <div className={`flex flex-col sm:flex-row sm:items-center gap-4 pt-2 pb-4 border-b border-slate-150/70 ${
          activeTab === "photo" ? "justify-between" : "justify-end"
        }`}>
          {activeTab === "photo" && (
            <div className="flex flex-wrap gap-2">
              {photoCategories.map((cat) => {
                const isSelected = photoCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setPhotoCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? "bg-teal-50/80 text-teal-700 border-teal-500 shadow-md shadow-teal-500/5 ring-1 ring-teal-500/20 scale-[1.03]"
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-350 hover:shadow-sm hover:-translate-y-0.5"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          <button 
            onClick={() => handleOpenAdd(activeTab)}
            className={`flex items-center justify-center gap-2 h-10 px-5 rounded-2xl text-white font-extrabold text-xs shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
              activeTab === "photo"
                ? "bg-teal-600 hover:bg-teal-700 shadow-teal-600/15"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/15"
            }`}
          >
            <Plus size={14} strokeWidth={3} /> Add {activeTab === "photo" ? "Photo Gallery" : "Video Event"}
          </button>
        </div>

        {/* FEATURED MEDIA STRIP */}
        {events.some(e => e.isFeatured) && (
          <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider block">Featured Activity Highlight</span>
                <span className="text-xs font-bold text-slate-750 block">
                  {events.find(e => e.isFeatured)?.title || "Scholarship Distribution Drive 2026"}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full font-bold self-start md:self-auto">
              Promoted on Home Page
            </span>
          </div>
        )}

        {/* DYNAMIC HUB CONTENT VIEWPORTS */}
        <AnimatePresence mode="wait">
          {activeTab === "photo" ? (
            <motion.div
              key="photo-hub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Dynamic View Content */}

              {/* Photos Content Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              ) : filteredPhotoEvents.length === 0 ? (
                renderEmptyState("photo")
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPhotoEvents.map((evt) => {
                    const galleryUrls = evt.galleryImages || evt.galleryUrls || [];
                    return (
                      <div key={evt.id} className="group bg-white rounded-2xl border border-slate-150/85 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-350 relative">
                        {/* Image Cover */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                          {evt.thumbnailUrl ? (
                            <img 
                              src={evt.thumbnailUrl} 
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                              alt={evt.title} 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-350 bg-slate-50">
                              <Image size={32} />
                            </div>
                          )}
                          {/* Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-lg bg-teal-500 text-white font-bold text-[10px] tracking-wider uppercase backdrop-blur-md bg-opacity-95 shadow-sm">
                              {evt.category}
                            </span>
                          </div>
                          {evt.isFeatured && (
                            <div className="absolute top-3 right-3 bg-amber-500 text-white p-1.5 rounded-lg shadow-md">
                              <Sparkles size={12} />
                            </div>
                          )}
                        </div>

                        {/* Body Info */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">
                              {fmtDate(evt.startDate)}
                            </span>
                            <h4 className="font-extrabold text-slate-800 text-sm line-clamp-1 group-hover:text-teal-600 transition-colors" title={evt.title}>
                              {evt.title}
                            </h4>
                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                              {evt.shortDescription || evt.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                              <Images size={12} className="text-teal-500" />
                              {galleryUrls.length} Images
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenLightbox(galleryUrls, 0)}
                                disabled={galleryUrls.length === 0}
                                className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-600 font-bold text-[10px] hover:bg-teal-100 transition-all disabled:opacity-50 disabled:pointer-events-none"
                              >
                                View Gallery
                              </button>
                              <button 
                                onClick={() => handleOpenEdit(evt, "photo")}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                              >
                                <Pencil size={13} />
                              </button>
                              <button 
                                onClick={() => handleDelete(evt)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="video-hub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Dynamic Video Content */}

              {/* Videos Content Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : filteredVideoEvents.length === 0 ? (
                renderEmptyState("video")
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideoEvents.map((evt) => (
                    <div key={evt.id} className="group bg-white rounded-2xl border border-slate-150/85 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-350 relative">
                      {/* Image Cover */}
                      <div 
                        className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
                        onClick={() => handlePlayVideo(evt.videoUrl)}
                      >
                        {evt.thumbnailUrl ? (
                          <img 
                            src={evt.thumbnailUrl} 
                            className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500" 
                            alt={evt.title} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-950">
                            <Film size={32} />
                          </div>
                        )}

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play size={18} fill="white" className="ml-1" />
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500 text-white font-bold text-[10px] tracking-wider uppercase">
                            {evt.category}
                          </span>
                        </div>
                        {evt.isFeatured && (
                          <div className="absolute top-3 right-3 bg-amber-500 text-white p-1.5 rounded-lg shadow-md">
                            <Sparkles size={12} />
                          </div>
                        )}
                      </div>

                      {/* Body Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block">
                            {fmtDate(evt.startDate)}
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors" title={evt.title}>
                            {evt.title}
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                            {evt.description || evt.shortDescription}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <Video size={12} className="text-indigo-500" />
                            Host: {evt.organizer || "Vidyavaidya"}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handlePlayVideo(evt.videoUrl)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-[10px] hover:bg-indigo-100 transition-all"
                            >
                              Watch Video
                            </button>
                            <button 
                              onClick={() => handleOpenEdit(evt, "video")}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                            <button 
                              onClick={() => handleDelete(evt)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PHOTO GALLERY ADD/EDIT MODAL */}
      {createPortal(
        <AnimatePresence>
          {photoModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setPhotoModalOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">{editEvent ? "Edit Photo Event" : "Add Photo Event"}</h3>
                    <p className="text-slate-400 text-[10px] mt-0.5">Configure event information, location data, categories, and multiple uploads.</p>
                  </div>
                  <button onClick={() => setPhotoModalOpen(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                    <X size={16} />
                  </button>
                </div>

                {/* Form Wrapper */}
                <form 
                  onSubmit={(e) => handleSave(e, "photo")} 
                  className="flex-1 flex flex-col min-h-0 overflow-hidden"
                >
                  {/* Scrollable Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 pr-3">
                    <div className="adm-form-group">
                      <label>Event Title *</label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                        placeholder="e.g. Rural Health Camp 2026"
                        className="w-full"
                        required
                      />
                    </div>

                    {photoCategory === "All" ? (
                      <div className="adm-form-group">
                        <label>Category *</label>
                        <select 
                          value={formData.category} 
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-teal-500 focus:outline-none"
                          required
                        >
                          <option value="Education">Education</option>
                          <option value="Health">Health</option>
                          <option value="Community Trust">Community Trust</option>
                          <option value="Empowerment">Empowerment</option>
                          <option value="Volunteers">Volunteers</option>
                        </select>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Form Context</span>
                          <span className="text-xs font-extrabold text-slate-700">Selected Category:</span>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-teal-500 text-white font-black text-[10px] tracking-wider uppercase shadow-sm">
                          {formData.category}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="adm-form-group">
                        <label>Event Date *</label>
                        <input 
                          type="date" 
                          value={formData.startDate} 
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                          required
                        />
                      </div>
                      <div className="adm-form-group">
                        <label>Location *</label>
                        <input 
                          type="text" 
                          value={formData.location} 
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                          placeholder="e.g. Village Hall, Sairam"
                          required
                        />
                      </div>
                    </div>

                    <div className="adm-form-group">
                      <label>Organizer Name *</label>
                      <input 
                        type="text" 
                        value={formData.organizer} 
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} 
                        placeholder="e.g. Vidyavaidya Foundation"
                        required
                      />
                    </div>

                    <div className="adm-form-group">
                      <label>Short Description * (max 200 chars)</label>
                      <textarea 
                        value={formData.shortDescription} 
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} 
                        maxLength={200}
                        placeholder="Provide a quick summary of the event gallery..."
                        required
                      />
                      <span className="adm-char-counter">{(formData.shortDescription || "").length}/200</span>
                    </div>

                    <ImageUrlWithUpload 
                      label="Thumbnail Image URL"
                      value={formData.thumbnailUrl}
                      onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                      onUploadError={(err) => showToast(err, "error")}
                    />

                    <MultiImageInput 
                      value={formData.galleryImages}
                      onChange={(urls) => setFormData({ ...formData, galleryImages: urls })}
                      showToast={showToast}
                    />

                    <div className="pt-2">
                      <label className="adm-toggle-label flex items-center justify-between">
                        <span className="text-slate-650 font-semibold text-xs">Promote as Featured Gallery?</span>
                        <div className="adm-switch-wrap">
                          <input 
                            type="checkbox" 
                            checked={formData.isFeatured} 
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} 
                          />
                          <span className="adm-slider"></span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Sticky Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3 z-10">
                    <button 
                      type="button"
                      onClick={() => setPhotoModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-550 font-extrabold text-xs hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-600/15 disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? "Saving..." : (editEvent ? "Save Changes" : "Save Event")}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* VIDEO GALLERY ADD/EDIT MODAL */}
      {createPortal(
        <AnimatePresence>
          {videoModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setVideoModalOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">{editEvent ? "Edit Video Event" : "Add Video Event"}</h3>
                    <p className="text-slate-400 text-[10px] mt-0.5">Manage video recordings, speaker hosts, dates, and campaign links.</p>
                  </div>
                  <button onClick={() => setVideoModalOpen(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                    <X size={16} />
                  </button>
                </div>

                {/* Form Wrapper */}
                <form 
                  onSubmit={(e) => handleSave(e, "video")} 
                  className="flex-1 flex flex-col min-h-0 overflow-hidden"
                >
                  {/* Scrollable Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 pr-3">
                    <div className="adm-form-group">
                      <label>Video Title *</label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                        placeholder="e.g. Medical Mission Highlights 2026"
                        className="w-full"
                        required
                      />
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="adm-form-group">
                        <label>Video Link / YouTube URL *</label>
                        <input 
                          type="url" 
                          value={formData.videoUrl} 
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} 
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                          required
                        />
                      </div>
                      <div className="adm-form-group">
                        <label>Event Date *</label>
                        <input 
                          type="date" 
                          value={formData.startDate} 
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                          required
                        />
                      </div>
                    </div>

                    <div className="adm-form-group">
                      <label>Speaker / Host Name</label>
                      <input 
                        type="text" 
                        value={formData.organizer} 
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} 
                        placeholder="e.g. Dr. Rohan (Adviser)"
                      />
                    </div>

                    <div className="adm-form-group">
                      <label>Description *</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        placeholder="Describe the campaign drive, interview highlights, or volunteer efforts..."
                        required
                      />
                    </div>

                    <ImageUrlWithUpload 
                      label="Video Thumbnail Image URL"
                      value={formData.thumbnailUrl}
                      onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                      onUploadError={(err) => showToast(err, "error")}
                    />

                    <div className="pt-2">
                      <label className="adm-toggle-label flex items-center justify-between">
                        <span className="text-slate-650 font-semibold text-xs">Promote as Featured Video?</span>
                        <div className="adm-switch-wrap">
                          <input 
                            type="checkbox" 
                            checked={formData.isFeatured} 
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} 
                          />
                          <span className="adm-slider"></span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Sticky Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3 z-10">
                    <button 
                      type="button"
                      onClick={() => setVideoModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-550 font-extrabold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/15 disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? "Saving..." : (editEvent ? "Save Changes" : "Save Video Event")}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* FULLSCREEN LIGHTBOX COMPONENT */}
      {createPortal(
        <AnimatePresence>
          {lightboxOpen && lightboxImages.length > 0 && (
            <div 
              className="fixed inset-0 z-[2000] flex flex-col justify-between bg-slate-950/98 backdrop-blur-md p-4 text-white animate-fade-in"
              onClick={() => setLightboxOpen(false)}
            >
              {/* Header Controls */}
              <div className="flex items-center justify-between px-4 py-2 z-[2001]">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Image {lightboxIndex + 1} of {lightboxImages.length}
                </span>
                <button 
                  onClick={() => setLightboxOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center hover:scale-105 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Slider container */}
              <div className="flex-1 flex items-center justify-center relative w-full" onClick={(e) => e.stopPropagation()}>
                {/* Prev Button */}
                <button
                  onClick={() => setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
                  className="absolute left-4 z-[2002] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                >
                  <span className="text-xl">◀</span>
                </button>

                {/* Slider image */}
                <motion.img 
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  src={lightboxImages[lightboxIndex]} 
                  className="max-w-[85%] max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/5" 
                  alt="Lightbox preview" 
                />

                {/* Next Button */}
                <button
                  onClick={() => setLightboxIndex(prev => (prev + 1) % lightboxImages.length)}
                  className="absolute right-4 z-[2002] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                >
                  <span className="text-xl">▶</span>
                </button>
              </div>

              {/* Thumbnail Bottom Grid */}
              <div className="py-4 overflow-x-auto flex justify-center gap-2 max-w-4xl mx-auto z-[2001]" onClick={(e) => e.stopPropagation()}>
                {lightboxImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      lightboxIndex === i ? "border-teal-500 scale-105" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* SLEEK VIDEO PLAYER DIALOG POPUP */}
      {createPortal(
        <AnimatePresence>
          {videoPlayerOpen && activeVideoUrl && (
            <div 
              className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md"
              onClick={() => setVideoPlayerOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black rounded-3xl w-full max-w-4xl overflow-hidden aspect-video shadow-2xl relative border border-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setVideoPlayerOpen(false)}
                  className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center hover:scale-105 transition-all"
                >
                  <X size={16} />
                </button>

                {activeVideoUrl.includes("youtube.com") || activeVideoUrl.includes("youtu.be") || activeVideoUrl.includes("vimeo.com") ? (
                  <iframe 
                    src={getEmbedUrl(activeVideoUrl)}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={activeVideoUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full"
                  />
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   TOAST SYSTEM
   ══════════════════════════════════════════════ */

export function SharedToast({ toast }) {
  if (!toast) return null;
  return (
    <div className="adm-toast-container">
      <div className={`adm-toast adm-toast-${toast.type}`}>
        <span className="adm-toast-message">{toast.message}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TESTIMONIALS MANAGEMENT SYSTEM
   ══════════════════════════════════════════════ */

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role/Designation must be at least 2 characters"),
  organization: z.string().optional().default(""),
  location: z.string().optional().default(""),
  headline: z.string().optional().default(""),
  message: z.string().min(10, "Message must be at least 10 characters"),
  rating: z.coerce.number().min(1).max(5).default(5),
  avatarUrl: z.string().optional().default(""),
  coverImageUrl: z.string().optional().default(""),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  displayOrder: z.coerce.number().int().min(1).default(10),
  category: z.string().min(1, "Please select category")
});

export function TestimonialsSection({ showToast }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState(null);

  const categories = ["All", "Beneficiary", "Volunteer", "Donor", "Healthcare Partner"];

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      role: "",
      organization: "",
      location: "",
      headline: "",
      message: "",
      rating: 5,
      avatarUrl: "",
      coverImageUrl: "",
      isFeatured: false,
      isPublished: true,
      displayOrder: 10,
      category: "Beneficiary"
    }
  });

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      // Fetch all testimonials for admin panel
      const res = await api.get("/testimonials?published=all");
      if (res.data && res.data.success) {
        setTestimonials(res.data.testimonials || []);
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleOpenAdd = () => {
    setEditTestimonial(null);
    reset({
      name: "",
      role: "",
      organization: "",
      location: "",
      headline: "",
      message: "",
      rating: 5,
      avatarUrl: "",
      coverImageUrl: "",
      isFeatured: false,
      isPublished: true,
      displayOrder: 10,
      category: activeCategory === "All" ? "Beneficiary" : activeCategory
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditTestimonial(t);
    reset({
      name: t.name || "",
      role: t.role || "",
      organization: t.organization || "",
      location: t.location || "",
      headline: t.headline || "",
      message: t.message || "",
      rating: t.rating || 5,
      avatarUrl: t.avatarUrl || "",
      coverImageUrl: t.coverImageUrl || "",
      isFeatured: !!t.isFeatured,
      isPublished: !!t.isPublished,
      displayOrder: t.displayOrder !== undefined ? t.displayOrder : 10,
      category: t.category || "Beneficiary"
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editTestimonial) {
        // Edit flow
        const res = await api.put(`/testimonials/${editTestimonial.id}`, data);
        if (res.data && res.data.success) {
          showToast("Testimonial updated successfully", "success");
          setIsModalOpen(false);
          loadTestimonials();
        }
      } else {
        // Create flow
        const res = await api.post("/testimonials", data);
        if (res.data && res.data.success) {
          showToast("Testimonial created successfully", "success");
          setIsModalOpen(false);
          loadTestimonials();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to save testimonial", "error");
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Are you sure you want to delete ${t.name}'s testimonial?`)) return;
    try {
      const res = await api.delete(`/testimonials/${t.id}`);
      if (res.data && res.data.success) {
        showToast("Testimonial deleted successfully", "success");
        loadTestimonials();
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete testimonial", "error");
    }
  };

  const handleTogglePublished = async (t) => {
    try {
      const res = await api.put(`/testimonials/${t.id}`, { isPublished: !t.isPublished });
      if (res.data && res.data.success) {
        showToast(`Testimonial ${!t.isPublished ? "published" : "hidden"} successfully`, "success");
        loadTestimonials();
      }
    } catch (err) {
      showToast("Failed to toggle publish status", "error");
    }
  };

  const handleToggleFeatured = async (t) => {
    try {
      const res = await api.put(`/testimonials/${t.id}`, { isFeatured: !t.isFeatured });
      if (res.data && res.data.success) {
        showToast(`Testimonial ${!t.isFeatured ? "marked as featured" : "removed from featured"} successfully`, "success");
        loadTestimonials();
      }
    } catch (err) {
      showToast("Failed to toggle featured status", "error");
    }
  };

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    let result = testimonials;
    if (activeCategory !== "All") {
      result = result.filter(t => t.category === activeCategory);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        (t.name || "").toLowerCase().includes(query) ||
        (t.message || "").toLowerCase().includes(query) ||
        (t.role || "").toLowerCase().includes(query) ||
        (t.organization || "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [testimonials, activeCategory, searchQuery]);

  return (
    <div className="adm-section animate-fadeIn">
      {/* 1. Header Hero section */}
      <div className="adm-section-header">
        <h2>Testimonials</h2>
        <p>Showcase impactful experiences and trusted voices from healthcare camps, volunteers, donors, and communities</p>
      </div>

      {/* 3. Main Dashboard section */}
      <div className="mt-8 bg-white border border-slate-150/80 rounded-3xl p-6 shadow-xl shadow-slate-100/50 space-y-6">
        
        {/* Category filtering & add actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-150/70">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/80 text-indigo-700 border-indigo-500 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/20 scale-[1.03]"
                      : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-350 hover:shadow-sm hover:-translate-y-0.5"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 h-10 px-5 rounded-2xl text-white font-extrabold text-xs shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/15"
            >
              <Plus size={14} strokeWidth={3} /> Add Testimonial
            </button>
          </div>
        </div>

        {/* Display Panel */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retrieving Credibility Stories...</span>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/30 border-2 border-dashed border-slate-200 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 shadow-inner">
              <MessageSquareQuote size={28} />
            </div>
            <h4 className="font-extrabold text-slate-700 text-sm">No Testimonials Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery 
                ? "No matching testimonials match your search filter criteria." 
                : "Begin collecting public trust testimonials by manually adding your first entry now."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-indigo-500/10 cursor-pointer transition-all hover:scale-[1.02]"
              >
                Create First Entry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTestimonials.map((t) => {
              const ratingStars = Array.from({ length: 5 }, (_, i) => i + 1);
              return (
                <div 
                  key={t.id}
                  className={`bg-slate-50/40 hover:bg-white rounded-3xl border transition-all duration-300 p-5 flex flex-col justify-between group hover:shadow-xl relative overflow-hidden ${
                    t.isFeatured ? "border-amber-350 shadow-md shadow-amber-500/5 bg-gradient-to-br from-amber-50/10 to-transparent" : "border-slate-150/70"
                  }`}
                >
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                      t.category === "Donor" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      t.category === "Volunteer" ? "bg-teal-50 text-teal-600 border border-teal-100" :
                      t.category === "Healthcare Partner" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                      "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {t.category}
                    </span>
                  </div>

                  <div>
                    {/* Header: User Profile details */}
                    <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                      {t.avatarUrl ? (
                        <img 
                          src={t.avatarUrl} 
                          alt={t.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/10">
                          {t.name ? t.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 tracking-tight leading-tight">{t.name}</h4>
                        <span className="text-[10px] text-slate-400 font-extrabold block mt-0.5 uppercase tracking-wide">
                          {t.role} {t.organization ? `@ ${t.organization}` : ""}
                        </span>
                        {t.location && (
                          <span className="text-[9px] text-slate-400 block mt-0.5">{t.location}</span>
                        )}
                      </div>
                    </div>

                    {/* Testimonial rating + Headline + Content */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-0.5">
                        {ratingStars.map((star) => (
                          <Star 
                            key={star} 
                            size={12} 
                            className={star <= (t.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                          />
                        ))}
                      </div>

                      {t.headline && (
                        <h5 className="font-black text-xs text-slate-700 leading-snug">“{t.headline}”</h5>
                      )}
                      
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-4">
                        {t.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions / Setting toggles */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleTogglePublished(t)}
                        title={t.isPublished ? "Unpublish Testimonial" : "Publish Testimonial"}
                        className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all ${
                          t.isPublished 
                            ? "bg-teal-50 text-teal-600 border-teal-200" 
                            : "bg-slate-55/60 text-slate-500 border-slate-200"
                        }`}
                      >
                        {t.isPublished ? "Live" : "Draft"}
                      </button>

                      <button 
                        onClick={() => handleToggleFeatured(t)}
                        title={t.isFeatured ? "Unfeature Testimonial" : "Feature Testimonial"}
                        className={`p-1.5 rounded-xl border transition-all ${
                          t.isFeatured 
                            ? "bg-amber-50 text-amber-500 border-amber-200" 
                            : "bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-200"
                        }`}
                      >
                        <Star size={12} className={t.isFeatured ? "fill-amber-500" : ""} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(t)}
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        title="Edit Testimonial"
                      >
                        <Pencil size={11} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleDelete(t)}
                        className="w-7 h-7 rounded-lg border border-rose-100 bg-white hover:bg-rose-50/50 text-rose-500 flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        title="Delete Testimonial"
                      >
                        <Trash2 size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Center Aligned testmonial form Modal */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-transparent -z-10"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.23, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
              >
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800">
                      {editTestimonial ? "Edit Trust Testimonial" : "Create Testimonial"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Complete the sections below to manage testimonial content, display, and categorization.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form scroll content */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
                  
                  {/* SECTION 1 - Person Details */}
                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">Person Details</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Full Name *</label>
                        <input 
                          type="text"
                          {...register("name")}
                          placeholder="e.g. Vidyavaidya"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                        {errors.name && <span className="text-[10px] text-rose-500 font-bold">{errors.name.message}</span>}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Role / Designation *</label>
                        <input 
                          type="text"
                          {...register("role")}
                          placeholder="e.g. Volunteer / Healthcare Donor"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                        {errors.role && <span className="text-[10px] text-rose-500 font-bold">{errors.role.message}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Organization Name</label>
                        <input 
                          type="text"
                          {...register("organization")}
                          placeholder="e.g. Hyderabad Med-Trust"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Location / City</label>
                        <input 
                          type="text"
                          {...register("location")}
                          placeholder="e.g. Hyderabad, Telangana"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2 - Testimonial Content */}
                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">Testimonial Content</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Short Headline</label>
                        <input 
                          type="text"
                          {...register("headline")}
                          placeholder="e.g. Life-changing Medical Drive!"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Rating (1-5 stars) *</label>
                        <select
                          {...register("rating")}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Testimonial Message *</label>
                      <textarea 
                        {...register("message")}
                        placeholder="Write down the impact testimonial story detail here..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 min-h-[120px] custom-scrollbar transition-all"
                      />
                      {errors.message && <span className="text-[10px] text-rose-500 font-bold">{errors.message.message}</span>}
                    </div>
                  </div>

                  {/* SECTION 3 - Media Uploads */}
                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">Media</h4>
                    </div>

                    <div className="space-y-4">
                      <Controller
                        control={control}
                        name="avatarUrl"
                        render={({ field }) => (
                          <ImageUrlWithUpload
                            label="Profile Avatar Image URL"
                            value={field.value}
                            onChange={field.onChange}
                            onUploadError={(err) => showToast(err, "error")}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="coverImageUrl"
                        render={({ field }) => (
                          <ImageUrlWithUpload
                            label="Optional Background Cover Image URL"
                            value={field.value}
                            onChange={field.onChange}
                            onUploadError={(err) => showToast(err, "error")}
                          />
                        )}
                      />
                    </div>
                  </div>



                  {/* Sticky Footer actions */}
                  <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 pt-4 pb-2 mt-4 bg-white border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-indigo-650/15 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {editTestimonial ? "Save Changes" : "Create Testimonial"}
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

