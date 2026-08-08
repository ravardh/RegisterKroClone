import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

/* Coordinates kept as manually fixed — circle, number & text form one step block */
const journeySteps = [
  {
    no: "1",
    title: "You Can Trust",
    desc: "With over 12 years of experience, our team of CA experts helps you end to end.",
    node: { cx: 110, cy: 305 },
    number: { x: 100, y: 270 },
    text: { left: "5%", top: "82%", width: "27%" },
    delay: 0.45,
  },
  {
    no: "2",
    title: "Personalize Discovery Call for You",
    desc: "We believe in the power of personalized assistance. Your business journey should reflect your unique desires & approach.",
    node: { cx: 500, cy: 178 },
    number: { x: 500, y: 340 },
    text: { left: "28%", top: "15%", width: "34%" },
    delay: 0.95,
  },
  {
    no: "3",
    title: "Safety and Quality",
    desc: "Your finance is the heart of your business & we take care of everything which comes under it with the highest safety.",
    node: { cx: 820, cy: 60 },
    number: { x: 820, y: 220 },
    text: { left: "72%", top: "58%", width: "30%" },
    delay: 1.4,
  },
];

/* Through fixed nodes: soft into 1 → lower hill under step-2 text → settle at 2 → rise to 3 */
const PATH_D =
  "M40,260 C65,285 90,305 110,305 C200,305 245,220 320,225 C430,240 465,188 500,175 C620,185 720,50 820,60 C900,48 940,26 970,18";

const PATH_DURATION = 1.8;

const OurProcessSection = () => {
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);
  const desktopInView = useInView(desktopRef, { once: false, amount: 0.35 });
  const mobileInView = useInView(mobileRef, { once: false, amount: 0.3 });

  return (
    <section className="relative overflow-hidden bg-white pt-4 pb-8 md:pb-12">
      <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
        <h2 className="mb-3 text-center text-2xl font-bold tracking-tight text-(--heading) sm:text-3xl md:text-4xl">
          Our Process
        </h2>
        <p className="mx-auto mb-4 max-w-2xl text-center text-base leading-relaxed text-(--text) sm:text-lg md:mb-5">
          A simple, transparent journey—crafted around your business every step of the way.
        </p>

        {/* Desktop curved journey */}
        <div
          ref={desktopRef}
          className="relative mx-auto hidden aspect-[1000/400] w-full max-w-5xl lg:block"
        >
          <svg
            viewBox="0 0 1000 400"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            {/* Background numbers — grayed until their step activates */}
            {journeySteps.map((step) => (
              <motion.text
                key={`num-${step.no}`}
                x={step.number.x}
                y={step.number.y}
                textAnchor="middle"
                fontSize="180"
                fontWeight="800"
                initial={false}
                animate={{
                  fill: desktopInView ? "var(--primary)" : "var(--border)",
                  opacity: desktopInView ? 0.2 : 0.45,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: desktopInView ? step.delay : 0,
                }}
              >
                {step.no}
              </motion.text>
            ))}

            {/* Empty track */}
            <path d={PATH_D} stroke="var(--border)" strokeWidth="8" strokeLinecap="round" />

            {/* Path fills on scroll */}
            <motion.path
              d={PATH_D}
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,99,176,0.25))" }}
              initial={false}
              animate={{ pathLength: desktopInView ? 1 : 0 }}
              transition={{ duration: PATH_DURATION, ease: "easeInOut" }}
            />

            {/* Nodes — color with their step block as the line reaches them */}
            {journeySteps.map((step) => (
              <motion.g
                key={`node-${step.no}`}
                style={{ transformOrigin: `${step.node.cx}px ${step.node.cy}px` }}
              >
                <motion.circle
                  cx={step.node.cx}
                  cy={step.node.cy}
                  r="16"
                  strokeWidth="1.5"
                  initial={false}
                  animate={{
                    fill: desktopInView ? "#ffffff" : "#F3F4F6",
                    stroke: desktopInView ? "var(--border)" : "#D1D5DB",
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: desktopInView ? step.delay : 0,
                  }}
                />
                <motion.circle
                  cx={step.node.cx}
                  cy={step.node.cy}
                  r="10"
                  initial={false}
                  animate={{ fill: desktopInView ? "var(--success)" : "#9CA3AF" }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: desktopInView ? step.delay : 0,
                  }}
                />
              </motion.g>
            ))}
          </svg>

          {/* Text — same step block timing as circle + number */}
          {journeySteps.map((step) => (
            <motion.div
              key={`text-${step.no}`}
              className="absolute z-10"
              style={{
                left: step.text.left,
                top: step.text.top,
                width: step.text.width,
              }}
              initial={false}
              animate={
                desktopInView
                  ? { opacity: 1, filter: "grayscale(0)" }
                  : { opacity: 0.4, filter: "grayscale(1)" }
              }
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: desktopInView ? step.delay : 0,
              }}
            >
              <h3 className="mb-2 text-xl font-bold text-(--heading)">{step.title}</h3>
              <p className="text-sm leading-relaxed text-(--text) md:text-[15px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile vertical timeline */}
        <div ref={mobileRef} className="relative mx-auto max-w-md lg:hidden">
          <motion.div
            className="absolute left-[27px] top-4 bottom-16 w-0.5 origin-top bg-gradient-to-b from-(--primary) to-(--primary-hover)"
            aria-hidden
            initial={false}
            animate={{ scaleY: mobileInView ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <div className="space-y-8">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.no}
                className="relative flex gap-5"
                initial={false}
                animate={
                  mobileInView
                    ? { opacity: 1, filter: "grayscale(0)", x: 0 }
                    : { opacity: 0.4, filter: "grayscale(1)", x: 0 }
                }
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: mobileInView ? index * 0.35 : 0,
                }}
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-(--primary) to-(--primary-hover) text-xl font-extrabold text-white shadow-md shadow-(--primary)/30">
                  {step.no}
                </div>
                <div className="pt-1">
                  <h3 className="mb-1.5 text-lg font-bold text-(--heading)">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-(--text)">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProcessSection;
