"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "AI & Machine Learning",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
        // Fallback to mailto if Web3Forms key is not configured
        const subject = encodeURIComponent(`[Portfolio] ${formData.projectType} — from ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.projectType}\n\n${formData.message}`);
        window.open(`mailto:itsmechathura@outlook.com?subject=${subject}&body=${body}`, "_blank");
        setLoading(false);
        setSubmitted(true);
        setFormData({ name: "", email: "", projectType: "AI & Machine Learning", message: "" });
        return;
      }

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[Portfolio] ${formData.projectType} — from ${formData.name}`,
          from_name: formData.name,
          email: formData.email,
          project_type: formData.projectType,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", projectType: "AI & Machine Learning", message: "" });
      } else {
        setErrorMsg(data.message || "Failed to send message. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again or email directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 pb-12">
      <div className="glass-card rounded-2xl p-6 sm:p-8 md:p-10 border border-glass-border relative overflow-hidden glow-hover">
        {/* Background glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-cyan/10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Contact Context & Info */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3">
                Let's Connect <br />
                <span className="text-gradient">Let's Build Something Great</span>
              </h2>
              <p className="text-foreground/80 text-xs sm:text-sm leading-relaxed max-w-md">
                I'm always open to discussing AI/ML engineering opportunities, open-source collaborations, or custom full-stack solutions. Drop me a message and let's turn ideas into reality!
              </p>
            </div>

            {/* Contact Details List */}
            <div className="space-y-3 pt-1">
              <a 
                href="mailto:itsmechathura@outlook.com" 
                className="flex items-center gap-3 text-foreground/80 hover:text-accent-cyan transition-colors group"
              >
                <div className="p-2.5 rounded-lg bg-foreground/5 group-hover:bg-accent-cyan/10 text-accent-cyan transition-colors border border-foreground/10">
                  <Mail size={16} />
                </div>
                <span className="text-xs sm:text-sm font-medium">itsmechathura@outlook.com</span>
              </a>

              <a 
                href="tel:+94717480048" 
                className="flex items-center gap-3 text-foreground/80 hover:text-accent-cyan transition-colors group"
              >
                <div className="p-2.5 rounded-lg bg-foreground/5 group-hover:bg-accent-cyan/10 text-accent-cyan transition-colors border border-foreground/10">
                  <Phone size={16} />
                </div>
                <span className="text-xs sm:text-sm font-medium">+94 71 748 0048</span>
              </a>

              <div className="flex items-center gap-3 text-foreground/80">
                <div className="p-2.5 rounded-lg bg-foreground/5 text-accent-purple border border-foreground/10">
                  <MapPin size={16} />
                </div>
                <span className="text-xs sm:text-sm">Vavuniya, Sri Lanka • Available Remote</span>
              </div>
            </div>

            {/* Social Quick Icons */}
            <div className="pt-2 flex items-center gap-2.5">
              <Link 
                href="https://linkedin.com/in/dharmasiri17" 
                target="_blank"
                className="p-2.5 rounded-lg glass-card border border-glass-border hover:border-accent-cyan/50 text-foreground/80 hover:text-accent-cyan transition-all glow-hover"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={18} />
              </Link>
              <Link 
                href="https://github.com/itschathura" 
                target="_blank"
                className="p-2.5 rounded-lg glass-card border border-glass-border hover:border-accent-cyan/50 text-foreground/80 hover:text-accent-cyan transition-all glow-hover"
                aria-label="GitHub Profile"
              >
                <FaGithub size={18} />
              </Link>
              <a 
                href="mailto:itsmechathura@outlook.com"
                className="p-2.5 rounded-lg glass-card border border-glass-border hover:border-accent-cyan/50 text-foreground/80 hover:text-accent-cyan transition-all glow-hover"
                aria-label="Send Email"
              >
                <Mail size={18} />
              </a>
              <a 
                href="tel:+94717480048"
                className="p-2.5 rounded-lg glass-card border border-glass-border hover:border-accent-cyan/50 text-foreground/80 hover:text-accent-cyan transition-all glow-hover"
                aria-label="Call Phone"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6 bg-background/60 backdrop-blur-md p-5 sm:p-6 rounded-xl border border-glass-border shadow-lg">
            {submitted ? (
              <div className="py-8 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-base font-bold text-foreground">Message Sent Successfully!</h3>
                <p className="text-xs text-foreground/70 max-w-xs mx-auto">
                  Thank you for reaching out. Chathura will review your message and respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/20 transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan transition-colors text-xs font-sans"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan transition-colors text-xs font-sans"
                    />
                  </div>
                </div>

                {/* Project Type Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-accent-cyan focus:outline-none focus:border-accent-cyan transition-colors text-xs font-sans cursor-pointer"
                  >
                    <option value="AI & Machine Learning" className="bg-background text-foreground">AI & Machine Learning</option>
                    <option value="RAG & LLM Systems" className="bg-background text-foreground">RAG & LLM Systems</option>
                    <option value="Full Stack Web App" className="bg-background text-foreground">Full Stack Web App</option>
                    <option value="DevOps & CI/CD" className="bg-background text-foreground">DevOps & CI/CD</option>
                    <option value="General Inquiry" className="bg-background text-foreground">General Inquiry</option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={3.5 as any}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, idea, or opportunity..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-cyan transition-colors text-xs font-sans resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan text-xs font-semibold border border-accent-cyan/40 transition-all flex items-center justify-center gap-2 cursor-pointer glow-hover"
                >
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={14} />
                    </>
                  )}
                </button>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
