"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Blog } from "@/lib/blogsDb";
import { MONTHS } from "@/lib/blogsDb";
import { ArrowRight, Telescope, BookOpen, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSliderProps {
  slides: Blog[];
}

const TYPE_CONFIG = {
  "whats-up": {
    icon: Telescope,
    label: "Eyes on the Sky",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    accentColor: "from-blue-600 to-cyan-600",
    ctaText: "Read Sky Guide",
    sectionLink: "/blogs/eyes-on-the-sky",
    sectionLabel: "All Sky Updates",
  },
  tutorial: {
    icon: BookOpen,
    label: "Featured Tutorial",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    accentColor: "from-emerald-600 to-teal-600",
    ctaText: "Start Learning",
    sectionLink: "/blogs/tutorials",
    sectionLabel: "All Tutorials",
  },
  explainer: {
    icon: Lightbulb,
    label: "Featured Explainer",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/25",
    accentColor: "from-purple-600 to-violet-600",
    ctaText: "Read Article",
    sectionLink: "/blogs/explainers",
    sectionLabel: "All Explainers",
  },
} as const;

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning || idx === current) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(idx);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 400);
    },
    [current, isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, isPaused, slides.length]);

  if (slides.length === 0) return null;

  const post = slides[current];
  const contentType = post.contentType || "explainer";
  const config = TYPE_CONFIG[contentType];
  const Icon = config.icon;

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pt-24 md:pt-28 pb-8 px-4 max-w-7xl mx-auto relative z-10 text-center">

        <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tight">
          Astrohub <span className="text-blue-500">Transmission</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Your direct uplink to the cosmos. Explore expert tutorials, deep-space articles, and the latest astronomical blogs.
        </p>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 bg-slate-900">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.coverImage && (
              <img
                src={slide.coverImage}
                alt={slide.title}
                className="w-full h-full object-cover opacity-40"
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/70 to-slate-950" />
        {/* Colored accent glow based on type */}
        <div
          className={`absolute bottom-0 left-0 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-20 bg-gradient-to-r ${config.accentColor}`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 md:pt-12 pb-16 md:pb-20 text-left">
        <div
          className={`transition-all duration-400 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Type Badge */}
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border mb-6 ${config.badgeColor}`}
          >
            <Icon className="w-3.5 h-3.5" /> {config.label}
          </span>

          {/* Month/Year for Eyes on the Sky */}
          {contentType === "whats-up" && post.skyMonth && post.skyYear && (
            <div className="mb-3">
              <span className="text-sm font-bold text-white/60">
                {MONTHS[post.skyMonth - 1]} {post.skyYear}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 max-w-3xl leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {contentType === "tutorial" && post.difficultyLevel && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  post.difficultyLevel === "beginner"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : post.difficultyLevel === "intermediate"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {post.difficultyLevel.charAt(0).toUpperCase() + post.difficultyLevel.slice(1)}
              </span>
            )}
            {contentType === "explainer" && post.topicCategory && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {post.topicCategory}
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/blogs/${post.slug}`}
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${config.accentColor} hover:brightness-110 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg`}
            >
              {config.ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={config.sectionLink}
              className="inline-flex items-center gap-2 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              {config.sectionLabel}
            </Link>
          </div>
        </div>

        {/* Slider Controls */}
        {slides.length > 1 && (
          <div className="flex items-center gap-4 mt-12">
            {/* Prev/Next arrows */}
            <button
              onClick={prev}
              className="p-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots / Progress indicators */}
            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => {
                const dotType = slide.contentType || "explainer";
                const dotColor =
                  dotType === "whats-up"
                    ? "bg-blue-400"
                    : dotType === "tutorial"
                    ? "bg-emerald-400"
                    : "bg-purple-400";
                return (
                  <button
                    key={slide.id}
                    onClick={() => goTo(idx)}
                    className={`relative h-2 rounded-full transition-all duration-300 ${
                      idx === current ? `w-8 ${dotColor}` : "w-2 bg-slate-600 hover:bg-slate-500"
                    }`}
                    aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  >
                    {idx === current && !isPaused && (
                      <span
                        className={`absolute inset-0 rounded-full ${dotColor} opacity-40 animate-ping`}
                        style={{ animationDuration: "3s" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Type labels */}
            <div className="hidden md:flex items-center gap-3 ml-4 text-xs text-slate-500">
              {slides.map((slide, idx) => {
                const t = slide.contentType || "explainer";
                const TIcon = TYPE_CONFIG[t].icon;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goTo(idx)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      idx === current ? "text-slate-200" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <TIcon className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{TYPE_CONFIG[t].label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
