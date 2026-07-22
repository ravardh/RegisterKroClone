import React from "react";
import { FaRocket, FaHandshake, FaHeadset, FaShieldHalved } from "react-icons/fa6";

const differentiators = [
  {
    no: "01",
    icon: FaRocket,
    title: "Expert-Led Guidance",
    description:
      "Seasoned professionals handle the complex legal work end-to-end, so you can focus on your business.",
  },
  {
    no: "02",
    icon: FaHandshake,
    title: "Transparent Process",
    description:
      "Clear, upfront pricing and real-time status updates at every stage—no hidden fees, no surprises.",
    featured: true,
  },
  {
    no: "03",
    icon: FaHeadset,
    title: "Friendly Support",
    description:
      "A dedicated Relationship Manager and support team ready to help whenever you need them.",
  },
];

const WhatSetsUsApartSection = () => {
  return (
    <section className="relative overflow-hidden bg-(--background) py-12 md:py-16">
      <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary) shadow-sm">
            <FaShieldHalved className="text-sm" /> Why Choose Us
          </span>
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
            What Sets Us Apart?
          </h2>
          <p className="text-base leading-relaxed text-(--secondary) sm:text-lg">
            We make complex legal work simple with expertise, transparency, and support at every step.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-3">
          {differentiators.map((item) => (
            <article
              key={item.no}
              className={`group relative flex flex-col overflow-hidden rounded-3xl p-7 transition duration-300 hover:-translate-y-1.5 ${
                item.featured
                  ? "bg-linear-to-br from-(--primary) via-(--accent) to-(--primary-hover) text-white shadow-xl shadow-(--primary)/30 md:-mt-4 md:mb-4"
                  : "border border-slate-100 bg-white text-(--brand-ink) shadow-sm hover:shadow-lg"
              }`}
            >
              <span
                className={`text-4xl font-extrabold ${
                  item.featured ? "text-white/80" : "text-(--primary)/85"
                }`}
              >
                {item.no}
              </span>
              <div
                className={`mb-4 mt-2 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  item.featured
                    ? "bg-white/15 text-white ring-1 ring-white/25"
                    : "bg-(--primary)/10 text-(--primary)"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p
                className={`text-sm leading-relaxed ${
                  item.featured ? "text-white/90" : "text-(--secondary)"
                }`}
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatSetsUsApartSection;
