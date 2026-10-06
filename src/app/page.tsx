import { Mail, ChevronRight, Code2, Database, BrainCircuit, Terminal, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import CertificatesSection from "@/components/CertificatesSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <div className="min-h-screen relative selection:bg-accent-cyan selection:text-black">
      {/* Background gradients */}
      <div className="fixed inset-0 z-[-1] bg-background">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-accent-purple rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-cyan rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-purple rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-card border-x-0 border-t-0 rounded-none">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tighter">
            Chathura<span className="text-gradient">.</span>
          </Link>
          <div className="hidden md:flex gap-6 text-xs sm:text-sm font-medium">
            <Link href="#about" className="hover:text-accent-cyan transition-colors">About</Link>
            <Link href="#projects" className="hover:text-accent-cyan transition-colors">Projects</Link>
            <Link href="#certificates" className="hover:text-accent-cyan transition-colors">Certificates</Link>
            <Link href="#blog" className="hover:text-accent-cyan transition-colors">Blog</Link>
            <Link href="#contact" className="hover:text-accent-cyan transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-6 max-w-6xl mx-auto space-y-20 md:space-y-24">
        {/* Hero Section */}
        <HeroSection />

        {/* About Section */}
        <section id="about" className="scroll-mt-20">
          <div className="flex flex-col md:flex-row gap-10 md:gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight mb-6">About Me</h2>
              <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                I am Chathura Dharmasiri, an AI/ML Engineer dedicated to taking intelligent systems from prototype to deployment with grounded outputs, robust guardrails, and production-ready architecture. Currently pursuing a BSc (Hons) in Computer Science at the University of Vavuniya, Sri Lanka.
              </p>
              <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                I specialize in building RAG platforms, agentic LLM applications, and high-performance Machine Learning pipelines using FastAPI, Next.js, and Docker.
              </p>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Technical Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="glass-card p-4 rounded-xl glow-hover">
                  <BrainCircuit className="text-accent-purple mb-2" size={20} />
                  <h3 className="font-semibold text-sm mb-1">AI & LLMs</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed">RAG, LangChain, LangGraph, Gemini API, Groq, Prompt Engineering, Semantic Search</p>
                </div>
                <div className="glass-card p-4 rounded-xl glow-hover">
                  <Database className="text-accent-cyan mb-2" size={20} />
                  <h3 className="font-semibold text-sm mb-1">ML & Data</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed">XGBoost, Scikit-learn, Pandas, NumPy, ChromaDB, PostgreSQL, ScyllaDB</p>
                </div>
                <div className="glass-card p-4 rounded-xl glow-hover">
                  <Terminal className="text-accent-cyan mb-2" size={20} />
                  <h3 className="font-semibold text-sm mb-1">Languages</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed">Python, TypeScript, JavaScript, SQL, MATLAB</p>
                </div>
                <div className="glass-card p-4 rounded-xl glow-hover">
                  <Code2 className="text-accent-purple mb-2" size={20} />
                  <h3 className="font-semibold text-sm mb-1">Backend & DevOps</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed">FastAPI, Next.js, React, Tailwind, Docker, GitHub Actions, Vercel</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-20">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project 1 */}
            <div className="glass-card rounded-xl p-5 glow-hover flex flex-col h-full border border-glass-border">
              <div className="relative h-40 sm:h-44 w-full rounded-lg overflow-hidden mb-4 bg-black/40 group/img border border-white/10">
                <Image
                  src="/cards/documind-ai.jpg"
                  alt="DocuMind AI"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold">DocuMind AI</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent-purple/10 text-accent-purple">2026</span>
              </div>
              <p className="text-xs font-semibold text-accent-cyan mb-3">RAG Document Intelligence Platform</p>
              <p className="text-foreground/80 text-xs sm:text-sm mb-4 leading-relaxed flex-1">
                Built an end-to-end RAG platform with FastAPI and Next.js for multi-page PDFs. Engineered an ingestion pipeline with PyMuPDF, chunking, and Gemini embeddings into ChromaDB. Reduced hallucinations with source-snippet attribution.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['Next.js', 'FastAPI', 'Gemini API', 'ChromaDB', 'Docker'].map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-foreground/5">{t}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-auto pt-2 border-t border-foreground/10">
                <Link href="#" className="text-xs font-semibold flex items-center gap-1 hover:text-accent-cyan transition-colors"><FaGithub size={14} /> GitHub</Link>
                <Link href="https://documind-ai-aqf.pages.dev/" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold flex items-center gap-1 hover:text-accent-purple transition-colors">Live Demo <ChevronRight size={14} /></Link>
              </div>
            </div>

            {/* Project 2: Research Project */}
            <div className="glass-card rounded-xl p-5 glow-hover flex flex-col h-full border border-glass-border">
              <div className="relative h-40 sm:h-44 w-full rounded-lg overflow-hidden mb-4 bg-black/40 group/img border border-white/10">
                <Image
                  src="/cards/research.jpg"
                  alt="F1 Telemetry ML"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold">F1 Telemetry ML</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan">Research</span>
              </div>
              <p className="text-xs font-semibold text-accent-purple mb-3">Overtaking Prediction & Battery SoC Engine</p>
              <p className="text-foreground/80 text-xs sm:text-sm mb-4 leading-relaxed flex-1">
                Architected a real-time platform ingesting live F1 SignalR timing feeds to predict overtake probability. Trained an XGBoost classifier on 10M+ rows of telemetry and modeled a physics-based battery engine using ScyllaDB and AsyncIO.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['Python', 'XGBoost', 'ScyllaDB', 'FastAPI', 'AsyncIO'].map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-foreground/5">{t}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-auto pt-2 border-t border-foreground/10">
                <Link href="https://github.com/itschathura/F1-PitLogic-Platform" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold flex items-center gap-1 hover:text-accent-cyan transition-colors">
                  <FaGithub size={14} /> GitHub
                </Link>
              </div>
            </div>

            {/* Project 3: F1 PitLogic Platform */}
            <div className="glass-card rounded-xl p-5 glow-hover flex flex-col h-full border border-glass-border">
              <div className="relative h-40 sm:h-44 w-full rounded-lg overflow-hidden mb-4 bg-black/40 group/img border border-white/10">
                <Image
                  src="/cards/f1-platform-image.jpg"
                  alt="F1 PitLogic Platform"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold">F1 PitLogic Platform</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent-purple/10 text-accent-purple">ML Web App</span>
              </div>
              <p className="text-xs font-semibold text-accent-cyan mb-3">End-to-End F1 Overtake Predictor</p>
              <p className="text-foreground/80 text-xs sm:text-sm mb-4 leading-relaxed flex-1">
                An end-to-end Machine Learning web application predicting overtake probabilities during Formula 1 races. Ingests real timing & vehicle telemetry via FastF1 (2019-2025 seasons), trained with XGBoost classification, SHAP interpretability, FastAPI backend, and React + Vite frontend.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['Python', 'FastF1', 'XGBoost', 'Scikit-learn', 'FastAPI', 'React', 'SHAP'].map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-foreground/5">{t}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-auto pt-2 border-t border-foreground/10">
                <Link href="https://github.com/itschathura/F1-PitLogic-Platform" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold flex items-center gap-1 hover:text-accent-cyan transition-colors">
                  <FaGithub size={14} /> GitHub
                </Link>
              </div>
            </div>

            {/* Project 4 */}
            <div className="glass-card rounded-xl p-5 glow-hover flex flex-col h-full border border-glass-border">
              <div className="relative h-40 sm:h-44 w-full rounded-lg overflow-hidden mb-4 bg-black/40 group/img border border-white/10">
                <Image
                  src="/cards/shopping-agent.png"
                  alt="SmartShop AI"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold">SmartShop AI</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-foreground/10 text-foreground">Ongoing</span>
              </div>
              <p className="text-xs font-semibold text-gradient mb-3">Multimodal Shopping Agent</p>
              <p className="text-foreground/80 text-xs sm:text-sm mb-4 leading-relaxed flex-1">
                Architected an end-to-end multimodal AI shopping assistant using LangGraph. Engineered a 3-tier guardrail pipeline to block off-topic queries and a database validation layer on PostgreSQL to prevent hallucinated items. Built multi-turn workflows persisting personalized agent memory.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['Next.js', 'FastAPI', 'LangGraph', 'Gemini', 'PostgreSQL', 'GitHub Actions'].map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-foreground/5">{t}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-auto pt-2 border-t border-foreground/10">
                <Link href="#" className="text-xs font-semibold flex items-center gap-1 hover:text-accent-cyan transition-colors"><FaGithub size={14} /> GitHub</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Certificates & Credentials Section */}
        <CertificatesSection />

        {/* Blog & News Section */}
        <BlogSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      <FooterSection />
    </div>
  );
}
