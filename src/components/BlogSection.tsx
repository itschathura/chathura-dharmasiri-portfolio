"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  Eye, 
  X, 
  Star,
  ExternalLink 
} from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category?: string;
  isStarred?: boolean;
  link?: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Building Grounded RAG Systems with FastAPI & ChromaDB",
    description: "An in-depth guide on implementing robust guardrails, source attribution, and chunking strategies to eliminate LLM hallucinations.",
    date: "Oct 02, 2026",
    category: "AI & Engineering",
    image: "/cards/documind-ai.jpg",
    isStarred: true,
    link: "https://documind-ai-aqf.pages.dev/"
  },
  {
    id: "2",
    title: "Real-time Telemetry Ingestion with XGBoost & ScyllaDB",
    description: "Architecting a high-throughput pipeline to process 10M+ telemetry rows for real-time race overtaking predictions.",
    date: "Sep 24, 2026",
    category: "Sports & Data Analysis",
    image: "/cards/research.jpg",
    link: "https://github.com/itschathura/F1-PitLogic-Platform"
  }
];

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
          localStorage.setItem("portfolio_blog_posts", JSON.stringify(data.posts));
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch blog posts from API, checking local cache", e);
    }

    try {
      const saved = localStorage.getItem("portfolio_blog_posts");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load blog posts from cache", e);
    }
    setPosts(DEFAULT_POSTS);
  };

  useEffect(() => {
    loadPosts();

    const handleBlogUpdate = () => {
      loadPosts();
    };

    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      const postId = customEvent.detail;
      const found = posts.find((p) => p.id === postId);
      if (found) {
        setSelectedPost(found);
      } else {
        const saved = localStorage.getItem("portfolio_blog_posts");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const pFound = parsed.find((p: BlogPost) => p.id === postId);
            if (pFound) setSelectedPost(pFound);
          } catch {}
        }
      }
    };

    window.addEventListener("blog_updated", handleBlogUpdate);
    window.addEventListener("open_blog_modal", handleOpenModal);

    return () => {
      window.removeEventListener("blog_updated", handleBlogUpdate);
      window.removeEventListener("open_blog_modal", handleOpenModal);
    };
  }, [posts]);

  const totalReal = posts.length;
  const displaySlides = totalReal > 0 ? [...posts, posts[0]] : [];

  useEffect(() => {
    if (isPaused || totalReal <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex, totalReal]);

  const handleNext = () => {
    if (currentIndex >= totalReal) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalReal);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(totalReal - 1);
      }, 20);
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTransitionEnd = () => {
    if (currentIndex === totalReal) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  const realIndex = totalReal > 0 ? currentIndex % totalReal : 0;

  return (
    <section id="blog" className="scroll-mt-20">
      {/* Section Header with Carousel Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Articles & Technical Insights</h2>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-foreground/60 mr-1.5">
            <strong className="text-accent-cyan">{realIndex + 1}</strong> / {totalReal}
          </span>
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg glass-card border border-glass-border hover:border-accent-cyan/50 text-foreground/80 hover:text-accent-cyan transition-all cursor-pointer glow-hover"
            aria-label="Previous article"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg glass-card border border-glass-border hover:border-accent-cyan/50 text-foreground/80 hover:text-accent-cyan transition-all cursor-pointer glow-hover"
            aria-label="Next article"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track Slider */}
      <div 
        className="relative glass-card rounded-xl overflow-hidden border border-glass-border hover:border-accent-cyan/40 transition-all duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex w-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 700ms ease-out' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displaySlides.map((post, index) => (
            <div 
              key={`${post.id}-${index}`} 
              className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left / Top: Cover Image with Enlarge Button */}
              <div 
                className="lg:col-span-5 relative h-48 lg:h-auto min-h-[200px] bg-black/60 cursor-pointer overflow-hidden group/img"
                onClick={() => setSelectedPost(post)}
              >
                {/* Layer 1: Accurate high-vibrancy blurred background fill */}
                <Image
                  src={post.image || "/cards/documind-ai.jpg"}
                  alt=""
                  fill
                  className="object-cover filter blur-3xl scale-150 opacity-85 brightness-110 pointer-events-none"
                  sizes="50vw"
                  unoptimized={post.image?.startsWith("data:") || post.image?.startsWith("http")}
                  aria-hidden="true"
                />

                {/* Layer 2: Main crisp fitted image */}
                <Image
                  src={post.image || "/cards/documind-ai.jpg"}
                  alt={post.title}
                  fill
                  className="object-contain p-2 relative z-10 transition-transform duration-500 group-hover/img:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  unoptimized={post.image?.startsWith("data:") || post.image?.startsWith("http")}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-background/90 z-10" />
                
                {/* Hover overlay button for photo viewing */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-xs">
                  <button className="px-3.5 py-1.5 rounded-lg bg-foreground text-background font-medium text-xs flex items-center gap-1.5 shadow-lg transform -translate-y-1 group-hover/img:translate-y-0 transition-transform cursor-pointer">
                    <Eye size={14} /> View Full Photo
                  </button>
                </div>

                {/* Category Pill */}
                {post.category && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold border backdrop-blur-md shadow-md bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30">
                      {post.category}
                    </span>
                  </div>
                )}

                {/* Date Pill */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-black/60 text-foreground/80 backdrop-blur-md border border-white/10 flex items-center gap-1">
                    <Calendar size={11} /> {post.date}
                  </span>
                </div>
              </div>

              {/* Right / Bottom: Content Area */}
              <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                      {post.title}
                    </h3>
                    {post.isStarred && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                        <Star size={11} className="fill-amber-400" /> Hero Featured
                      </span>
                    )}
                  </div>

                  <p className="text-foreground/80 text-xs sm:text-sm mb-4 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-foreground/10 flex items-center justify-between gap-3 mt-auto">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-semibold text-accent-cyan hover:text-accent-purple transition-colors flex items-center gap-1 py-1 cursor-pointer"
                  >
                    <Eye size={13} /> View Full Article <ChevronRight size={14} />
                  </button>

                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan transition-all border border-accent-cyan/30 flex items-center gap-1.5"
                    >
                      <span>Explore Resource</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Progress & Indicators Bar */}
        <div className="px-6 py-3 bg-foreground/5 border-t border-foreground/10 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {posts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === realIndex
                    ? "w-8 bg-accent-cyan"
                    : "w-2 bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Go to article slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Photo & Article Modal: Simple Split Layout */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] glass-card border border-white/20 rounded-2xl overflow-hidden flex flex-col md:flex-row bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Left Side: Uncropped Photo with Ambient Blur */}
            <div className="relative w-full md:w-1/2 min-h-[240px] md:min-h-[380px] bg-black/50 p-4 flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src={selectedPost.image || "/cards/documind-ai.jpg"}
                alt=""
                fill
                className="object-cover filter blur-3xl scale-150 opacity-80 brightness-110 pointer-events-none"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={selectedPost.image?.startsWith("data:") || selectedPost.image?.startsWith("http")}
                aria-hidden="true"
              />

              <div className="relative w-full h-[220px] md:h-[340px] z-10">
                <Image
                  src={selectedPost.image || "/cards/documind-ai.jpg"}
                  alt={selectedPost.title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={selectedPost.image?.startsWith("data:") || selectedPost.image?.startsWith("http")}
                  priority
                />
              </div>
            </div>

            {/* Right Side: Article Details & Text */}
            <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between bg-foreground/5 overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {selectedPost.category && (
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30">
                      {selectedPost.category}
                    </span>
                  )}
                  {selectedPost.isStarred && (
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                      <Star size={11} className="fill-amber-400" /> Hero Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 leading-snug">
                  {selectedPost.title}
                </h3>

                <p className="text-xs text-foreground/60 flex items-center gap-1.5 mb-4">
                  <Calendar size={13} className="text-accent-cyan" />
                  <span>Published {selectedPost.date}</span>
                </p>

                <p className="text-foreground/85 text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-6">
                  {selectedPost.description}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
                {selectedPost.link ? (
                  <a
                    href={selectedPost.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-cyan text-black hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <span>Explore Resource Link</span>
                    <ExternalLink size={14} />
                  </a>
                ) : <div />}

                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-foreground/20 hover:bg-foreground/10 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
