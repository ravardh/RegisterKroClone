import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAppData } from "../context/DataContext";

const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const teamPhotoUrl = (path) =>
  path ? `${backendBase}${path.startsWith("/") ? path : `/${path}`}` : "";

const OurTeamSection = ({
  badge = "Our Team",
  title = "Meet the People Behind Your Success",
  subtitle = "Meet the specialists who guide your registration, compliance, and business growth.",
}) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const { teamMembers: teamData, isDataLoaded } = useAppData();

  const [teamIndex, setTeamIndex] = useState(0);
  const [teamPerPage, setTeamPerPage] = useState(3);
  const [teamCarouselPaused, setTeamCarouselPaused] = useState(false);
  const maxTeamIndex =
    teamMembers.length > 0
      ? Math.ceil(teamMembers.length / teamPerPage) - 1
      : 0;

  useEffect(() => {
    if (isDataLoaded) {
      setTeamMembers(teamData);
      setIsLoadingTeam(false);
    }
  }, [teamData, isDataLoaded]);

  useEffect(() => {
    const handleResize = () => {
      const teamPage = window.innerWidth < 640 ? 1 : 3;
      setTeamPerPage(teamPage);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTeamIndex((prev) => Math.min(prev, maxTeamIndex));
  }, [maxTeamIndex]);

  useEffect(() => {
    if (maxTeamIndex < 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    if (teamCarouselPaused) return;
    const interval = setInterval(() => {
      setTeamIndex((prev) => (prev >= maxTeamIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxTeamIndex, teamCarouselPaused]);

  const handleTeamNext = () => {
    setTeamIndex((prev) => (prev >= maxTeamIndex ? 0 : prev + 1));
  };

  const handleTeamPrev = () => {
    setTeamIndex((prev) => (prev <= 0 ? maxTeamIndex : prev - 1));
  };

  const visibleTeamMembers = teamMembers.slice(
    teamIndex * teamPerPage,
    (teamIndex + 1) * teamPerPage
  );

  return (
    <section className="our-team-section relative py-12 md:py-24 overflow-hidden bg-linear-to-b from-slate-50/80 via-white to-indigo-50/30">
      <div
        className="our-team-blob pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl md:h-96 md:w-96"
        aria-hidden
      />
      <div
        className="our-team-blob our-team-blob--delay pointer-events-none absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl md:h-72 md:w-72"
        aria-hidden
      />

      <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
        <div className="our-team-header mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 shadow-sm backdrop-blur-sm">
            {badge}
          </span>
          <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-(--secondary) text-base sm:text-lg md:text-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {isLoadingTeam ? (
          <div className="text-center py-12">
            <p className="text-(--secondary) text-lg animate-pulse">
              Loading team...
            </p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-(--secondary) text-lg">
              Team profiles coming soon.
            </p>
          </div>
        ) : (
          <div
            className="relative mx-auto max-w-[1140px]"
            onMouseEnter={() => setTeamCarouselPaused(true)}
            onMouseLeave={() => setTeamCarouselPaused(false)}
          >
            <div className="relative sm:px-12 md:px-14">
              {maxTeamIndex > 0 && (
                <button
                  type="button"
                  onClick={handleTeamPrev}
                  className="our-team-nav-btn absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg shadow-indigo-200/50 ring-1 ring-indigo-100 transition duration-300 hover:scale-110 hover:bg-indigo-600 hover:text-white hover:shadow-indigo-300/40 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                  aria-label="Previous team members"
                >
                  <FaChevronLeft className="h-4 w-4" aria-hidden />
                </button>
              )}

              <div className="min-w-0 overflow-hidden py-2">
                <div
                  key={teamIndex}
                  className={`home-team-carousel-pane grid items-stretch gap-5 sm:gap-6 md:gap-7 ${
                    teamPerPage === 1
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-3"
                  }`}
                >
                  {visibleTeamMembers.map((member, index) => (
                    <article
                      key={member._id}
                      className="home-team-card home-team-card--in-carousel group relative flex h-full min-h-[260px] flex-col items-center rounded-2xl bg-white p-5 pb-6 text-center shadow-[0_8px_30px_-12px_rgba(79,70,229,0.25)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-16px_rgba(79,70,229,0.35)] sm:min-h-[280px] sm:p-6 sm:pb-7"
                      style={{
                        animationDelay: `${Math.min(index, 2) * 80}ms`,
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/[0.04] via-transparent to-violet-500/[0.06] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        aria-hidden
                      />

                      <div className="relative mb-4 shrink-0 sm:mb-5">
                        <div
                          className="our-team-avatar-glow absolute -inset-1.5 rounded-full bg-linear-to-br from-indigo-400 via-violet-500 to-indigo-600 opacity-60 blur-md transition-all duration-500 group-hover:opacity-90 group-hover:blur-lg"
                          aria-hidden
                        />
                        <div className="relative rounded-full bg-linear-to-br from-indigo-400 to-violet-600 p-[3px] shadow-md transition-transform duration-500 ease-out group-hover:scale-105">
                          <div className="h-24 w-24 overflow-hidden rounded-full border-[3px] border-white bg-indigo-50 sm:h-28 sm:w-28">
                            {member.image ? (
                              <img
                                src={teamPhotoUrl(member.image)}
                                alt={member.fullName || "Team member"}
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-(--primary) to-indigo-700 text-2xl font-bold text-white sm:text-3xl">
                                {(member.fullName || "?").charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <h3 className="relative text-lg font-bold text-(--text) transition-colors duration-300 group-hover:text-indigo-950 sm:text-xl">
                        {member.fullName}
                      </h3>
                      <p className="relative mb-2 inline-block max-w-full rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-indigo-700 transition-all duration-300 group-hover:bg-indigo-100 sm:mb-3 sm:text-xs">
                        {member.designation}
                      </p>
                      {member.bio ? (
                        <p className="relative text-(--secondary) flex-1 text-xs leading-relaxed line-clamp-4 transition-colors duration-300 group-hover:text-gray-600 sm:text-sm">
                          {member.bio}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>

              {maxTeamIndex > 0 && (
                <button
                  type="button"
                  onClick={handleTeamNext}
                  className="our-team-nav-btn absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg shadow-indigo-200/50 ring-1 ring-indigo-100 transition duration-300 hover:scale-110 hover:bg-indigo-600 hover:text-white hover:shadow-indigo-300/40 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                  aria-label="Next team members"
                >
                  <FaChevronRight className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>

            {maxTeamIndex > 0 && (
              <>
                <div className="mt-5 flex justify-center gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={handleTeamPrev}
                    className="our-team-nav-btn inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600 shadow-md ring-1 ring-indigo-100 transition hover:bg-indigo-600 hover:text-white"
                    aria-label="Previous team members"
                  >
                    <FaChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleTeamNext}
                    className="our-team-nav-btn inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600 shadow-md ring-1 ring-indigo-100 transition hover:bg-indigo-600 hover:text-white"
                    aria-label="Next team members"
                  >
                    <FaChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-wrap justify-center gap-2 px-2">
                    {Array.from({ length: maxTeamIndex + 1 }).map((_, index) => (
                      <button
                        key={`team-slide-${index}`}
                        type="button"
                        onClick={() => setTeamIndex(index)}
                        className={`our-team-dot h-2 rounded-full transition-all duration-500 ${
                          teamIndex === index
                            ? "w-10 bg-linear-to-r from-indigo-600 to-violet-600"
                            : "w-2 bg-gray-300 hover:bg-indigo-300 hover:w-4"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={teamIndex === index ? true : undefined}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTeamSection;
