import React from "react";
import About1 from "../assets/about1.png";
import About2 from "../assets/about2.png";
import SEOHelmet from "../components/SEOHelmet";
import OurTeamSection from "../components/OurTeamSection";
import {
  FaBuilding,
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaUserTie,
  FaHeadset,
  FaBullseye,
  FaEye,
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
  FaArrowDown,
} from "react-icons/fa";

const highlights = [
  { icon: FaUsers, value: "2000+", label: "Happy Clients" },
  { icon: FaChartLine, value: "98%", label: "Success Rate" },
  { icon: FaShieldAlt, value: "50+", label: "Expert Team" },
];

const whatWeDoItems = [
  {
    icon: FaBuilding,
    title: "Company Registration",
    description:
      "Private limited, LLP, OPC, and partnership registration with end-to-end expert support.",
    accent: "from-blue-500 to-indigo-600",
    delay: "0ms",
  },
  {
    icon: FaFileInvoiceDollar,
    title: "GST & Tax Compliance",
    description:
      "GST registration, filing, and tax compliance handled accurately and on time.",
    accent: "from-emerald-500 to-teal-600",
    delay: "80ms",
  },
  {
    icon: FaBalanceScale,
    title: "Legal Documentation",
    description:
      "Drafting, filings, and documentation for licenses, agreements, and regulatory needs.",
    accent: "from-violet-500 to-purple-600",
    delay: "160ms",
  },
  {
    icon: FaUserTie,
    title: "Business Advisory",
    description:
      "Guidance on structure, compliance strategy, and growth-ready business setup.",
    accent: "from-amber-500 to-orange-600",
    delay: "240ms",
  },
  {
    icon: FaHeadset,
    title: "Dedicated Support",
    description:
      "A relationship manager stays with you from application to completion and beyond.",
    accent: "from-rose-500 to-pink-600",
    delay: "320ms",
  },
];

const storyChapters = [
  {
    step: "01",
    title: "The Beginning",
    icon: FaLightbulb,
    accent: "from-amber-400 to-orange-500",
    text: "Tax Pro Solution started with one idea—starting a business in India should feel simple, not stressful.",
  },
  {
    step: "02",
    title: "Building Trust",
    icon: FaHandshake,
    accent: "from-blue-500 to-indigo-600",
    text: "We combined expert guidance, transparent pricing, and a dedicated RM for every client.",
  },
  {
    step: "03",
    title: "Growing Together",
    icon: FaRocket,
    accent: "from-violet-500 to-purple-600",
    text: "From registration to full compliance, we now support thousands of companies nationwide.",
  },
  {
    step: "04",
    title: "Today & Beyond",
    icon: FaChartLine,
    accent: "from-emerald-500 to-teal-600",
    text: "We keep investing in technology and people so founders can focus on what matters—building their business.",
  },
];

const SectionBadge = ({ children }) => (
  <span className="about-badge mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 shadow-sm backdrop-blur-sm">
    {children}
  </span>
);

const About = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Tax Pro Solution",
    description:
      "Learn about Tax Pro Solution - your trusted partner in business registration and compliance",
  };

  return (
    <>
      <SEOHelmet
        title="About Tax Pro Solution - Your Business Growth Partner"
        description="Discover Tax Pro Solution's mission to simplify business registration and compliance. We're your trusted partner for GST, company registration, and tax solutions."
        keywords="about us, business solutions, company registration, tax services, compliance"
        canonicalUrl="https://taxprosolution.co.in/about"
        structuredData={aboutSchema}
      />

      {/* Hero */}
      <section className="about-hero relative -mt-20 flex min-h-[75svh] flex-col items-center justify-center overflow-hidden bg-[url('/hero.webp')] bg-cover bg-center pt-24 pb-14 sm:pt-28 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-950/70 via-indigo-900/55 to-indigo-950/80" />
        <div
          className="about-hero-blob pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="about-hero-blob about-hero-blob--delay pointer-events-none absolute -bottom-16 right-1/4 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl"
          aria-hidden
        />

        <div className="about-hero-icon about-hero-icon--1 pointer-events-none absolute left-[8%] top-[28%] hidden text-white/20 lg:block">
          <FaBuilding className="h-14 w-14" />
        </div>
        <div className="about-hero-icon about-hero-icon--2 pointer-events-none absolute right-[10%] top-[32%] hidden text-white/15 lg:block">
          <FaBalanceScale className="h-12 w-12" />
        </div>
        <div className="about-hero-icon about-hero-icon--3 pointer-events-none absolute bottom-[22%] left-[14%] hidden text-white/10 lg:block">
          <FaFileInvoiceDollar className="h-10 w-10" />
        </div>

        <div className="about-animate-in relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-12 md:px-20">
          <SectionBadge>About Tax Pro Solution</SectionBadge>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            About Us
          </h1>
          <p className="mx-auto max-w-3xl text-base text-white/85 sm:text-lg md:text-xl">
            Your trusted partner in business registration and compliance. We
            simplify the complex so you can focus on growing your business.
          </p>
          <a
            href="#about-us"
            className="about-scroll-hint mt-8 inline-flex flex-col items-center gap-1 text-sm text-white/70 transition hover:text-white"
          >
            <span>Explore our journey</span>
            <FaArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* 1. About Us */}
      <section id="about-us" className="relative py-14 md:py-24 bg-(--background) overflow-hidden">
        <div
          className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl"
          aria-hidden
        />
        <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="about-animate-in about-animate-in--delay-1">
              <SectionBadge>Who We Are</SectionBadge>
              <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
                About Us
              </h2>
              <p className="text-(--secondary) text-base sm:text-lg leading-relaxed mb-4">
                Tax Pro Solution is a leading business services platform
                dedicated to helping entrepreneurs navigate company registration,
                compliance, and legal documentation with confidence.
              </p>
              <p className="text-(--secondary) text-base sm:text-lg leading-relaxed mb-6">
                With seasoned professionals and thousands of successful
                registrations, we make business services simple, accessible, and
                affordable for every stage of growth.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="about-stat-card rounded-2xl bg-white p-3 sm:p-4 text-center shadow-md shadow-indigo-100/50 ring-1 ring-indigo-50"
                  >
                    <item.icon className="mx-auto mb-2 h-4 w-4 text-(--primary) sm:h-5 sm:w-5" />
                    <p className="text-lg font-bold text-(--primary) sm:text-xl">
                      {item.value}
                    </p>
                    <p className="text-[10px] text-(--secondary) sm:text-xs">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-animate-in about-animate-in--delay-2 relative">
              <div
                className="about-image-glow absolute -inset-3 rounded-3xl bg-linear-to-br from-indigo-400/30 to-violet-500/30 blur-xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-indigo-300/30 ring-1 ring-white/60">
                <img
                  src={About1}
                  alt="About Tax Pro Solution"
                  className="w-full h-auto object-cover transition duration-700 hover:scale-105"
                />
              </div>
              <div className="about-float-card absolute -bottom-4 -left-2 sm:-left-4 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-indigo-200/50 ring-1 ring-indigo-100">
                <p className="text-xs font-semibold text-indigo-600">
                  Trusted Nationwide
                </p>
                <p className="text-sm font-bold text-(--text)">
                  Registration Made Simple
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision — three-column bridge */}
      <section className="relative overflow-hidden bg-(--background) py-14 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.08),transparent_40%)]"
          aria-hidden
        />
        <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="about-animate-in mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <SectionBadge>Purpose & Direction</SectionBadge>
            <h2 className="text-(--primary) text-2xl font-bold sm:text-3xl md:text-4xl">
              Our Mission and Vision
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:gap-8 lg:grid-cols-3 lg:items-stretch">
            <article className="about-card about-animate-in about-animate-in--delay-1 order-2 flex flex-col justify-center rounded-3xl bg-white p-7 shadow-lg shadow-indigo-100/60 ring-1 ring-indigo-100/80 sm:p-8 lg:order-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                <FaBullseye className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-(--text) sm:text-2xl">
                Our Mission
              </h3>
              <p className="text-sm leading-relaxed text-(--secondary) sm:text-base">
                To empower businesses with seamless, efficient, and expert-driven
                solutions for registration, compliance, and legal
                requirements—without complexity or hidden costs.
              </p>
            </article>

            <div className="about-animate-in about-animate-in--delay-2 order-1 overflow-hidden rounded-3xl shadow-2xl shadow-indigo-300/30 ring-1 ring-indigo-100/80 lg:order-2">
              <img
                src={About2}
                alt="Our Mission and Vision"
                className="block h-full min-h-[220px] w-full object-cover object-center sm:min-h-[260px] lg:min-h-full"
              />
            </div>

            <article className="about-card about-animate-in about-animate-in--delay-3 order-3 flex flex-col justify-center rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-indigo-700 p-7 text-white shadow-xl shadow-indigo-500/25 sm:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                <FaEye className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-bold sm:text-2xl">Our Vision</h3>
              <p className="text-sm leading-relaxed text-indigo-100 sm:text-base">
                To become India&apos;s most trusted digital platform for business
                registration and compliance, where every entrepreneur can start
                and scale with clarity, speed, and professional support.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 3. What We Do */}
      <section className="relative py-14 md:py-24 bg-(--background) overflow-hidden">
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-violet-200/25 blur-3xl"
          aria-hidden
        />
        <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="about-animate-in mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <SectionBadge>Services</SectionBadge>
            <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              What We Do
            </h2>
            <p className="text-(--secondary) text-base sm:text-lg leading-relaxed">
              From your first registration to ongoing compliance, we provide
              complete business services under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {whatWeDoItems.map((item, index) => (
              <article
                key={item.title}
                className={`about-card about-service-card group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-200/50 ${
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
                style={{ animationDelay: item.delay }}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-500/[0.03] via-transparent to-violet-500/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <div
                  className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${item.accent} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="relative text-lg font-bold text-(--text) mb-2 group-hover:text-indigo-950">
                  {item.title}
                </h3>
                <p className="relative text-sm sm:text-base text-(--secondary) leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Story — horizontal reel */}
      <section
        id="our-story"
        className="about-story-section relative overflow-hidden bg-linear-to-b from-indigo-50/70 via-white to-violet-50/50 py-16 md:py-24"
      >
        <div
          className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-violet-200/25 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="about-animate-in mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <SectionBadge>Our Story · Our Journey</SectionBadge>
            <h2 className="text-(--primary) mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              The journey behind your compliance partner
            </h2>
            <p className="text-(--secondary) mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
              Four chapters of growth—from a simple idea to trusted support for
              thousands of businesses across India.
            </p>
          </div>

          <div className="about-story-reel relative mx-auto max-w-6xl">
            <div
              className="pointer-events-none absolute left-8 right-8 top-[4.25rem] hidden h-px bg-linear-to-r from-transparent via-indigo-200 to-transparent lg:block"
              aria-hidden
            />

            <div className="about-story-reel-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
              {storyChapters.map((chapter, index) => (
                <article
                  key={chapter.step}
                  className="about-story-reel-card group relative flex w-[82vw] max-w-[320px] shrink-0 snap-center flex-col rounded-3xl bg-white p-6 shadow-lg shadow-indigo-100/60 ring-1 ring-indigo-100/80 transition duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-200/50 sm:w-[300px] lg:w-auto lg:max-w-none"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div
                    className={`absolute -top-3 left-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${chapter.accent} text-xs font-bold text-white shadow-lg ring-4 ring-white`}
                    aria-hidden
                  >
                    {chapter.step}
                  </div>

                  <div
                    className={`mb-5 mt-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${chapter.accent} text-white shadow-md transition duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <chapter.icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-(--text) sm:text-xl">
                    {chapter.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-(--secondary) sm:text-base">
                    {chapter.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <p className="about-animate-in about-animate-in--delay-3 mx-auto mt-8 max-w-2xl text-center text-sm text-indigo-400 lg:hidden">
            Swipe to explore our story →
          </p>

          <blockquote className="about-animate-in about-animate-in--delay-3 mx-auto mt-10 max-w-3xl rounded-2xl border border-indigo-100 bg-white/80 px-6 py-7 text-center shadow-md shadow-indigo-100/40 backdrop-blur-sm sm:px-10">
            <p className="text-base font-medium italic leading-relaxed text-(--secondary) sm:text-lg">
              &ldquo;We&apos;re not just filing forms—we&apos;re helping founders
              turn ambition into registered, compliant, growing businesses.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* 5. Meet Our Team */}
      <OurTeamSection
        badge="Meet Our Team"
        title="The People Behind Your Success"
        subtitle="Dedicated professionals who guide you through registration, compliance, and every step of your business journey."
      />
    </>
  );
};

export default About;
