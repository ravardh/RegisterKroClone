import React, { useState, useEffect } from "react";
import { IoMdStar } from "react-icons/io";
import { useAppData } from "../../context/DataContext";

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const { reviews: reviewsData, isDataLoaded } = useAppData();

  useEffect(() => {
    if (isDataLoaded) {
      setReviews(reviewsData);
      setIsLoadingReviews(false);
    }
  }, [reviewsData, isDataLoaded]);

  const reviewBase = (() => {
    if (!reviews.length) return [];
    let base = [...reviews];
    while (base.length < 4) base = [...base, ...reviews];
    return base;
  })();
  const marqueeReviews = reviewBase.length ? [...reviewBase, ...reviewBase] : [];
  const marqueeDuration = Math.max(28, reviewBase.length * 6);

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-16">
      <div className="container relative mx-auto mb-9 px-6 sm:px-12 md:px-20 lg:px-25">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-(--primary)/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary)">
            Testimonials
          </span>
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
            What Our Clients Say
          </h2>
          <p className="text-base leading-relaxed text-(--secondary) sm:text-lg">
            Trusted by thousands of businesses across the country. Here's what they have to say.
          </p>
        </div>
      </div>

      {isLoadingReviews ? (
        <div className="py-12 text-center text-lg text-(--secondary)">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center text-lg text-(--secondary)">No reviews available yet.</div>
      ) : (
        <div className="testimonial-viewport w-7xl overflow-hidden py-4 mx-auto">
          <div
            className="testimonial-track"
            style={{ "--marquee-duration": `${marqueeDuration}s` }}
          >
            {marqueeReviews.map((review, index) => (
              <div
                key={`${review._id || review.fullName}-${index}`}
                className="mx-3 flex w-[300px] shrink-0 flex-col rounded-3xl border border-(--primary)/10 bg-linear-to-br from-[color-mix(in_srgb,var(--brand-pale)_35%,white)] to-white p-6 shadow-sm sm:w-[350px]"
              >
                <div className="mb-4 flex shrink-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-(--primary) to-(--accent) text-2xl font-bold text-white">
                    {review.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-(--brand-ink)">
                      {review.fullName}
                    </h3>
                    <p className="truncate text-sm text-(--secondary)">
                      {review.serviceAvailed?.serviceName || "Service"}
                    </p>
                  </div>
                </div>
                <div className="mb-3 flex shrink-0 gap-1">
                  {Array.from({ length: review.starRating }).map((_, i) => (
                    <IoMdStar key={i} className="text-xl text-amber-400" />
                  ))}
                </div>
                <p className="line-clamp-5 overflow-hidden text-base leading-relaxed text-(--secondary)">
                  "{review.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
