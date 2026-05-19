import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search,
  Calendar, FileText, Handshake, X, Download, ShieldAlert,
  Users, CheckSquare, Square, Building2, HeartPulse, HandHeart,
  GraduationCap, BriefcaseBusiness, Eye, Check, AlertCircle,
  MapPin, Globe, Phone, Mail, User, Info, ArrowRight, ExternalLink
} from "lucide-react";
import { useForm } from "react-hook-form";
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

export const fmtDate = (val) => {
  if (!val) return "—";
  try {
    // Handle Firestore Timestamp object natively
    if (typeof val === 'object' && val._seconds) {
      val = val._seconds * 1000;
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return typeof val === 'object' ? JSON.stringify(val) : String(val);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch (e) {
    return typeof val === 'object' ? JSON.stringify(val) : String(val);
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
    <div className="adm-section bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Partners Ecosystem</h2>
          <p className="text-sm text-slate-500 mt-1">Manage VidyaVaidya collaborations, medical networks, and CSR alignments</p>
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
   STORIES & MEDIA SECTION
   ══════════════════════════════════════════════ */

export function StoriesSection({ showToast }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [saving, setSaving] = useState(false);
  const PER_PAGE = 10;

  const [formData, setFormData] = useState({
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
    tags: [],
    isFeatured: false,
    isPublished: false
  });

  const fetchStories = async () => {
    setLoading(true);
    try {
      const data = await api.stories.list();
      setStories(data.stories || []);
    } catch (err) {
      showToast(err.message || "Failed to load stories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleOpenAdd = () => {
    setEditStory(null);
    setFormData({
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
      tags: [],
      isFeatured: false,
      isPublished: false
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (story) => {
    setEditStory(story);
    setFormData({
      ...story,
      galleryImages: story.galleryImages || [],
      tags: story.tags || [],
      sourceByline: story.sourceByline || "Vidyavaidya Board"
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (story) => {
    if (!window.confirm("Are you sure? This will unpublish the story.")) return;
    try {
      await api.stories.delete(story.id);
      showToast("Story deleted/unpublished successfully", "success");
      fetchStories();
    } catch (err) {
      showToast(err.message || "Failed to delete story", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) return showToast("Title is required", "error");

    // Validations based on type
    if (formData.type === "gallery_photo") {
      if (!formData.galleryImages || formData.galleryImages.length === 0) {
        return showToast("Gallery Photo requires at least 1 image", "error");
      }
    } else if (formData.type === "gallery_video") {
      if (!formData.videoUrl) {
        return showToast("Video URL is required", "error");
      }
    } else {
      if (!formData.content) {
        return showToast("Content is required", "error");
      }
    }

    setSaving(true);
    try {
      const dataToSave = { ...formData };
      if (formData.isPublished && !formData.publishedAt) {
        dataToSave.publishedAt = new Date().toISOString();
      }

      if (editStory) {
        await api.stories.update(editStory.id, dataToSave);
        showToast("Story saved successfully", "success");
      } else {
        await api.stories.create(dataToSave);
        showToast("Story saved successfully", "success");
      }
      setDrawerOpen(false);
      fetchStories();
    } catch (err) {
      showToast(err.message || "Failed to save story", "error");
    } finally {
      setSaving(false);
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
      showToast(`Story ${newPublished ? "published" : "drafted"} successfully`, "success");
      fetchStories();
    } catch (err) {
      showToast(err.message || "Failed to toggle status", "error");
    }
  };

  const filtered = useMemo(() => {
    if (activeTab === "All") return stories;
    return stories.filter((s) => s.type === activeTab);
  }, [stories, activeTab]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="adm-section">
      <div className="adm-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Stories & Media</h2>
          <p>Publish blogs, press releases, reports, and galleries</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Story
        </button>
      </div>

      {/* Tabs */}
      <section className="sticky top-0 z-20 border-b border-slate-200 bg-white" style={{ borderRadius: '14px', border: '1px solid var(--ad-border-color)', overflow: 'hidden' }}>
        <div className="mx-auto flex overflow-x-auto items-center justify-start gap-1 p-2">
          {[
            { id: "All", label: "All" },
            { id: "news", label: "News" },
            { id: "impact", label: "Impact" },
            { id: "publishing", label: "Publishing" },
            { id: "blog", label: "Blog" },
            { id: "gallery_photo", label: "Gallery Photos" },
            { id: "gallery_video", label: "Gallery Videos" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setActiveTab(tab.id); setPage(1); }}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <div className="adm-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Type</th>
                <th>Author</th>
                <th>Published</th>
                <th>Featured</th>
                <th>Views</th>
                <th>Publish Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={9} />
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="adm-empty-row">
                    <div style={{ padding: '24px 0' }}>No stories yet. Add your first story.</div>
                  </td>
                </tr>
              ) : (
                paged.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {s.coverImageUrl ? (
                        <img src={s.coverImageUrl} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} alt={s.title} />
                      ) : (
                        <span style={{ fontSize: '1.4rem' }}>📰</span>
                      )}
                    </td>
                    <td>
                      <div className="adm-donor-name" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.title}>
                        {s.title}
                      </div>
                    </td>
                    <td><span className={`adm-badge badge-${s.type}`}>{s.type}</span></td>
                    <td className="adm-muted">{s.authorName || "—"}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(s)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        title={s.isPublished ? "Unpublish" : "Publish"}
                      >
                        <span className={`adm-badge badge-${s.isPublished ? "Published" : "Draft"}`}>
                          {s.isPublished ? "✓" : "✗"}
                        </span>
                      </button>
                    </td>
                    <td className="adm-center">{s.isFeatured ? "✓" : "—"}</td>
                    <td className="adm-center">{s.views ?? 0}</td>
                    <td className="adm-muted">{fmtDate(s.publishedAt || s.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="adm-menu-btn" title="Edit Story" onClick={() => handleOpenEdit(s)}>
                          <Pencil size={14} />
                        </button>
                        <button className="adm-menu-btn" title="Delete Story" onClick={() => handleDelete(s)}>
                          <Trash2 size={14} color="#e74c3c" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      <SharedDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editStory ? "Edit Story" : "Add Story"}
        footer={
          <>
            <button className="adm-btn adm-btn-ghost" onClick={() => setDrawerOpen(false)} disabled={saving}>Cancel</button>
            <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Story"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Story Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="news">News</option>
                <option value="impact">Impact Story</option>
                <option value="publishing">Publishing / Report</option>
                <option value="press">Press Coverage</option>
                <option value="blog">Blog Post</option>
                <option value="gallery_photo">Gallery Photo</option>
                <option value="gallery_video">Gallery Video</option>
              </select>
            </div>
            <div className="adm-form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              {formData.title && (
                <span style={{ fontSize: '0.72rem', color: 'var(--ad-text-muted)', marginTop: '2px' }}>
                  Slug Preview: <code>vidyavaidya.org/{formData.type}/{generateSlug(formData.title)}</code>
                </span>
              )}
            </div>
          </div>

          {formData.type !== "gallery_photo" && formData.type !== "gallery_video" && (
            <>
              <div className="adm-form-group">
                <label>Excerpt (max 200 chars)</label>
                <textarea
                  maxLength={200}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Auto-derived hint: Enter an elegant summary..."
                />
                <span className="adm-char-counter">{(formData.excerpt || "").length}/200</span>
              </div>

              <div className="adm-form-group">
                <label>Content * (min 50 chars)</label>
                <textarea
                  style={{ height: '180px' }}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          <ImageUrlWithUpload
            label="Cover Image URL"
            value={formData.coverImageUrl}
            onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
            onUploadError={(err) => showToast(err, "error")}
          />

          {formData.type === "gallery_photo" && (
            <MultiImageInput
              value={formData.galleryImages}
              onChange={(urls) => setFormData({ ...formData, galleryImages: urls })}
              showToast={showToast}
            />
          )}

          {formData.type === "gallery_video" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="adm-form-group">
                <label>Video URL * (YouTube, Vimeo, direct link)</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  required
                />
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label>Video Duration (e.g. 12:30)</label>
                  <input
                    type="text"
                    value={formData.videoDuration}
                    onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                  />
                </div>
                <div className="adm-form-group">
                  <label>Video Thumbnail URL</label>
                  <input
                    type="text"
                    value={formData.videoThumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, videoThumbnailUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {(formData.type === "news" || formData.type === "press") && (
            <div className="adm-form-group">
              <label>External Article URL (Read more link)</label>
              <input
                type="text"
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              />
            </div>
          )}

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Source / Byline</label>
              <input
                type="text"
                value={formData.sourceByline}
                onChange={(e) => setFormData({ ...formData, sourceByline: e.target.value })}
              />
            </div>
            <div className="adm-form-group">
              <label>Author Name</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              />
            </div>
          </div>

          <div className="adm-form-group">
            <label>Tags</label>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags: tags })}
            />
          </div>

          <div className="adm-form-row">
            <label className="adm-toggle-label">
              <span>Is Featured?</span>
              <div className="adm-switch-wrap">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <span className="adm-slider"></span>
              </div>
            </label>

            <label className="adm-toggle-label">
              <span>Publish Story immediately?</span>
              <div className="adm-switch-wrap">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <span className="adm-slider"></span>
              </div>
            </label>
          </div>
        </form>
      </SharedDrawer>
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
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const PER_PAGE = 10;

  // View Registrations Modal State
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [activeRegEvent, setActiveRegEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Healthcare",
    status: "upcoming",
    shortDescription: "",
    description: "",
    thumbnailUrl: "",
    galleryImages: [],
    highlightVideoUrl: "",
    venue: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    totalSeats: 100,
    isFree: true,
    registrationFee: 0,
    registrationOpen: true,
    organizer: "Vidyavaidya Foundation",
    speakers: [],
    tags: [],
    isFeatured: false
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.events.list();
      setEvents(data.events || []);
    } catch (err) {
      showToast(err.message || "Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditEvent(null);
    setFormData({
      title: "",
      category: "Healthcare",
      status: "upcoming",
      shortDescription: "",
      description: "",
      thumbnailUrl: "",
      galleryImages: [],
      highlightVideoUrl: "",
      venue: "",
      startDate: "",
      endDate: "",
      registrationDeadline: "",
      totalSeats: 100,
      isFree: true,
      registrationFee: 0,
      registrationOpen: true,
      organizer: "Vidyavaidya Foundation",
      speakers: [],
      tags: [],
      isFeatured: false
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditEvent(evt);
    setFormData({
      ...evt,
      galleryImages: evt.galleryImages || [],
      speakers: evt.speakers || [],
      tags: evt.tags || [],
      organizer: evt.organizer || "Vidyavaidya Foundation",
      totalSeats: evt.totalSeats ?? 100
    });
    setDrawerOpen(true);
  };

  const handleCancelEvent = async (evt) => {
    if (!window.confirm("Are you sure you want to cancel this event? This will mark the status as cancelled.")) return;
    try {
      await api.events.delete(evt.id);
      showToast("Event cancelled successfully", "success");
      fetchEvents();
    } catch (err) {
      showToast(err.message || "Failed to cancel event", "error");
    }
  };

  const handleOpenRegistrations = async (evt) => {
    setActiveRegEvent(evt);
    setRegModalOpen(true);
    setRegLoading(true);
    try {
      const data = await api.events.getRegistrations(evt.id);
      setRegistrations(data.registrations || []);
    } catch (err) {
      showToast(err.message || "Failed to load registrations", "error");
    } finally {
      setRegLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) return showToast("No registrations to export", "error");
    const headers = ["Registrant Name", "Email", "Phone", "Status", "Registered On"];
    const rows = registrations.map((r) => [
      r.name,
      r.email,
      r.phone,
      r.status,
      r.registeredOn || r.created_at || ""
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val || ''}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeRegEvent.title}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) return showToast("Event Title is required", "error");
    if (!formData.venue) return showToast("Venue is required", "error");
    if (!formData.startDate) return showToast("Start Date & Time is required", "error");
    if (!formData.endDate) return showToast("End Date & Time is required", "error");
    if (!formData.registrationDeadline) return showToast("Registration Deadline is required", "error");
    if (!formData.totalSeats || formData.totalSeats < 1) return showToast("Total Seats must be at least 1", "error");

    // DateTime Validations
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return showToast("End Date must be after or equal to Start Date", "error");
    }
    if (new Date(formData.registrationDeadline) > new Date(formData.startDate)) {
      return showToast("Registration Deadline must be before or equal to Start Date", "error");
    }

    setSaving(true);
    try {
      if (editEvent) {
        await api.events.update(editEvent.id, formData);
        showToast("Event saved successfully", "success");
      } else {
        await api.events.create(formData);
        showToast("Event saved successfully", "success");
      }
      setDrawerOpen(false);
      fetchEvents();
    } catch (err) {
      showToast(err.message || "Failed to save event", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "All" || e.category === catFilter;
      const matchStatus = statusFilter === "All" || e.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [events, search, catFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="adm-section">
      <div className="adm-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Events</h2>
          <p>Create and monitor foundation healthcamps, awareness drives, and programs</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Create Event
        </button>
      </div>

      <div className="adm-filters-bar">
        <div className="adm-search-box">
          <Search size={15} />
          <input
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="adm-filter-selects">
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}>
            <option value="All">All Categories</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Community">Community</option>
            <option value="Awareness">Awareness</option>
            <option value="Fundraiser">Fundraiser</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="All">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="adm-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Seats (Reg/Total)</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={8} />
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="adm-empty-row">
                    <div style={{ padding: '24px 0' }}>No events yet. Create your first event.</div>
                  </td>
                </tr>
              ) : (
                paged.map((e) => (
                  <tr key={e.id}>
                    <td>
                      {e.thumbnailUrl ? (
                        <img src={e.thumbnailUrl} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} alt={e.title} />
                      ) : (
                        <span style={{ fontSize: '1.4rem' }}>📅</span>
                      )}
                    </td>
                    <td>
                      <div className="adm-donor-name" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={e.title}>
                        {e.title}
                      </div>
                    </td>
                    <td><span className={`adm-badge badge-${e.category}`}>{e.category}</span></td>
                    <td><span className={`adm-badge badge-${e.status}`}>{e.status}</span></td>
                    <td className="adm-muted">{fmtDate(e.startDate)}</td>
                    <td className="adm-center">
                      <span className="adm-count-badge" style={{ width: 'auto', padding: '0 8px', borderRadius: '12px' }}>
                        {e.registeredCount ?? 0} / {e.totalSeats}
                      </span>
                    </td>
                    <td className="adm-center">{e.isFeatured ? "✓" : "—"}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="adm-menu-btn" title="Edit Event" onClick={() => handleOpenEdit(e)}>
                          <Pencil size={14} />
                        </button>
                        <button className="adm-menu-btn" title="View Registrations" onClick={() => handleOpenRegistrations(e)}>
                          <Users size={14} color="#0b3c5d" />
                        </button>
                        {e.status !== "cancelled" && (
                          <button className="adm-menu-btn" title="Cancel Event" onClick={() => handleCancelEvent(e)}>
                            <X size={14} color="#e74c3c" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      <SharedDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editEvent ? "Edit Event" : "Create Event"}
        footer={
          <>
            <button className="adm-btn adm-btn-ghost" onClick={() => setDrawerOpen(false)} disabled={saving}>Cancel</button>
            <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Event"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Event Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              {formData.title && (
                <span style={{ fontSize: '0.72rem', color: 'var(--ad-text-muted)', marginTop: '2px' }}>
                  Slug Preview: <code>vidyavaidya.org/events/{generateSlug(formData.title)}</code>
                </span>
              )}
            </div>
            <div className="adm-form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Community">Community</option>
                <option value="Awareness">Awareness</option>
                <option value="Fundraiser">Fundraiser</option>
              </select>
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="adm-form-group">
              <label>Organizer</label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              />
            </div>
          </div>

          <div className="adm-form-group">
            <label>Short Description * (max 200 chars)</label>
            <textarea
              maxLength={200}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
            />
            <span className="adm-char-counter">{(formData.shortDescription || "").length}/200</span>
          </div>

          <div className="adm-form-group">
            <label>Full Description * (min 50 chars)</label>
            <textarea
              style={{ height: '140px' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
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

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Highlight Video URL</label>
              <input
                type="text"
                value={formData.highlightVideoUrl}
                onChange={(e) => setFormData({ ...formData, highlightVideoUrl: e.target.value })}
              />
            </div>
            <div className="adm-form-group">
              <label>Venue / Location *</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Start Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="adm-form-group">
              <label>End Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
              {formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate) && (
                <span style={{ color: 'var(--ad-danger)', fontSize: '0.72rem', marginTop: '2px', fontWeight: 600 }}>
                  ⚠ End date must be after Start Date
                </span>
              )}
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Registration Deadline *</label>
              <input
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                required
              />
              {formData.startDate && formData.registrationDeadline && new Date(formData.registrationDeadline) > new Date(formData.startDate) && (
                <span style={{ color: 'var(--ad-danger)', fontSize: '0.72rem', marginTop: '2px', fontWeight: 600 }}>
                  ⚠ Deadline must be before Start Date
                </span>
              )}
            </div>
            <div className="adm-form-group">
              <label>Total Seats *</label>
              <input
                type="number"
                min={1}
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 100 })}
                required
              />
            </div>
          </div>

          <div className="adm-form-row">
            <label className="adm-toggle-label">
              <span>Is Free Event?</span>
              <div className="adm-switch-wrap">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                />
                <span className="adm-slider"></span>
              </div>
            </label>

            {!formData.isFree && (
              <div className="adm-form-group">
                <label>Registration Fee (INR) *</label>
                <input
                  type="number"
                  min={0}
                  value={formData.registrationFee}
                  onChange={(e) => setFormData({ ...formData, registrationFee: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            )}
          </div>

          <div className="adm-form-row">
            <label className="adm-toggle-label">
              <span>Registration Open?</span>
              <div className="adm-switch-wrap">
                <input
                  type="checkbox"
                  checked={formData.registrationOpen}
                  onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
                />
                <span className="adm-slider"></span>
              </div>
            </label>

            <label className="adm-toggle-label">
              <span>Is Featured Event?</span>
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

          <div className="adm-form-section-title">Speakers</div>
          <RepeatableGroup
            items={formData.speakers}
            label="Speaker"
            onChange={(speakers) => setFormData({ ...formData, speakers })}
            onAddItem={() => setFormData({ ...formData, speakers: [...formData.speakers, { name: "", designation: "", photoUrl: "", topic: "" }] })}
            fields={SPEAKER_FIELDS}
          />

          <div className="adm-form-group" style={{ marginTop: '10px' }}>
            <label>Tags</label>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
            />
          </div>
        </form>
      </SharedDrawer>

      {/* Registrations List Drawer */}
      <SharedDrawer
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        title={activeRegEvent ? `${activeRegEvent.title} — Registrations` : "Registrations"}
        footer={
          <button className="adm-btn adm-btn-ghost" onClick={() => setRegModalOpen(false)}>Close</button>
        }
      >
        {activeRegEvent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Stats Bar */}
            <div className="adm-summary-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
              <div className="adm-ss-item">
                <span className="adm-ss-label">Total Registered</span>
                <span className="adm-ss-value adm-green">{registrations.length}</span>
              </div>
              <div className="adm-ss-item">
                <span className="adm-ss-label">Total Seats</span>
                <span className="adm-ss-value">{activeRegEvent.totalSeats}</span>
              </div>
              <div className="adm-ss-item">
                <span className="adm-ss-label">Spots Remaining</span>
                <span className="adm-ss-value adm-orange">
                  {Math.max(0, activeRegEvent.totalSeats - registrations.length)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="adm-btn adm-btn-primary" onClick={handleExportCSV}>
                <Download size={14} /> Export CSV
              </button>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Registrant Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {regLoading ? (
                    <SkeletonRows cols={5} />
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="adm-empty-row">No registrants found for this event.</td>
                    </tr>
                  ) : (
                    registrations.map((r, idx) => (
                      <tr key={idx}>
                        <td><strong className="adm-donor-name">{r.name}</strong></td>
                        <td className="adm-muted">{r.email}</td>
                        <td className="adm-muted">{r.phone}</td>
                        <td><span className={`adm-badge badge-${r.status || "Active"}`}>{r.status || "Active"}</span></td>
                        <td className="adm-muted">{fmtDate(r.registeredOn || r.created_at || r.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SharedDrawer>
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
