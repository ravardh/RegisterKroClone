import React from "react";
import {
  FaWpforms,
  FaUserTie,
  FaFolderOpen,
  FaClipboardCheck,
  FaArrowRightLong,
} from "react-icons/fa6";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const processSteps = [
  {
    icon: FaWpforms,
    title: "Choose a Service & Apply",
    description:
      "Pick the service you need and fill a quick, simple form. Share only essential details—kept safe and private.",
  },
  {
    icon: FaUserTie,
    title: "Lead & Manager Assignment",
    description:
      "Your application instantly creates a lead and a dedicated Relationship Manager becomes your single point of contact.",
  },
  {
    icon: FaFolderOpen,
    title: "Documents & Expert Handling",
    description:
      "Your RM collects and verifies documents while our experts take care of filings, compliance, and processing.",
  },
  {
    icon: FaClipboardCheck,
    title: "Track Progress & Confirm",
    description:
      "Follow your application live via the tracking dashboard and receive confirmations and documents on email.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-16">
      <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
            How Does TaxPro Solution Work?
          </h2>
          <p className="text-base leading-relaxed text-(--secondary) sm:text-lg">
            Simple, guided, and fully online—from application to completion, we handle everything for you.
          </p>
        </div>

        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              className={`relative flex flex-col items-center text-center group ${
                index % 2 === 1 ? "lg:mt-28" : ""
              }`}
              initial="muted"
              whileInView="colored"
              viewport={{ once: false, amount: 0.4 }}
              variants={{
                muted: {
                  opacity: 0.4,
                  filter: "grayscale(1)",
                  transition: { duration: 0.4, ease: "easeOut", delay: 0 },
                },
                colored: {
                  opacity: 1,
                  filter: "grayscale(0)",
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                    delay: index * 0.8,
                  },
                },
              }}
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-(--primary)/15 to-(--brand-light)/25 text-(--base-black) group-hover:text-(--primary) shadow-md shadow-(--primary)/10 ring-1 ring-(--primary)/10">
                <step.icon className="h-8 w-8" />
              </div>
              <span className="mb-1 text-2xl font-extrabold tracking-wide text-(--base-black) group-hover:text-(--primary)">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2 text-lg font-bold text-(--brand-black) group-hover:text-(--primary)">{step.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-(--secondary)">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-2xl bg-(--success) px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-(--success)/30 transition hover:bg-(--success-hover) hover:shadow-xl sm:text-base"
          >
            Start Your Application <FaArrowRightLong className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
