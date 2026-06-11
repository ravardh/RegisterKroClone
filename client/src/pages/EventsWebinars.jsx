import React from "react";
import { Link } from "react-router-dom";
import SEOHelmet from "../components/SEOHelmet";
import commonData from "../assets/common.json";

const upcomingTopics = [
  "Company registration essentials for first-time founders",
  "GST registration, filing discipline, and common mistakes",
  "Income tax return readiness for professionals and small businesses",
  "Trademark basics: protecting your brand before you scale",
];

const EventsWebinars = () => {
  const eventsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Events and Webinars",
    description:
      "Events and webinars by TaxProSolution for business registration, tax filing, GST, compliance, and trademark awareness.",
  };

  return (
    <>
      <SEOHelmet
        title="Events & Webinar - TaxProSolution"
        description="Join TaxProSolution events and webinars on business setup, GST, tax filing, compliance, accounting, and trademark protection."
        keywords="events, webinars, tax webinar, GST webinar, business registration event"
        canonicalUrl="https://taxprosolution.co.in/events-webinars"
        structuredData={eventsSchema}
      />
      <div className="bg-gray-50 -mt-20 pt-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Events & Webinar
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Practical sessions for founders, professionals, NGOs, and growing
              businesses who want to understand registrations, taxation,
              compliance, and documentation with less confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <section className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 sm:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What We Cover
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                Our sessions are designed to be simple, actionable, and useful
                for people who need clarity before starting a service. We focus
                on real workflows: documents required, timelines, common
                objections, compliance risks, and when to speak with an expert.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingTopics.map((topic) => (
                  <div
                    key={topic}
                    className="rounded-lg border border-blue-100 bg-blue-50/50 p-4"
                  >
                    <p className="font-semibold text-gray-900">{topic}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="bg-(--primary) text-white rounded-lg shadow-sm p-5 sm:p-8">
              <h2 className="text-2xl font-semibold mb-4">Get Notified</h2>
              <p className="text-white/90 leading-relaxed mb-5">
                Want updates about upcoming webinars or business awareness
                sessions? Contact our team and we will share the next schedule.
              </p>
              <Link
                to="/contact"
                className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-(--primary) hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </Link>
            </aside>
          </div>

          <section className="bg-white rounded-lg shadow-sm p-5 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Who Should Attend
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Startup founders planning company or LLP registration</li>
              <li>Small business owners managing GST, tax, and compliance</li>
              <li>Professionals and freelancers filing income tax returns</li>
              <li>NGOs, trusts, and institutions seeking compliance clarity</li>
              <li>Brands planning trademark registration or renewal</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-5">
              For event collaborations, college sessions, business community
              talks, or webinar invitations, write to {commonData.emails.support}
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default EventsWebinars;
