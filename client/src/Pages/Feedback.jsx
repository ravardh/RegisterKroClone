import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "../config/api";
import CommonData from "../assets/common.json";

const serviceOptions = [
  "Company Registration",
  "GST Compliance & Filing",
  "Trademark & IP",
  "Accounting & Bookkeeping",
  "Startup Advisory",
  "Tax Planning",
];

const ratingDescriptions = {
  1: "Very dissatisfied",
  2: "Needs improvement",
  3: "Neutral",
  4: "Very satisfied",
  5: "Exceptional",
};

const ratingColorClasses = {
  1: "from-red-500/90 to-red-400/70",
  2: "from-orange-500/90 to-orange-400/70",
  3: "from-sky-500/90 to-sky-400/70",
  4: "from-cyan-500/90 to-emerald-400/70",
  5: "from-green-500/90 to-green-400/70",
};

const resetForm = () => ({
  fullName: "",
  email: "",
  serviceAvailed: "",
  message: "",
  starRating: 5,
});

const Feedback = () => {
  const [formData, setFormData] = useState(() => resetForm());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, starRating: rating }));
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value.trim());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (!formData.serviceAvailed) {
      toast.error("Select the service you used");
      return;
    }

    if (formData.message.trim().length < 20) {
      toast.error("Tell us more so we can improve (min 20 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/public/feedback", {
        fullName: formData.fullName,
        email: formData.email,
        serviceAvailed: formData.serviceAvailed,
        message: formData.message,
        starRating: formData.starRating,
      });
      toast.success("Thanks for the feedback! We will review it shortly.");
      setFormData(resetForm());
    } catch (error) {
      console.error("Feedback submission failed", error);
      toast.error(
        error.response?.data?.message || "Unable to send feedback right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const highlightBlocks = [
    {
      title: "Fast response",
      caption: "We acknowledge every feedback within 24 hours.",
    },
    {
      title: "Contextual follow-up",
      caption: "Our team references your service to deliver brighter outcomes.",
    },
    {
      title: "Continuous improvement",
      caption: "Your suggestions help us add new tools and services.",
    },
  ];

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-[url('hero.jpg')] bg-cover bg-center bg-fixed min-h-screen -mt-20">
        <div className="w-full px-4 md:px-8 lg:px-10 flex items-center min-h-screen py-30">
          <div className="w-full">
            <div className="max-w-7xl mx-auto">
              <div className="grid gap-8 lg:grid-cols-3 mb-8 lg:mb-12">
                <section className="lg:col-span-2 w-full">
                  <div className="bg-white/90 rounded-2xl shadow-2xl p-6 md:p-8 border border-black">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="text-center space-y-1">
                        <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-500">
                          Feedback hub
                        </p>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                          Share what happened
                        </h1>
                      </div>

                      <div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Your Full Name"
                          className="w-full border border-gray-500 rounded-3xl px-4 py-3 text-sm text-gray-700 focus:border-(--primary) focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full border border-gray-500 rounded-3xl px-4 py-3 text-sm text-gray-700 focus:border-(--primary) focus:outline-none"
                          />
                        </div>
                        <div>
                          <select
                            name="serviceAvailed"
                            value={formData.serviceAvailed}
                            onChange={handleChange}
                            className="w-full border border-gray-500 rounded-3xl px-4 py-3 text-sm text-gray-700 focus:border-(--primary) focus:outline-none"
                          >
                            <option value="">Service Availed</option>
                            {serviceOptions.map((service) => (
                              <option key={service} value={service}>
                                {service}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Describe what went well or what we could improve"
                          className="w-full border border-gray-500 rounded-3xl px-4 py-3 text-sm text-gray-700 focus:border-(--primary) focus:outline-none"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Rate your experience*
                        </p>
                        <div className="flex items-center gap-3">
                          {Array.from({ length: 5 }, (_, index) => index + 1).map(
                            (rating) => {
                              const isSelected = formData.starRating === rating;
                              return (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => handleRatingClick(rating)}
                                  aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                                  className={`w-11 h-11 flex items-center justify-center rounded-full transition duration-300 shadow-sm text-white group ${
                                    isSelected
                                      ? `bg-linear-to-br ${ratingColorClasses[rating]} shadow-[0_10px_30px_rgba(15,23,42,0.25)]`
                                      : "bg-white border border-slate-200 text-gray-500 hover:text-(--text)"
                                  }`}
                                >
                                  <FaStar className={`h-5 w-5 ${isSelected ? "text-white" : "text-gray-500"} group-hover:text-(--text)`} />
                                </button>
                              );
                            }
                          )}
                          <span className="text-sm text-gray-500">
                            {ratingDescriptions[formData.starRating]}
                          </span>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-(--primary) text-white rounded-3xl py-3 text-lg font-semibold shadow-lg shadow-(--primary)/40 transition-colors duration-200 hover:bg-(--primary-hover) disabled:opacity-70"
                        >
                          {isSubmitting ? "Sending feedback..." : "Post feedback"}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        We respect your privacy and never share your details without consent.
                      </p>
                    </form>
                  </div>
                </section>

              <section className="lg:col-span-1 text-center lg:text-left space-y-4 rounded-2xl p-6 md:p-8 w-full">
                  <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/80">
                    Customer voice
                  </p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                    Track your satisfaction journey
                  </h1>
                  <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                    Once the application is tracked, drop a quick note here so we can bring the same clarity to every team member.
                  </p>
                </section>
              </div>

              <section className="w-full mt-10 grid gap-6 md:grid-cols-3">
                {highlightBlocks.map((block) => (
                  <div
                    key={block.title}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
                  >
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                      {block.title}
                    </p>
                    <p className="text-base text-(--text) mt-2">
                      {block.caption}
                    </p>
                  </div>
                ))}
              </section>

              <section className="mt-8">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-2 text-sm text-gray-600 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
                  <p className="text-(--text) text-base font-semibold">
                    Visit {CommonData.companyName}
                  </p>
                  <p>
                    {CommonData.address.line1}, {CommonData.address.city}, {CommonData.address.state} {CommonData.address.postalCode}, {CommonData.address.country}
                  </p>
                  <p>Phone: {CommonData.phones.primary}</p>
                  <p>Email: {CommonData.emails.support}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;