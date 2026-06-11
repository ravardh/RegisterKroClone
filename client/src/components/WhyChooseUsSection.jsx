import React from "react";
import { Link } from "react-router-dom";
import {
  FaRocket,
  FaUserTie,
  FaShieldAlt,
  FaChartLine,
  FaHeadset,
  FaRupeeSign,
} from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

const reasons = [
  {
    icon: FaRocket,
    title: "Fast 7-Day Turnaround",
    description:
      "Get your business registered quickly with our streamlined process and expert handling at every step.",
    accent: "from-indigo-500 to-violet-600",
    featured: true,
  },
  {
    icon: FaUserTie,
    title: "Dedicated Relationship Manager",
    description:
      "A personal RM guides you from application to completion—one expert, one contact, zero confusion.",
    accent: "from-blue-500 to-indigo-600",
  },
  {
    icon: FaRupeeSign,
    title: "Transparent Pricing",
    description:
      "Clear, upfront pricing with no hidden fees. You know exactly what you pay before you start.",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    icon: FaShieldAlt,
    title: "100% Secure & Compliant",
    description:
      "Your documents and data are handled with bank-grade security and full regulatory compliance.",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: FaChartLine,
    title: "Real-Time Progress Tracking",
    description:
      "Track your application status live through our dashboard and get updates at every milestone.",
    accent: "from-amber-500 to-orange-600",
  },
  {
    icon: FaHeadset,
    title: "Expert Support, Always",
    description:
      "Seasoned professionals available to answer questions and resolve issues whenever you need help.",
    accent: "from-rose-500 to-pink-600",
  },
];

const stats = [
  { value: "5000+", label: "Happy Clients" },
  { value: "98%", label: "Success Rate" },
  { value: "50+", label: "Expert Team" },
  { value: "7 Days", label: "Avg. Turnaround" },
];

const WhyChooseUsSection = () => {
  const featured = reasons.find((r) => r.featured);
  const rest = reasons.filter((r) => !r.featured);

  return (
    <section className="why-choose-section relative overflow-hidden py-8 md:py-14 bg-linear-to-b from-white via-indigo-50/40 to-slate-50">
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-violet-300/15 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
        <div className="mx-auto mb-7 max-w-3xl text-center md:mb-9">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 shadow-sm backdrop-blur-sm">
            Why Choose Us
          </span>
          <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            The Smarter Way to Register & Grow
          </h2>
          <p className="text-(--secondary) text-base sm:text-lg md:text-xl leading-relaxed">
            Thousands of businesses trust us for registration, compliance, and
            ongoing support—because we make complex legal work simple.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {featured && (
            <article className="why-choose-card group relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-600 via-violet-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/25 md:col-span-2 lg:col-span-2 lg:row-span-2 lg:flex lg:flex-col lg:justify-between">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-400/20 blur-xl"
                aria-hidden
              />

              <div className="relative">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                  <featured.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                  {featured.title}
                </h3>
                <p className="text-indigo-100 text-sm sm:text-base leading-relaxed max-w-md">
                  {featured.description}
                </p>
              </div>

              <div className="relative mt-8 flex flex-wrap gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-sm"
                  >
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-indigo-100/90">{stat.label}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          {rest.map((reason, index) => (
            <article
              key={reason.title}
              className="why-choose-card group relative overflow-hidden rounded-2xl border border-indigo-100/90 bg-white/90 p-5 sm:p-6 shadow-md shadow-indigo-100/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-200/50"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-500/[0.03] via-transparent to-violet-500/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <div
                className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${reason.accent} text-white shadow-lg transition-transform duration-500 group-hover:scale-110`}
              >
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="relative text-lg font-bold text-(--text) mb-2 transition-colors group-hover:text-indigo-950">
                {reason.title}
              </h3>
              <p className="relative text-sm text-(--secondary) leading-relaxed">
                {reason.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-7 md:mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-2xl bg-(--primary) px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-(--primary-hover) hover:shadow-xl hover:shadow-indigo-500/40"
          >
            Explore Our Services
            <FaArrowRightLong className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-(--primary) px-6 py-3.5 text-sm sm:text-base font-semibold text-(--primary) transition hover:bg-(--primary) hover:text-white"
          >
            Talk to an Expert
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
