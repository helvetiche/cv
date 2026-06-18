"use client";

import { useState, useEffect, useCallback } from "react";
import { getTechIcon } from "../../src/lib/techIcons";
import type { Project } from "../../src/lib/projectsService";
import {
  Plus,
  Trash,
  Pencil,
  FloppyDisk,
  X,
  Globe,
  GithubLogo,
  Image,
  Tag,
  TextT,
  Link,
  CheckCircle,
  Warning,
  FolderOpen,
  UploadSimple,
  Spinner,
} from "@phosphor-icons/react";

// Available tech tags for selection
const AVAILABLE_TECH = [
  "Next.js", "React", "React Native", "Node.js", "Express",
  "JavaScript", "TypeScript", "Tailwind CSS", "Firebase",
  "Google Cloud", "Supabase", "Vercel", "MongoDB", "MySQL",
  "PostgreSQL", "Redis", "Prisma", "OpenAI", "Stripe",
  "D3.js", "Chart.js", "Git", "GitHub", "Docker", "AWS",
  "Python", "PHP", "GraphQL", "REST APIs", "WebSocket",
];

// Form state type
interface ProjectForm {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  github: string;
  live: string;
}

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  tags: [],
  imageUrl: "",
  github: "",
  live: "",
};

export default function ContentDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle form input change
  const handleChange = (field: keyof ProjectForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle tech tag
  const toggleTag = (tech: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tech)
        ? prev.tags.filter((t) => t !== tech)
        : [...prev.tags, tech],
    }));
  };

  // Save project (create or update) via API
  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showNotification("error", "Title and description are required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        // Update existing project
        const res = await fetch(`/api/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        showNotification("success", "Project updated successfully");
      } else {
        // Create new project
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        showNotification("success", "Project created successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error("Failed to save project:", err);
      showNotification("error", "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // Edit project
  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      tags: project.tags,
      imageUrl: project.imageUrl,
      github: project.github,
      live: project.live,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  // Delete project via API
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showNotification("success", "Project deleted successfully");
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
      showNotification("error", "Failed to delete project");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  // Upload image to imgbb via server API
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification("error", "Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
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

      if (data.success) {
        handleChange("imageUrl", data.url);
        showNotification("success", "Image uploaded successfully");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      showNotification("error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
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
              Manage your portfolio projects
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all"
          >
            <Plus size={16} weight="bold" />
            <span className="text-sm font-mono">New Project</span>
          </button>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border ${
            notification.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={16} weight="fill" />
          ) : (
            <Warning size={16} weight="fill" />
          )}
          <span className="text-sm font-mono">{notification.message}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Project Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Form Header */}
              <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <h2
                  className="text-xl font-light"
                  style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
                >
                  {editingId ? "Edit Project" : "Create New Project"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                    <TextT size={12} weight="bold" />
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Project title"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                    <TextT size={12} weight="bold" />
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe your project..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm resize-none"
                  />
                </div>

                {/* Image Upload / URL */}
                <div>
                  <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                    <Image size={12} weight="bold" />
                    Project Image
                  </label>

                  {/* Upload Button */}
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
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      {uploading ? (
                        <>
                          <Spinner size={16} weight="bold" className="animate-spin" />
                          <span className="text-sm font-mono text-white/50">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadSimple size={16} weight="bold" />
                          <span className="text-sm font-mono text-white/50">Upload to imgbb</span>
                        </>
                      )}
                    </label>

                    {form.imageUrl && (
                      <button
                        type="button"
                        onClick={() => handleChange("imageUrl", "")}
                        className="px-3 py-2 border border-white/10 rounded-lg text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                        title="Remove image"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    )}
                  </div>

                  {/* OR divider */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest">or paste URL</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* URL Input */}
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                  />

                  {/* Image Preview */}
                  {form.imageUrl && (
                    <div className="mt-3 relative w-full rounded-lg overflow-hidden border border-white/10">
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <img
                          src={form.imageUrl}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
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
                    <GithubLogo size={12} weight="bold" />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={form.github}
                    onChange={(e) => handleChange("github", e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                  />
                </div>

                {/* Live URL */}
                <div>
                  <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                    <Globe size={12} weight="bold" />
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={form.live}
                    onChange={(e) => handleChange("live", e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                  />
                </div>

                {/* Tech Tags */}
                <div>
                  <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-3">
                    <Tag size={12} weight="bold" />
                    Technologies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TECH.map((tech) => {
                      const Icon = getTechIcon(tech);
                      const isSelected = form.tags.includes(tech);
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
                  {form.tags.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest mb-2">
                        Selected ({form.tags.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.tags.map((tag) => {
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
                                <X size={10} weight="bold" />
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
                  onClick={handleCancel}
                  className="px-4 py-2 text-white/50 hover:text-white/70 font-mono text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                      <span className="text-sm font-mono">Saving...</span>
                    </>
                  ) : (
                    <>
                      <FloppyDisk size={16} weight="bold" />
                      <span className="text-sm font-mono">
                        {editingId ? "Update" : "Create"} Project
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
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen size={48} weight="duotone" color="rgba(255,255,255,0.2)" />
              <p className="text-white/30 font-mono text-sm mt-4">
                No projects yet. Create your first project!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-all"
              >
                <Plus size={16} weight="bold" />
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
                  {/* Project Image */}
                  {project.imageUrl && (
                    <div className="w-full md:w-40 h-24 md:h-28 rounded-lg overflow-hidden shrink-0 bg-white/5">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Project Info */}
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

                  {/* Actions */}
                  <div className="flex md:flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                      title="Edit"
                    >
                      <Pencil size={14} weight="bold" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                      title="Delete"
                    >
                      <Trash size={14} weight="bold" />
                    </button>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                        title="Visit Live"
                      >
                        <Globe size={14} weight="bold" />
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
                        <GithubLogo size={14} weight="bold" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
