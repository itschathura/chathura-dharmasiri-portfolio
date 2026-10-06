"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Lock, 
  ShieldCheck, 
  X, 
  KeyRound, 
  Plus, 
  CheckCircle2, 
  Star, 
  Trash2, 
  Edit3,
  List,
  Save,
  RotateCcw
} from "lucide-react";
import { BlogPost } from "./BlogSection";

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Building Grounded RAG Systems with FastAPI & ChromaDB",
    description: "An in-depth guide on implementing robust guardrails, source attribution, and chunking strategies to eliminate LLM hallucinations.",
    date: "Oct 02, 2026",
    category: "AI & Engineering",
    image: "/cards/documind-ai.jpg",
    isStarred: true
  },
  {
    id: "2",
    title: "Real-time Telemetry Ingestion with XGBoost & ScyllaDB",
    description: "Architecting a high-throughput pipeline to process 10M+ telemetry rows for real-time race overtaking predictions.",
    date: "Sep 24, 2026",
    category: "Machine Learning",
    image: "/cards/research.jpg"
  }
];

export default function FooterSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"publish" | "manage">("publish");

  // Admin Posts Management State
  const [postsList, setPostsList] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BlogPost | null>(null);

  // New Blog Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    category: "AI & Engineering",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    description: "",
    image: "",
    link: ""
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const loadCurrentPosts = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPostsList(data.posts);
          localStorage.setItem("portfolio_blog_posts", JSON.stringify(data.posts));
          return;
        }
      }
    } catch (e) {
      console.warn("Failed fetching posts from API, falling back to cache", e);
    }

    try {
      const saved = localStorage.getItem("portfolio_blog_posts");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPostsList(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Failed loading posts in admin", e);
    }
    setPostsList(DEFAULT_POSTS);
  };

  useEffect(() => {
    if (authenticated) {
      loadCurrentPosts();
    }
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        setError("");
        loadCurrentPosts();
      } else {
        setError(data.error || "Incorrect password. Access denied.");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-article-image", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${password}`,
        },
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.success && data.url ? data.url : null;

      if (imageUrl) {
        if (isEdit && editForm) {
          setEditForm({ ...editForm, image: imageUrl });
        } else {
          setNewPost((prev) => ({ ...prev, image: imageUrl }));
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (isEdit && editForm) {
            setEditForm({ ...editForm, image: result });
          } else {
            setNewPost((prev) => ({ ...prev, image: result }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Upload error, using fallback Data URL", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isEdit && editForm) {
          setEditForm({ ...editForm, image: result });
        } else {
          setNewPost((prev) => ({ ...prev, image: result }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description) return;

    try {
      const postPayload = {
        title: newPost.title,
        category: newPost.category || "AI & Engineering",
        date: newPost.date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        description: newPost.description,
        image: newPost.image || "/cards/documind-ai.jpg",
        link: newPost.link || undefined,
        isStarred: postsList.length === 0
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify(postPayload)
      });

      if (res.ok) {
        await loadCurrentPosts();
        window.dispatchEvent(new Event("blog_updated"));

        setPublishedSuccess(true);
        setNewPost({
          title: "",
          category: "AI & Engineering",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          description: "",
          image: "",
          link: ""
        });

        setTimeout(() => {
          setPublishedSuccess(false);
        }, 3000);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to publish post to database");
      }
    } catch (err) {
      console.error("Error publishing blog post", err);
      setError("Failed to publish post");
    }
  };

  const startEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setEditForm({ ...post });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    try {
      const res = await fetch(`/api/blogs/${editForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        await loadCurrentPosts();
        window.dispatchEvent(new Event("blog_updated"));
        setEditingPostId(null);
        setEditForm(null);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to update post");
      }
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const toggleStarPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/blogs/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify({ action: "toggle-star" })
      });

      if (res.ok) {
        await loadCurrentPosts();
        window.dispatchEvent(new Event("blog_updated"));
      }
    } catch (err) {
      console.error("Failed to toggle star", err);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/blogs/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${password}`
        }
      });

      if (res.ok) {
        await loadCurrentPosts();
        window.dispatchEvent(new Event("blog_updated"));
      }
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPassword("");
    setError("");
    setPublishedSuccess(false);
    setEditingPostId(null);
    setEditForm(null);
  };

  return (
    <footer className="border-t border-glass-border rounded-none py-8 px-6 text-center relative overflow-hidden flex items-center justify-center">
      {/* Full Footer Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer/tameimpala.jpg"
          alt="Tame Impala Background"
          fill
          className="object-cover object-center opacity-75 brightness-100 contrast-105"
        />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-1.5">
        <p className="text-sm sm:text-base md:text-lg italic font-extrabold text-white tracking-wide leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          "There's a world out there and it's calling my name."
        </p>
        <p className="text-[11px] sm:text-xs text-accent-cyan font-bold tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          ~ Tame Impala
        </p>
      </div>

      {/* Secret Login Trigger Icon in Bottom-Right Corner */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-3 right-4 z-20 p-2 text-foreground/40 hover:text-accent-cyan transition-colors cursor-pointer rounded-full hover:bg-white/5"
        title="Secret Admin Access"
        aria-label="Secret Access Login"
      >
        <Lock size={15} />
      </button>

      {/* Secret Admin Portal Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-glass-border relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground p-1 transition-colors rounded-lg hover:bg-foreground/5 cursor-pointer"
            >
              <X size={18} />
            </button>

            {!authenticated ? (
              <div className="pt-2">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      autoFocus
                      className="w-full px-3.5 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan text-xs font-mono transition-colors"
                    />
                    {error && (
                      <p className="text-[11px] text-red-400 mt-1.5 font-medium text-left">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-accent-cyan/20 hover:bg-accent-cyan/30 text-accent-cyan border border-accent-cyan/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Login
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Admin Blog & News Manager</h3>
                      <p className="text-[11px] text-foreground/60">Upload, edit, star, or delete articles</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    AUTHENTICATED
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex rounded-xl bg-foreground/5 p-1 border border-foreground/10">
                  <button
                    onClick={() => {
                      setActiveTab("publish");
                      setEditingPostId(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === "publish"
                        ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <Plus size={14} /> Publish New
                  </button>
                  <button
                    onClick={() => setActiveTab("manage")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === "manage"
                        ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <List size={14} /> View & Edit Posts ({postsList.length})
                  </button>
                </div>

                {publishedSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs font-medium animate-in fade-in">
                    <CheckCircle2 size={16} />
                    <span>Blog Published Successfully! Live in blog & hero section.</span>
                  </div>
                )}

                {activeTab === "publish" ? (
                  /* Publish Form */
                  <form onSubmit={handlePublishPost} className="space-y-3 text-left">
                    <div>
                      <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="e.g. Deploying LLMs with FastAPI & Docker"
                        className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan text-xs font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                          Category
                        </label>
                        <select
                          value={newPost.category}
                          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-accent-cyan focus:outline-none focus:border-accent-cyan text-xs font-sans cursor-pointer"
                        >
                          <option value="AI & Engineering" className="bg-background text-foreground">AI & Engineering</option>
                          <option value="Machine Learning" className="bg-background text-foreground">Machine Learning</option>
                          <option value="Sports & Data Analysis" className="bg-background text-foreground">Sports & Data Analysis</option>
                          <option value="DevOps & Cloud" className="bg-background text-foreground">DevOps & Cloud</option>
                          <option value="News & Updates" className="bg-background text-foreground">News & Updates</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                          Publish Date
                        </label>
                        <input
                          type="text"
                          value={newPost.date}
                          onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                          placeholder="Oct 06, 2026"
                          className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan text-xs font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                        Cover Image (Saved into src/asset/article)
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={(e) => handleImageUpload(e, false)}
                          className="w-full text-xs text-foreground/70 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent-cyan/10 file:text-accent-cyan hover:file:bg-accent-cyan/20 cursor-pointer disabled:opacity-50"
                        />
                        {uploadingImage && (
                          <p className="text-[10px] text-accent-cyan animate-pulse font-medium">Uploading & saving to src/asset/article/ ...</p>
                        )}
                        {newPost.image.startsWith("/article/") && (
                          <p className="text-[10px] text-emerald-400 font-medium">✓ Saved to src/asset/article ({newPost.image})</p>
                        )}
                        <input
                          type="text"
                          value={newPost.image}
                          onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                          placeholder="or paste image URL..."
                          className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan text-xs font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                        Explore Resource Link (Optional GitHub / Paper / Live URL)
                      </label>
                      <input
                        type="url"
                        value={newPost.link || ""}
                        onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                        placeholder="https://github.com/... or https://arxiv.org/..."
                        className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan text-xs font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                        Short Description / Article Content *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newPost.description}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                        placeholder="Brief overview of the article, learnings, or announcement..."
                        className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan text-xs font-sans resize-none"
                      />
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-accent-cyan text-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-accent-cyan/90 shadow-md"
                      >
                        <Plus size={15} /> Publish Post
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.hash = "blog";
                          handleClose();
                        }}
                        className="px-3 py-2 rounded-xl glass-card text-xs font-medium hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        View Blog Section
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Manage Shared Posts Tab (with Edit & Delete Options) */
                  <div className="space-y-4 text-left max-h-[55vh] overflow-y-auto pr-1">
                    {editingPostId && editForm ? (
                      /* Inline Post Edit Form */
                      <form onSubmit={handleSaveEdit} className="p-4 rounded-xl bg-foreground/5 border border-accent-cyan/40 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between border-b border-foreground/10 pb-2">
                          <h4 className="text-xs font-bold text-accent-cyan flex items-center gap-1.5">
                            <Edit3 size={14} /> Editing Article
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPostId(null);
                              setEditForm(null);
                            }}
                            className="text-[11px] text-foreground/60 hover:text-foreground flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw size={12} /> Cancel Edit
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                            Article Title
                          </label>
                          <input
                            type="text"
                            required
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-foreground/10 text-foreground text-xs font-sans"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                              Category
                            </label>
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-foreground/10 text-accent-cyan text-xs font-sans cursor-pointer"
                            >
                              <option value="AI & Engineering" className="bg-background text-foreground">AI & Engineering</option>
                              <option value="Machine Learning" className="bg-background text-foreground">Machine Learning</option>
                              <option value="Sports & Data Analysis" className="bg-background text-foreground">Sports & Data Analysis</option>
                              <option value="DevOps & Cloud" className="bg-background text-foreground">DevOps & Cloud</option>
                              <option value="News & Updates" className="bg-background text-foreground">News & Updates</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                              Date
                            </label>
                            <input
                              type="text"
                              value={editForm.date}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-foreground/10 text-foreground text-xs font-sans"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                            Cover Image (Save to src/asset/article)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={(e) => handleImageUpload(e, true)}
                            className="w-full text-xs text-foreground/70 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent-cyan/10 file:text-accent-cyan cursor-pointer disabled:opacity-50 mb-1.5"
                          />
                          <input
                            type="text"
                            value={editForm.image}
                            onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-foreground/10 text-foreground text-xs font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                            Explore Resource Link (Optional URL)
                          </label>
                          <input
                            type="url"
                            value={editForm.link || ""}
                            onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-foreground/10 text-foreground text-xs font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-foreground/80 mb-1">
                            Description
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-foreground/10 text-foreground text-xs font-sans resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Save size={14} /> Save Changes
                        </button>
                      </form>
                    ) : (
                      /* Posts List View */
                      <>
                        <p className="text-xs text-foreground/70">
                          Click <strong className="text-accent-cyan">Edit 📝</strong> to modify any post, <strong className="text-amber-400">Star ⭐</strong> for Hero Spotlight, or <strong className="text-red-400">Trash 🗑️</strong> to delete.
                        </p>

                        {postsList.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed text-center text-xs text-foreground/50">
                            No articles published yet.
                          </div>
                        ) : (
                          postsList.map((post) => (
                            <div
                              key={post.id}
                              className="p-3 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-between gap-3 group hover:border-accent-cyan/30 transition-all"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10">
                                  <Image
                                    src={post.image || "/cards/documind-ai.jpg"}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    unoptimized={post.image?.startsWith("data:") || post.image?.startsWith("http")}
                                  />
                                </div>
                                <div className="overflow-hidden">
                                  <h4 className="text-xs font-bold truncate text-foreground">{post.title}</h4>
                                  <p className="text-[10px] text-foreground/60">{post.date} • {post.category}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Star / Hero Spotlight Button */}
                                <button
                                  type="button"
                                  onClick={() => toggleStarPost(post.id)}
                                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                    post.isStarred
                                      ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                      : "bg-foreground/5 text-foreground/40 border-foreground/10 hover:text-amber-400 hover:border-amber-400/30"
                                  }`}
                                  title={post.isStarred ? "Featured in Hero Section" : "Click to Feature in Hero Spotlight"}
                                >
                                  <Star size={14} className={post.isStarred ? "fill-amber-400" : ""} />
                                </button>

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => startEditPost(post)}
                                  className="p-2 rounded-lg bg-foreground/5 text-foreground/60 hover:text-accent-cyan hover:bg-accent-cyan/10 border border-foreground/10 hover:border-accent-cyan/30 transition-all cursor-pointer"
                                  title="Edit Post"
                                >
                                  <Edit3 size={14} />
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => deletePost(post.id)}
                                  className="p-2 rounded-lg bg-foreground/5 text-foreground/40 hover:text-red-400 hover:bg-red-500/10 border border-foreground/10 hover:border-red-500/30 transition-all cursor-pointer"
                                  title="Delete Post"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
