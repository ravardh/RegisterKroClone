import React from "react";
import {
  FaRocket,
  FaUserTie,
  FaShieldAlt,
  FaChartLine,
  FaHeadset,
  FaRupeeSign,
} from "react-icons/fa";

const reasons = [
  {
    icon: FaRocket,
    title: "Fast 7-Day Turnaround",
    description:
      "Get your business registered quickly with our streamlined process and expert handling at every step.",
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
  { value: "2000+", label: "Happy Clients" },
  { value: "98%", label: "Success Rate" },
  { value: "50+", label: "Expert Team" },
  { value: "7 Days", label: "Avg. Turnaround" },
];

const QuestionsCtaSection = () => {
  const featured = reasons.find((r) => r.featured);
  const rest = reasons.filter((r) => !r.featured);

  return (
    <section className="relative overflow-hidden bg-(--background) px-6 py-12 sm:px-12 md:px-20 md:py-16 lg:px-25">
      <div className="container relative mx-auto">
        <div className="mx-auto grid max-w-6xl gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {featured && (
            <article className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-(--primary) via-(--accent) to-(--primary-hover) p-6 text-white shadow-xl shadow-(--primary)/25 sm:p-8 md:col-span-2 lg:col-span-2 lg:row-span-2 lg:flex lg:flex-col lg:justify-between">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl"
                aria-hidden
              />

              <div className="relative">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                  <featured.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold sm:text-3xl">{featured.title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
                  {featured.description}
                </p>
              </div>

              <div className="relative mt-8 flex flex-wrap gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-sm"
                  >
                    <p className="text-xl font-bold sm:text-2xl">{stat.value}</p>
                    <p className="text-xs text-white/85">{stat.label}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          {rest.map((reason) => (
            <article
              key={reason.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div
                className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${reason.accent} text-white shadow-lg transition-transform duration-500 group-hover:scale-110`}
              >
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mb-2 text-lg font-bold text-(--brand-ink)">
                {reason.title}
              </h3>
              <p className="relative text-sm leading-relaxed text-(--secondary)">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuestionsCtaSection;
