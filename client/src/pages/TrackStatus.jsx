import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import axios from "../config/api";
import toast from "react-hot-toast";
import SEOHelmet from "../components/SEOHelmet";

const TrackStatus = () => {
  const trackStatusSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Track Application Status",
    "description": "Track the status of your business application with TaxProSolution"
  };
  const [serviceIdInput, setServiceIdInput] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stageOrder = [
    "new",
    "contacted",
    "proposal sent",
    "negotiation",
    "document collected",
    "Application done",
    "In Progress",
    "Completed",
  ];

  const stageIcons = {
    new: "📋",
    contacted: "📞",
    "proposal sent": "📧",
    negotiation: "💬",
    "document collected": "📄",
    "Application done": "✍️",
    "In Progress": "⚙️",
    Completed: "✅",
  };

  const stageLabels = {
    new: "Application Created",
    contacted: "Lead Contacted",
    "proposal sent": "Proposal Sent",
    negotiation: "Under Negotiation",
    "document collected": "Documents Collected",
    "Application done": "Application Done",
    "In Progress": "In Progress",
    Completed: "Completed",
  };

  const handleGetStatus = async (e) => {
    e.preventDefault();

    if (!serviceIdInput.trim()) {
      toast.error("Please enter a service ID");
      return;
    }

    setLoading(true);
    setError("");
    setTrackingData(null);

    try {
      const response = await axios.get(`/public/track/${serviceIdInput}`);
      setTrackingData(response.data.data);
      toast.success("Service information found!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Service not found. Please check the ID and try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStageIndex = () => {
    if (
      !trackingData ||
      !trackingData.stages ||
      trackingData.stages.length === 0
    ) {
      return 0;
    }
    const currentStage = trackingData.currentStage;
    return stageOrder.indexOf(currentStage) + 1;
  };

  return (
    <>
      <SEOHelmet
        title="Track Your Application Status - TaxProSolution"
        description="Track the real-time status of your business registration and service applications with TaxProSolution. Monitor progress at every step."
        keywords="track status, application tracking, progress monitoring, application status"
        canonicalUrl="https://taxprosolution.co.in/track-status"
        structuredData={trackStatusSchema}
      />
      <div className="bg-[url('/hero.webp')] bg-cover bg-center bg-fixed min-h-screen -mt-20">
      <div className="w-full px-4 md:px-8 lg:px-10 flex flex-col py-18">
        <div className="w-full grow">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-8 lg:mb-12">
              <section className="w-full max-w-md">
                <div className="bg-white/90 rounded-2xl shadow-2xl p-6 md:p-10 border border-black">
                  <form onSubmit={handleGetStatus} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Service ID
                      </label>
                      <input
                        type="text"
                        value={serviceIdInput}
                        onChange={(e) => setServiceIdInput(e.target.value)}
                        placeholder="e.g., 160326+9876543210+10001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-(--primary) hover:bg-(--primary-hover) disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base flex items-center justify-center gap-2"
                    >
                      {loading && <FaSpinner className="animate-spin" />}
                      {loading ? "Tracking..." : "Get Status"}
                    </button>
                  </form>
                </div>
              </section>

              <section className="text-center lg:text-left space-y-4 rounded-2xl p-6 md:p-8 w-full lg:w-auto">
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/80">
                  Live tracking
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                  Track your application
                </h1>
                <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                  Enter your Service ID to check the latest status of your
                  application instantly.
                </p>
              </section>
            </div>

            {error && !trackingData && (
              <section className="w-full mt-8">
                <div className="bg-red-50 rounded-2xl shadow-2xl p-6 md:p-10 border border-red-200">
                  <h2 className="text-xl md:text-2xl font-bold text-red-800 mb-4">
                    Not Found
                  </h2>
                  <p className="text-red-700">{error}</p>
                </div>
              </section>
            )}

            {trackingData && (
              <section className="w-full mt-8">
                <div className="bg-white/95 rounded-2xl shadow-2xl p-6 md:p-10 border border-white/30">
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                      Application Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Service ID</p>
                        <p className="text-base font-semibold text-gray-900">
                          {trackingData.serviceId || trackingData.leadId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Client Name</p>
                        <p className="text-base font-semibold text-gray-900">
                          {trackingData.clientName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-base font-semibold text-gray-900">
                          {trackingData.clientEmail}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-base font-semibold text-gray-900">
                          {trackingData.clientPhone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service</p>
                        <p className="text-base font-semibold text-gray-900">
                          {trackingData.interestedService}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">State</p>
                        <p className="text-base font-semibold text-gray-900">
                          {trackingData.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
                    Application Journey
                  </h2>

                  {/* Vertical Progress Path */}
                  <div className="relative max-w-2xl mx-auto">
                    {/* Background vertical line */}
                    <div className="absolute left-4.5 md:left-5.5 top-12 bottom-0 w-1 bg-linear-to-b from-gray-300 to-gray-200"></div>

                    {/* Progress filled line */}
                    <div
                      className="absolute left-4.5 md:left-5.5 top-12 w-1 bg-linear-to-b from-green-500 to-blue-500 transition-all duration-500"
                      style={{
                        height: `${(getCurrentStageIndex() / stageOrder.length) * 100}%`,
                        maxHeight: `calc(100% - 3rem)`,
                      }}
                    ></div>

                    {/* Milestones */}
                    <div className="space-y-6">
                      {stageOrder.map((stage, index) => {
                        const currentStageIndex = getCurrentStageIndex();
                        const isCompleted = index < currentStageIndex;
                        const isCurrent = index === currentStageIndex - 1;
                        const stageData = trackingData.stages.find(
                          (s) => s.stageName === stage,
                        );

                        return (
                          <div
                            key={stage}
                            className="flex gap-4 md:gap-6 items-start relative"
                          >
                            {/* Circle marker */}
                            <div className="relative shrink-0 z-20">
                              <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-md md:text-base font-bold transition-all duration-300 border-4 shadow-lg ${
                                  isCompleted
                                    ? "bg-green-500 text-white border-green-600 scale-110"
                                    : isCurrent
                                      ? "bg-blue-500 text-white border-blue-600 scale-105 ring-4 ring-blue-300 animate-pulse"
                                      : "bg-gray-200 text-gray-500 border-gray-300"
                                }`}
                              >
                                {isCompleted ? (
                                  <MdCheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                                ) : (
                                  stageIcons[stage] || "📌"
                                )}
                              </div>
                            </div>

                            {/* Stage content */}
                            <div className="flex-1 pt-2">
                              <div
                                className={`transition-all duration-300 ${isCurrent ? "bg-blue-50 border-l-4 border-blue-500 pl-4 py-3 rounded" : "pl-0"}`}
                              >
                                <h3
                                  className={`text-lg md:text-xl font-bold transition-colors ${
                                    isCompleted || isCurrent
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {stageLabels[stage]}
                                </h3>

                                {stageData && (
                                  <div className="mt-2 space-y-1">
                                    <p className="text-xs md:text-sm text-gray-600">
                                      <span className="font-semibold">
                                        Completed on:
                                      </span>{" "}
                                      {new Date(
                                        stageData.updatedAt,
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                    <p className="text-xs md:text-sm text-gray-600">
                                      <span className="font-semibold">
                                        Time:
                                      </span>{" "}
                                      {new Date(
                                        stageData.updatedAt,
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      })}
                                    </p>
                                    <p className="text-xs md:text-sm text-gray-600">
                                      <span className="font-semibold">
                                        Updated by:
                                      </span>{" "}
                                      {stageData.updatedby}
                                    </p>
                                  </div>
                                )}

                                {isCurrent && !stageData && (
                                  <p className="text-sm text-blue-600 font-semibold mt-2 animate-bounce">
                                    ⏳ Currently in this stage
                                  </p>
                                )}

                                {!isCompleted && !isCurrent && (
                                  <p className="text-sm text-gray-400 mt-2">
                                    ⏳ Pending
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center">
                          <MdCheckCircle className="text-white text-sm" />
                        </div>
                        <span className="text-sm text-gray-700">Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-blue-600 animate-pulse"></div>
                        <span className="text-sm text-gray-700">
                          Current Stage
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300"></div>
                        <span className="text-sm text-gray-700">Pending</span>
                      </div>
                    </div>
                  </div>

                  {trackingData.stages && trackingData.stages.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Complete Journey Timeline
                      </h3>
                      <div className="space-y-3">
                        {trackingData.stages.map((stage, index) => (
                          <div
                            key={index}
                            className="flex gap-4 p-4 bg-linear-to-r from-green-50 to-white rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                          >
                            <div className="text-2xl">
                              {stageIcons[stage.stageName] || "📌"}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <p className="font-semibold text-gray-800 capitalize">
                                  {stageLabels[stage.stageName]}
                                </p>
                                <p className="text-xs md:text-sm text-gray-600">
                                  {new Date(stage.updatedAt).toLocaleString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-semibold">
                                  Updated by:
                                </span>{" "}
                                {stage.updatedby}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="mt-10">
              <div className="bg-white/90 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Observed a gap?
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                  Let us know how the journey went
                </h3>
                <p className="text-gray-600 mt-2 md:mt-3 max-w-2xl">
                  Share a quick note about what we got right or where we can
                  improve. A short send-off helps the team keep every service
                  consistent.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to="/feedback"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-(--primary) text-white font-semibold shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-(--primary-hover)"
                  >
                    Post feedback
                  </Link>
                  <span className="text-sm text-gray-500">
                    Feedback is anonymous unless you choose to share contact
                    info.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TrackStatus;
