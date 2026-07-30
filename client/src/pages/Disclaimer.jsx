import React from "react";
import { Link } from "react-router-dom";
import SEOHelmet from "../components/SEOHelmet";
import commonData from "../assets/common.json";

const Disclaimer = () => {
  const disclaimerSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Disclaimer",
    description:
      "Disclaimer for Tax Pro Solutions - informational content, professional services, and client responsibilities.",
  };

  return (
    <>
      <SEOHelmet
        title="Disclaimer - Tax Pro Solutions"
        description="Read the Tax Pro Solutions disclaimer for website information, professional service limits, government processing, and client responsibilities."
        keywords="disclaimer, tax services disclaimer, compliance disclaimer"
        canonicalUrl="https://taxprosolution.co.in/disclaimer"
        structuredData={disclaimerSchema}
      />
      <div className="bg-gray-50 -mt-20 pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Disclaimer
            </h1>
            <p className="text-gray-600">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                General Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The content on this website is provided for general information
                about business registration, tax filing, GST, compliance,
                trademark, accounting, and related professional services. It
                should not be treated as a substitute for advice based on your
                specific facts, documents, business structure, or legal position.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Professional Assistance
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {commonData.companyName} provides assistance through experienced
                professionals and service teams. Final outcomes may depend on
                government portals, departmental review, document accuracy,
                statutory eligibility, timelines, and third-party systems beyond
                our direct control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Client Responsibility
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide complete, accurate, and current information.</li>
                <li>
                  Share valid documents and approvals required for the selected
                  service.
                </li>
                <li>
                  Review drafts, applications, and filings before final
                  submission where client confirmation is required.
                </li>
                <li>
                  Respond on time to queries raised by our team, government
                  departments, or third-party platforms.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No Guaranteed Government Approval
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We work to prepare and submit applications correctly, but we do
                not guarantee approval, registration, refund, license issuance,
                or processing time by any government authority. Decisions by
                departments, registrars, tax portals, banks, payment gateways,
                and other agencies are outside our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Website Accuracy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We aim to keep service descriptions and content updated.
                However, laws, fees, forms, portal rules, and compliance
                requirements may change. Please confirm current requirements
                with our team before relying on any information for a decision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Related Policies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Please also read our{" "}
                <Link to="/terms" className="text-(--primary) hover:underline">
                  Terms & Conditions
                </Link>
                ,{" "}
                <Link to="/privacy" className="text-(--primary) hover:underline">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link to="/refund" className="text-(--primary) hover:underline">
                  Refund Policy
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Disclaimer;
