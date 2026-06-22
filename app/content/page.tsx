"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import { getTechIcon } from "../../src/lib/techIcons";
import type { Project } from "../../src/lib/projectsService";
import type { Certificate } from "../../src/lib/certificatesService";
import {
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaSave,
  FaTimes,
  FaGlobe,
  FaGithub,
  FaImage,
  FaTag,
  FaFont,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFolderOpen,
  FaUpload,
  FaSpinner,
  FaEnvelope,
  FaSignOutAlt,
  FaUser,
  FaLock,
  FaCertificate,
  FaBuilding,
  FaCalendarAlt,
  FaMedal,
} from "react-icons/fa";

// Available tech tags for selection
const AVAILABLE_TECH = [
  "Next.js", "React", "React Native", "Node.js", "Express",
  "JavaScript", "TypeScript", "Tailwind CSS", "Firebase",
  "Google Cloud", "Supabase", "Vercel", "MongoDB", "MySQL",
  "PostgreSQL", "Redis", "Prisma", "OpenAI", "Stripe",
  "D3.js", "Chart.js", "Git", "GitHub", "Docker", "AWS",
  "Python", "PHP", "GraphQL", "REST APIs", "WebSocket",
];

// Project Form state type
interface ProjectForm {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  github: string;
  live: string;
}

const emptyProjectForm: ProjectForm = {
  title: "",
  description: "",
  tags: [],
  imageUrl: "",
  github: "",
  live: "",
};

// Certificate Form state type
interface CertificateForm {
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  description: string;
  imageUrl: string;
}

const emptyCertificateForm: CertificateForm = {
  title: "",
  issuer: "",
  date: "",
  credentialUrl: "",
  description: "",
  imageUrl: "",
};

// Auth state
interface AuthUser {
  uid: string;
  email: string;
}

// Tab type
type DashboardTab = "projects" | "certificates";

function ContentDashboardInner() {
  const [authState, setAuthState] = useState<"loading" | "unauthenticated" | "authenticated">("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("projects");

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  // Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [certificateForm, setCertificateForm] = useState<CertificateForm>(emptyCertificateForm);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [savingCertificate, setSavingCertificate] = useState(false);

  // Common state
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setAuthState("authenticated");
        } else {
          setAuthState("unauthenticated");
        }
      } catch {
        setAuthState("unauthenticated");
      }
    };
    checkSession();
  }, []);

  // Handle login
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showNotification("error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (res.status === 429) {
        showNotification("error", "Too many login attempts. Please try again later.");
      } else if (data.success) {
        setUser(data.user);
        setAuthState("authenticated");
        setPassword("");
        showNotification("success", "Signed in successfully!");
      } else {
        showNotification("error", data.error || "Failed to sign in");
      }
    } catch {
      showNotification("error", "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setAuthState("unauthenticated");
      setEmail("");
      setPassword("");
    } catch {
      showNotification("error", "Failed to sign out");
    }
  };

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.status === 429) {
        showNotification("error", "Too many requests. Please try again later.");
        setProjectsLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      showNotification("error", "Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  // Fetch certificates from API
  const fetchCertificates = useCallback(async () => {
    try {
      const res = await fetch("/api/certificates");
      if (res.status === 429) {
        showNotification("error", "Too many requests. Please try again later.");
        setCertificatesLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setCertificates(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
      showNotification("error", "Failed to load certificates");
    } finally {
      setCertificatesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authState === "authenticated") {
      fetchProjects();
      fetchCertificates();
    }
  }, [authState, fetchProjects, fetchCertificates]);

  // ==================== PROJECT HANDLERS ====================

  // Handle project form input change
  const handleProjectChange = (field: keyof ProjectForm, value: string | string[]) => {
    setProjectForm((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle tech tag for project
  const toggleTag = (tech: string) => {
    setProjectForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tech)
        ? prev.tags.filter((t) => t !== tech)
        : [...prev.tags, tech],
    }));
  };

  // Save project (create or update) via API
  const handleSaveProject = async () => {
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      showNotification("error", "Title and description are required");
      return;
    }

    setSavingProject(true);
    try {
      if (editingProjectId) {
        const res = await fetch(`/api/projects/${editingProjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectForm),
        });
        if (res.status === 429) {
          showNotification("error", "Too many requests. Please try again later.");
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        showNotification("success", "Project updated successfully");
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectForm),
        });
        if (res.status === 429) {
          showNotification("error", "Too many requests. Please try again later.");
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        showNotification("success", "Project created successfully");
      }

      setProjectForm(emptyProjectForm);
      setEditingProjectId(null);
      setShowProjectForm(false);
      fetchProjects();
    } catch (err) {
      console.error("Failed to save project:", err);
      showNotification("error", "Failed to save project");
    } finally {
      setSavingProject(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setProjectForm({
      title: project.title,
      description: project.description,
      tags: project.tags,
      imageUrl: project.imageUrl,
      github: project.github,
      live: project.live,
    });
    setEditingProjectId(project.id);
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.status === 429) {
        showNotification("error", "Too many requests. Please try again later.");
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showNotification("success", "Project deleted successfully");
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
      showNotification("error", "Failed to delete project");
    }
  };

  const handleCancelProject = () => {
    setProjectForm(emptyProjectForm);
    setEditingProjectId(null);
    setShowProjectForm(false);
  };

  // ==================== CERTIFICATE HANDLERS ====================

  // Handle certificate form input change
  const handleCertificateChange = (field: keyof CertificateForm, value: string) => {
    setCertificateForm((prev) => ({ ...prev, [field]: value }));
  };

  // Save certificate (create or update) via API
  const handleSaveCertificate = async () => {
    if (!certificateForm.title.trim() || !certificateForm.issuer.trim()) {
      showNotification("error", "Title and issuer are required");
      return;
    }

    setSavingCertificate(true);
    try {
      if (editingCertificateId) {
        const res = await fetch(`/api/certificates/${editingCertificateId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(certificateForm),
        });
        if (res.status === 429) {
          showNotification("error", "Too many requests. Please try again later.");
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        showNotification("success", "Certificate updated successfully");
      } else {
        const res = await fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(certificateForm),
        });
        if (res.status === 429) {
          showNotification("error", "Too many requests. Please try again later.");
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        showNotification("success", "Certificate created successfully");
      }

      setCertificateForm(emptyCertificateForm);
      setEditingCertificateId(null);
      setShowCertificateForm(false);
      fetchCertificates();
    } catch (err) {
      console.error("Failed to save certificate:", err);
      showNotification("error", "Failed to save certificate");
    } finally {
      setSavingCertificate(false);
    }
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setCertificateForm({
      title: certificate.title,
      issuer: certificate.issuer,
      date: certificate.date,
      credentialUrl: certificate.credentialUrl,
      description: certificate.description,
      imageUrl: certificate.imageUrl,
    });
    setEditingCertificateId(certificate.id);
    setShowCertificateForm(true);
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
      if (res.status === 429) {
        showNotification("error", "Too many requests. Please try again later.");
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showNotification("success", "Certificate deleted successfully");
      fetchCertificates();
    } catch (err) {
      console.error("Failed to delete certificate:", err);
      showNotification("error", "Failed to delete certificate");
    }
  };

  const handleCancelCertificate = () => {
    setCertificateForm(emptyCertificateForm);
    setEditingCertificateId(null);
    setShowCertificateForm(false);
  };

  // Handle image upload (shared)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "project" | "certificate") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("error", "Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotification("error", "Image size should be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 429) {
        showNotification("error", "Upload limit reached. Please try again later.");
      } else if (data.success) {
        if (type === "project") {
          handleProjectChange("imageUrl", data.url);
        } else {
          handleCertificateChange("imageUrl", data.url);
        }
        showNotification("success", "Image uploaded successfully");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      showNotification("error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ==================== LOGIN SCREEN ====================
  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner size={32} className="animate-spin text-white/50" />
          <p className="text-white/30 font-mono text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
              <FaLock size={24} className="text-white/50" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-light text-white mb-2"
              style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
            >
              Content Dashboard
            </h1>
            <p className="text-white/40 text-sm font-mono">
              Sign in to continue
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8">
            {/* Email Field */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                <FaEnvelope size={12} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                autoFocus
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                <FaLock size={12} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner size={16} className="animate-spin" />
                  <span className="text-sm font-mono">Signing in...</span>
                </>
              ) : (
                <>
                  <FaLock size={16} />
                  <span className="text-sm font-mono">Sign In</span>
                </>
              )}
            </button>
          </div>

          <p className="text-white/15 text-[10px] font-mono text-center mt-6">
            Protected area. Unauthorized access prohibited.
          </p>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg border ${
            notification.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {notification.type === "success" ? (
            <FaCheckCircle size={16} />
          ) : (
            <FaExclamationTriangle size={16} />
          )}
          <span className="text-sm font-mono">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl md:text-3xl font-light"
              style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
            >
              Content Dashboard
            </h1>
            <p className="text-white/40 text-xs font-mono mt-1">
              Manage your portfolio content
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* User Menu */}
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.03]">
                <FaUser size={14} className="text-white/50" />
              </div>
              <span className="text-white/50 text-xs font-mono hidden md:inline max-w-[120px] truncate">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                title="Sign out"
              >
                <FaSignOutAlt size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex gap-1 border-b border-white/5">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-mono transition-all border-b-2 ${
                activeTab === "projects"
                  ? "border-white/70 text-white"
                  : "border-transparent text-white/40 hover:text-white/60"
              }`}
            >
              <FaFolderOpen size={14} />
              Projects
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">
                {projects.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-mono transition-all border-b-2 ${
                activeTab === "certificates"
                  ? "border-white/70 text-white"
                  : "border-transparent text-white/40 hover:text-white/60"
              }`}
            >
              <FaCertificate size={14} />
              Certificates
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">
                {certificates.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* ==================== PROJECTS TAB ==================== */}
        {activeTab === "projects" && (
          <>
            {/* Project Form Modal */}
            {showProjectForm && (
              <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  {/* Form Header */}
                  <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <h2
                      className="text-xl font-light"
                      style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                    >
                      {editingProjectId ? "Edit Project" : "Create New Project"}
                    </h2>
                    <button
                      onClick={handleCancelProject}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>

                  {/* Form Body */}
                  <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaFont size={12} />
                        Title *
                      </label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => handleProjectChange("title", e.target.value)}
                        placeholder="Project title"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaFont size={12} />
                        Description *
                      </label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => handleProjectChange("description", e.target.value)}
                        placeholder="Describe your project..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm resize-none"
                      />
                    </div>

                    {/* Image Upload / URL */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaImage size={12} />
                        Project Image
                      </label>

                      <div className="flex gap-3 mb-3">
                        <label
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-dashed rounded-lg cursor-pointer transition-all ${
                            uploading
                              ? "border-white/20 bg-white/[0.02] cursor-not-allowed"
                              : "border-white/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "project")}
                            disabled={uploading}
                            className="hidden"
                          />
                          {uploading ? (
                            <>
                              <FaSpinner size={16} className="animate-spin" />
                              <span className="text-sm font-mono text-white/50">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <FaUpload size={16} />
                              <span className="text-sm font-mono text-white/50">Upload to imgbb</span>
                            </>
                          )}
                        </label>

                        {projectForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleProjectChange("imageUrl", "")}
                            className="px-3 py-2 border border-white/10 rounded-lg text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                            title="Remove image"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest">or paste URL</span>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>

                      <input
                        type="url"
                        value={projectForm.imageUrl}
                        onChange={(e) => handleProjectChange("imageUrl", e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />

                      {projectForm.imageUrl && (
                        <div className="mt-3 relative w-full rounded-lg overflow-hidden border border-white/10">
                          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                            <Image
                              src={projectForm.imageUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* GitHub URL */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaGithub size={12} />
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={projectForm.github}
                        onChange={(e) => handleProjectChange("github", e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />
                    </div>

                    {/* Live URL */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaGlobe size={12} />
                        Live URL
                      </label>
                      <input
                        type="url"
                        value={projectForm.live}
                        onChange={(e) => handleProjectChange("live", e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />
                    </div>

                    {/* Tech Tags */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-3">
                        <FaTag size={12} />
                        Technologies
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TECH.map((tech) => {
                          const Icon = getTechIcon(tech);
                          const isSelected = projectForm.tags.includes(tech);
                          return (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => toggleTag(tech)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                                isSelected
                                  ? "bg-white/15 border-white/40 text-white"
                                  : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                              }`}
                            >
                              <Icon size={12} />
                              {tech}
                            </button>
                          );
                        })}
                      </div>
                      {projectForm.tags.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest mb-2">
                            Selected ({projectForm.tags.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {projectForm.tags.map((tag) => {
                              const Icon = getTechIcon(tag);
                              return (
                                <span
                                  key={tag}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/10 border border-white/20 text-white/70"
                                >
                                  <Icon size={10} />
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className="ml-1 text-white/40 hover:text-white/70"
                                  >
                                    <FaTimes size={10} />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-white/5 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                      onClick={handleCancelProject}
                      className="px-4 py-2 text-white/50 hover:text-white/70 font-mono text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProject}
                      disabled={savingProject}
                      className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingProject ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                          <span className="text-sm font-mono">Saving...</span>
                        </>
                      ) : (
                        <>
                          <FaSave size={16} />
                          <span className="text-sm font-mono">
                            {editingProjectId ? "Update" : "Create"} Project
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Projects List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-light"
                  style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                >
                  Projects ({projects.length})
                </h2>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all"
                >
                  <FaPlus size={16} />
                  <span className="text-sm font-mono">New Project</span>
                </button>
              </div>

              {projectsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FaFolderOpen size={48} className="text-white/20" />
                  <p className="text-white/30 font-mono text-sm mt-4">
                    No projects yet. Create your first project!
                  </p>
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all"
                  >
                    <FaPlus size={16} />
                    <span className="text-sm font-mono">New Project</span>
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 group hover:border-white/20 transition-all"
                    >
                      {project.imageUrl && (
                        <div className="w-full md:w-40 h-24 md:h-28 rounded-lg overflow-hidden shrink-0 bg-white/5 relative">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-white text-lg font-light mb-1 truncate"
                          style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                        >
                          {project.title}
                        </h3>
                        <p className="text-white/40 text-xs font-mono line-clamp-2 mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 5).map((tag) => {
                            const Icon = getTechIcon(tag);
                            return (
                              <span
                                key={tag}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/10 text-white/40 bg-white/[0.03]"
                              >
                                <Icon size={10} />
                                {tag}
                              </span>
                            );
                          })}
                          {project.tags.length > 5 && (
                            <span className="text-white/30 text-[10px] font-mono px-2 py-0.5">
                              +{project.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                          title="Edit"
                        >
                          <FaPencilAlt size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                            title="Visit Live"
                          >
                            <FaGlobe size={14} />
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                            title="View GitHub"
                          >
                            <FaGithub size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ==================== CERTIFICATES TAB ==================== */}
        {activeTab === "certificates" && (
          <>
            {/* Certificate Form Modal */}
            {showCertificateForm && (
              <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  {/* Form Header */}
                  <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <h2
                      className="text-xl font-light"
                      style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                    >
                      {editingCertificateId ? "Edit Certificate" : "Add New Certificate"}
                    </h2>
                    <button
                      onClick={handleCancelCertificate}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>

                  {/* Form Body */}
                  <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaMedal size={12} />
                        Certificate Title *
                      </label>
                      <input
                        type="text"
                        value={certificateForm.title}
                        onChange={(e) => handleCertificateChange("title", e.target.value)}
                        placeholder="e.g., AWS Certified Solutions Architect"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />
                    </div>

                    {/* Issuer */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaBuilding size={12} />
                        Issuing Organization *
                      </label>
                      <input
                        type="text"
                        value={certificateForm.issuer}
                        onChange={(e) => handleCertificateChange("issuer", e.target.value)}
                        placeholder="e.g., Amazon Web Services, Google, Coursera"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaCalendarAlt size={12} />
                        Date Issued
                      </label>
                      <input
                        type="date"
                        value={certificateForm.date}
                        onChange={(e) => handleCertificateChange("date", e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />
                    </div>

                    {/* Credential URL */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaGlobe size={12} />
                        Credential URL
                      </label>
                      <input
                        type="url"
                        value={certificateForm.credentialUrl}
                        onChange={(e) => handleCertificateChange("credentialUrl", e.target.value)}
                        placeholder="https://www.credential.net/..."
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaFont size={12} />
                        Description
                      </label>
                      <textarea
                        value={certificateForm.description}
                        onChange={(e) => handleCertificateChange("description", e.target.value)}
                        placeholder="Brief description of the certificate..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm resize-none"
                      />
                    </div>

                    {/* Image Upload / URL */}
                    <div>
                      <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                        <FaImage size={12} />
                        Certificate Image
                      </label>

                      <div className="flex gap-3 mb-3">
                        <label
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-dashed rounded-lg cursor-pointer transition-all ${
                            uploading
                              ? "border-white/20 bg-white/[0.02] cursor-not-allowed"
                              : "border-white/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "certificate")}
                            disabled={uploading}
                            className="hidden"
                          />
                          {uploading ? (
                            <>
                              <FaSpinner size={16} className="animate-spin" />
                              <span className="text-sm font-mono text-white/50">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <FaUpload size={16} />
                              <span className="text-sm font-mono text-white/50">Upload to imgbb</span>
                            </>
                          )}
                        </label>

                        {certificateForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleCertificateChange("imageUrl", "")}
                            className="px-3 py-2 border border-white/10 rounded-lg text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                            title="Remove image"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest">or paste URL</span>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>

                      <input
                        type="url"
                        value={certificateForm.imageUrl}
                        onChange={(e) => handleCertificateChange("imageUrl", e.target.value)}
                        placeholder="https://example.com/certificate.png"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />

                      {certificateForm.imageUrl && (
                        <div className="mt-3 relative w-full rounded-lg overflow-hidden border border-white/10">
                          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                            <Image
                              src={certificateForm.imageUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-white/5 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                      onClick={handleCancelCertificate}
                      className="px-4 py-2 text-white/50 hover:text-white/70 font-mono text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCertificate}
                      disabled={savingCertificate}
                      className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingCertificate ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                          <span className="text-sm font-mono">Saving...</span>
                        </>
                      ) : (
                        <>
                          <FaSave size={16} />
                          <span className="text-sm font-mono">
                            {editingCertificateId ? "Update" : "Add"} Certificate
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Certificates List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-light"
                  style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                >
                  Certificates ({certificates.length})
                </h2>
                <button
                  onClick={() => setShowCertificateForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all"
                >
                  <FaPlus size={16} />
                  <span className="text-sm font-mono">Add Certificate</span>
                </button>
              </div>

              {certificatesLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              ) : certificates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FaCertificate size={48} className="text-white/20" />
                  <p className="text-white/30 font-mono text-sm mt-4">
                    No certificates yet. Add your first certificate!
                  </p>
                  <button
                    onClick={() => setShowCertificateForm(true)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all"
                  >
                    <FaPlus size={16} />
                    <span className="text-sm font-mono">Add Certificate</span>
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {certificates.map((certificate) => (
                    <div
                      key={certificate.id}
                      className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 group hover:border-white/20 transition-all"
                    >
                      {certificate.imageUrl && (
                        <div className="w-full md:w-40 h-24 md:h-28 rounded-lg overflow-hidden shrink-0 bg-white/5 relative">
                          <Image
                            src={certificate.imageUrl}
                            alt={certificate.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center bg-white/[0.03] shrink-0">
                            <FaCertificate size={18} className="text-white/50" />
                          </div>
                          <div className="min-w-0">
                            <h3
                              className="text-white text-lg font-light mb-1 truncate"
                              style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                            >
                              {certificate.title}
                            </h3>
                            <p className="text-white/50 text-xs font-mono flex items-center gap-1.5">
                              <FaBuilding size={10} />
                              {certificate.issuer}
                            </p>
                          </div>
                        </div>
                        {certificate.description && (
                          <p className="text-white/40 text-xs font-mono line-clamp-2 mb-3">
                            {certificate.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-white/30 text-[10px] font-mono">
                          {certificate.date && (
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt size={10} />
                              {new Date(certificate.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditCertificate(certificate)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                          title="Edit"
                        >
                          <FaPencilAlt size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(certificate.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                        {certificate.credentialUrl && (
                          <a
                            href={certificate.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                            title="View Credential"
                          >
                            <FaGlobe size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 text-center">
          <p className="text-white/20 text-xs font-mono">
            Content Dashboard — Temporary page for managing portfolio content
          </p>
        </div>
      </footer>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <FaSpinner size={32} className="animate-spin text-white/50" />
        <p className="text-white/30 font-mono text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function ContentDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContentDashboardInner />
    </Suspense>
  );
}
