"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, FileText, Star, Calendar, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
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

export default function HeroSection() {
  const [starredPost, setStarredPost] = useState<BlogPost | null>(null);

  const loadPosts = () => {
    try {
      const saved = localStorage.getItem("portfolio_blog_posts");
      let posts: BlogPost[] = DEFAULT_POSTS;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          posts = parsed;
        }
      }
      // Find the starred post, or default to the first post
      const favorite = posts.find((p) => p.isStarred) || posts[0];
      setStarredPost(favorite || null);
    } catch (e) {
      console.error("Failed to load starred post", e);
      setStarredPost(DEFAULT_POSTS[0]);
    }
  };

  useEffect(() => {
    loadPosts();

    const handleBlogUpdate = () => {
      loadPosts();
    };

    window.addEventListener("blog_updated", handleBlogUpdate);
    return () => {
      window.removeEventListener("blog_updated", handleBlogUpdate);
    };
  }, []);

  const handleReadArticle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!starredPost) return;

    const blogEl = document.getElementById("blog");
    if (blogEl) {
      blogEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "blog";
    }

    window.dispatchEvent(new CustomEvent("open_blog_modal", { detail: starredPost.id }));
  };

  return (
    <section id="home" className="min-h-[70vh] flex flex-col justify-center pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Hero Intro Text & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-xs font-medium mb-4 glow-hover">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
            AI/ML Engineer
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            Building intelligent systems <br />
            with <span className="text-gradient">grounded outputs</span>.
          </h1>
          <p className="text-base md:text-lg text-foreground/80 max-w-2xl mb-8 leading-relaxed">
            I'm an AI/ML-focused Computer Science undergraduate with hands-on experience building Retrieval-Augmented Generation (RAG) systems and agentic LLM applications. Eager to turn prototypes into robust, deployed solutions.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link 
              href="#projects" 
              className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-md"
            >
              View Projects <ChevronRight size={16} />
            </Link>
            <Link 
              href="/cv/Chathura_Dharmasiri_CV.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl glass-card text-sm font-medium border border-accent-cyan/40 text-accent-cyan flex items-center gap-1.5 glow-hover"
            >
              <FileText size={16} /> Download CV
            </Link>
            <Link 
              href="https://github.com/itschathura" 
              target="_blank" 
              className="px-5 py-2.5 rounded-xl glass-card text-sm font-medium flex items-center gap-1.5 glow-hover"
            >
              <FaGithub size={16} /> GitHub
            </Link>
            <Link 
              href="https://linkedin.com/in/dharmasiri17" 
              target="_blank" 
              className="px-5 py-2.5 rounded-xl glass-card text-sm font-medium flex items-center gap-1.5 glow-hover"
            >
              <FaLinkedin size={16} /> LinkedIn
            </Link>
          </div>
        </div>

        {/* Right Column: Starred / Favorite Featured Article Card */}
        {starredPost && (
          <div className="lg:col-span-5 w-full">
            <div 
              onClick={handleReadArticle}
              className="glass-card rounded-2xl p-5 border border-accent-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.15)] relative overflow-hidden group glow-hover animate-in fade-in duration-300 cursor-pointer"
            >
              {/* Featured News & Update Header */}
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-accent-cyan">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span>Featured News & Update</span>
              </div>

              {/* Cover Image with Accurate Vibrant Blurred Background Fill */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3.5 bg-black/30 border border-white/10">
                {/* Layer 1: High-vibrancy blurred background fill */}
                <Image
                  src={starredPost.image || "/cards/documind-ai.jpg"}
                  alt=""
                  fill
                  className="object-cover filter blur-3xl scale-150 opacity-85 brightness-110 pointer-events-none"
                  sizes="33vw"
                  unoptimized={starredPost.image?.startsWith("data:") || starredPost.image?.startsWith("http")}
                  aria-hidden="true"
                />

                {/* Layer 2: Main crisp fitted image */}
                <Image
                  src={starredPost.image || "/cards/documind-ai.jpg"}
                  alt={starredPost.title}
                  fill
                  className="object-contain p-2 relative z-10 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  unoptimized={starredPost.image?.startsWith("data:") || starredPost.image?.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 z-10" />
              </div>

              {/* Date & Title */}
              <div className="flex items-center gap-1 text-[11px] text-foreground/60 mb-1.5">
                <Calendar size={12} className="text-accent-purple" />
                <span>{starredPost.date}</span>
              </div>

              <h3 className="text-base font-bold mb-2 group-hover:text-accent-cyan transition-colors leading-snug line-clamp-2">
                {starredPost.title}
              </h3>

              <p className="text-foreground/80 text-xs leading-relaxed line-clamp-3 mb-4">
                {starredPost.description}
              </p>

              <button
                onClick={handleReadArticle}
                className="w-full py-2 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Read Article</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
