import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";

const heroStats = [
  { value: "2000+", label: "Businesses Served" },
  { value: "4.8", label: "Average Rating" },
  { value: "7 Days", label: "Avg. Turnaround" },
  { value: "98%", label: "Success Rate" },
];

const parseAnimatedValue = (value) => {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return null;
  }

  const numberPart = match[1];
  const suffix = match[2] ?? "";
  const decimals = numberPart.includes(".") ? numberPart.split(".")[1].length : 0;

  return {
    number: Number(numberPart),
    suffix,
    decimals,
  };
};

const AnimatedStatValue = ({ value, duration = 2000 }) => {
  const parsed = useMemo(() => parseAnimatedValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!parsed) {
      setDisplayValue(value);
      return undefined;
    }

    let frameId;
    const startTime = performance.now();

    const updateValue = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const currentValue = parsed.number * progress;

      const formattedNumber =
        parsed.decimals > 0
          ? currentValue.toFixed(parsed.decimals)
          : String(Math.floor(currentValue));

      setDisplayValue(`${formattedNumber}${parsed.suffix}`);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateValue);
      }
    };

    setDisplayValue(`${parsed.decimals > 0 ? (0).toFixed(parsed.decimals) : "0"}${parsed.suffix}`);
    frameId = requestAnimationFrame(updateValue);

    return () => cancelAnimationFrame(frameId);
  }, [duration, parsed, value]);

  return displayValue;
};

const HeroSection = () => {
  return (
    <section className="relative -mt-20 overflow-hidden bg-linear-to-b from-[color-mix(in_srgb,var(--brand-pale)_60%,white)] via-white to-white sm:-mt-24">
      <div
        className="pointer-events-none absolute -top-10 -right-16 h-80 w-80 rounded-full bg-(--primary)/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-(--brand-light)/25 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto px-4 pt-24 pb-14 text-center sm:px-12 sm:pt-32 sm:pb-16 md:px-20 md:pt-40 md:pb-20 lg:px-32">
        <span className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-(--primary)/20 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary) shadow-sm backdrop-blur-sm">
          <IoMdStar className="text-sm" />
          Trusted by 2000+ businesses
        </span>

        <h1 className="mx-auto max-w-5xl text-3xl font-extrabold leading-tight tracking-tight text-(--brand-ink) sm:text-5xl md:text-6xl">
          Launch Your Business in Just{" "}
          <span className="bg-linear-to-r from-(--primary) to-(--accent) bg-clip-text text-transparent">
            7 Days
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-(--secondary) sm:text-lg md:text-xl">
          Fast, reliable, and tailored online business solutions with free expert
          consultation—from registration to compliance, we handle it all.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-2xl bg-(--success) px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-(--success)/30 transition hover:bg-(--success-hover) hover:shadow-xl sm:text-base"
          >
            Get Started <FaArrowRightLong className="h-4 w-4" />
          </Link>
          
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-4">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-(--primary)/10 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-sm"
            >
              <p className="text-2xl font-extrabold text-(--base-black) sm:text-3xl">
                <AnimatedStatValue value={stat.value} duration={2000} />
              </p>
              <p className="mt-1 text-xs text-(--secondary) sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
