"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ExternalLink, 
  Eye, 
  ShieldCheck, 
  Calendar, 
  X, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  imageSrc: string;
  skills: string[];
  description: string;
  badgeColor: "cyan" | "purple" | "blue" | "emerald" | "amber";
}

const certificatesData: Certificate[] = [
  {
    id: "cs50ai",
    title: "CS50's Introduction to Artificial Intelligence with Python",
    issuer: "Harvard University",
    date: "Sep 2026",
    credentialId: "9450609b-8321-4b90-af9f-68895462abc9",
    verificationUrl: "https://cs50.harvard.edu/certificates/9450609b-8321-4b90-af9f-68895462abc9",
    imageSrc: "/certificates/CS50AI.png",
    skills: ["Artificial Intelligence", "Python", "Machine Learning", "Neural Networks", "12 Projects"],
    description: "Rigorous Harvard program covering graph search, adversarial search, knowledge representation, Bayesian networks, machine learning, deep learning, and NLP through 12 intensive projects.",
    badgeColor: "purple",
  },
  {
    id: "moratuwa-python",
    title: "Python Programming – Trainee Full Stack Developer",
    issuer: "University of Moratuwa, Sri Lanka (CODL)",
    date: "May 2024",
    credentialId: "WgGERcT8FF",
    verificationUrl: "https://open.uom.lk/verify",
    imageSrc: "/certificates/moratuwa-python.png",
    skills: ["Python", "Full Stack Development", "Soft Skills", "CSE Dept."],
    description: "Online learning programme conducted by the Department of Computer Science & Engineering. Validates core Python development techniques, object-oriented concepts, and professional soft skills.",
    badgeColor: "amber",
  },
  {
    id: "matlab-onramp",
    title: "MATLAB Onramp",
    issuer: "MathWorks Training Services",
    date: "Sep 2026",
    credentialId: "ecfa4ee1-fcef-4be3-8371-a768d32338e1",
    verificationUrl: "https://matlabacademy.mathworks.com/progress/share/certificate.html?id=ecfa4ee1-fcef-4be3-8371-a768d32338e1",
    imageSrc: "/certificates/matlab-onramp.png",
    skills: ["MATLAB", "Data Analysis", "Numerical Computing", "Data Visualization"],
    description: "Completed 100% of self-paced training in MATLAB language fundamentals, vectorization, matrix calculations, data import/export, and numerical data visual analysis.",
    badgeColor: "blue",
  },
  {
    id: "sololearn-sql",
    title: "SQL Intermediate",
    issuer: "Sololearn",
    date: "Jun 2024",
    credentialId: "CC-VVLBKINI",
    imageSrc: "/certificates/sql-sololearn-intermediate.png",
    skills: ["SQL", "Relational Databases", "Complex Queries", "Database Joins"],
    description: "Demonstrated theoretical and practical mastery of advanced SQL queries, table inner/outer joins, nested subqueries, aggregations, and database normalization.",
    badgeColor: "emerald",
  }
];

export default function CertificatesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const totalReal = certificatesData.length;
  // Clone first slide at the end for continuous forward loop
  const displaySlides = [...certificatesData, certificatesData[0]];

  // Auto-advance slide every 2 seconds (2000ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

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
      // Instantly reset to index 0 without animation after slide 4 -> 1 transition completes
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  const realIndex = currentIndex % totalReal;

  const getBadgeStyle = (color: Certificate["badgeColor"]) => {
    switch (color) {
      case "amber":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "purple":
        return "bg-accent-purple/15 text-accent-purple border-accent-purple/30";
      case "cyan":
        return "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30";
      case "emerald":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "blue":
      default:
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <section id="certificates" className="scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Certificates & <span className="text-gradient">Accreditations</span>
          </h2>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-foreground/60 mr-1.5">
            <strong className="text-accent-cyan">{realIndex + 1}</strong> / {totalReal}
          </span>
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg glass-card border border-glass-border hover:border-accent-cyan/50 text-foreground/80 hover:text-accent-cyan transition-all cursor-pointer glow-hover"
            aria-label="Previous certificate"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg glass-card border border-glass-border hover:border-accent-cyan/50 text-foreground/80 hover:text-accent-cyan transition-all cursor-pointer glow-hover"
            aria-label="Next certificate"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Card Container */}
      <div 
        className="relative glass-card rounded-xl overflow-hidden border border-glass-border hover:border-accent-cyan/40 transition-all duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Infinite Forward Sliding Track */}
        <div 
          className="flex w-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 700ms ease-out' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displaySlides.map((cert, index) => (
            <div 
              key={`${cert.id}-${index}`} 
              className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-12 min-h-[260px]"
            >
              {/* Left / Top: Compact Certificate Preview Image */}
              <div 
                className="lg:col-span-5 relative h-48 lg:h-auto min-h-[200px] bg-black/50 cursor-pointer overflow-hidden group/img"
                onClick={() => setSelectedCert(cert)}
              >
                <Image
                  src={cert.imageSrc}
                  alt={cert.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-background/90" />
                
                {/* Hover overlay button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-xs">
                  <button className="px-3.5 py-1.5 rounded-lg bg-foreground text-background font-medium text-xs flex items-center gap-1.5 shadow-lg transform -translate-y-1 group-hover/img:translate-y-0 transition-transform cursor-pointer">
                    <Eye size={14} /> Enlarge Image
                  </button>
                </div>

                {/* Issuer Pill */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border backdrop-blur-md shadow-md ${getBadgeStyle(cert.badgeColor)}`}>
                    {cert.issuer}
                  </span>
                </div>

                {/* Date Pill */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-black/60 text-foreground/80 backdrop-blur-md border border-white/10 flex items-center gap-1">
                    <Calendar size={11} /> {cert.date}
                  </span>
                </div>
              </div>

              {/* Right / Bottom: Compact Content Area */}
              <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                      {cert.title}
                    </h3>
                  </div>

                  <p className="text-foreground/80 text-xs sm:text-sm mb-3 leading-relaxed">
                    {cert.description}
                  </p>

                  {/* Credential ID tag */}
                  {cert.credentialId && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-foreground/5 text-[11px] text-foreground/70 border border-foreground/10 font-mono">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Credential ID: <strong className="text-foreground font-semibold">{cert.credentialId}</strong></span>
                    </div>
                  )}

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/80 border border-foreground/10 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-foreground/10 flex items-center justify-between gap-3 mt-auto">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="text-xs font-semibold text-foreground/80 hover:text-accent-cyan transition-colors flex items-center gap-1 py-1 cursor-pointer"
                  >
                    <Eye size={13} /> Full View
                  </button>

                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan transition-all border border-accent-cyan/30 flex items-center gap-1.5"
                    >
                      <span>Verify Credential</span>
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
          {/* Indicator Dots */}
          <div className="flex items-center gap-2">
            {certificatesData.map((cert, index) => (
              <button
                key={cert.id}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === realIndex
                    ? "w-8 bg-accent-cyan"
                    : "w-2 bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Go to certificate ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal View */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] glass-card border border-white/20 rounded-2xl overflow-hidden flex flex-col bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-foreground/5">
              <div className="pr-4">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">{selectedCert.title}</h3>
                <p className="text-xs text-foreground/60">{selectedCert.issuer} • Issued {selectedCert.date}</p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Full Image View */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[450px] w-full bg-black/60 p-4 flex items-center justify-center overflow-auto">
              <div className="relative w-full h-[350px] sm:h-[500px]">
                <Image
                  src={selectedCert.imageSrc}
                  alt={selectedCert.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1000px"
                  priority
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 bg-foreground/5">
              {selectedCert.credentialId && (
                <div className="text-xs font-mono text-foreground/80 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Credential ID: <strong className="text-foreground font-semibold">{selectedCert.credentialId}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-foreground/20 hover:bg-foreground/10 transition-colors cursor-pointer"
                >
                  Close
                </button>
                {selectedCert.verificationUrl && (
                  <a
                    href={selectedCert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-accent-cyan text-black hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <span>Verify Official URL</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
