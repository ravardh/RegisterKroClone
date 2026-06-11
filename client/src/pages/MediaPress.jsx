import React from "react";
import { Link } from "react-router-dom";
import SEOHelmet from "../components/SEOHelmet";
import commonData from "../assets/common.json";

const MediaPress = () => {
  const mediaSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Media and Press",
    description:
      "Media and press information for TaxProSolution, including company overview, service focus, and press contact.",
  };

  return (
    <>
      <SEOHelmet
        title="Media & Press - TaxProSolution"
        description="Find TaxProSolution media information, company overview, service focus, and press contact details."
        keywords="media, press, TaxProSolution, company information, press contact"
        canonicalUrl="https://taxprosolution.co.in/media-press"
        structuredData={mediaSchema}
      />
      <div className="bg-gray-50 -mt-20 pt-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Media & Press
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Information for media partners, business communities, event
              organizers, and collaborators who want to know more about{" "}
              {commonData.companyName}.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Company Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {commonData.companyName} helps individuals, startups, small
                businesses, professionals, and organizations handle business
                registration, tax filing, GST, accounting, payroll, trademark,
                and compliance needs with a clear service process and expert
                support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Focus Areas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Business setup and company registration",
                  "GST registration and returns",
                  "Income tax filing and advisory support",
                  "Trademark and IPR assistance",
                  "Accounting, payroll, and compliance workflows",
                  "Application tracking and client communication",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Media Queries
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For interviews, quotes, webinar collaborations, event
                participation, brand assets, or company information, please
                contact our team. We are happy to support meaningful business,
                compliance, and startup awareness initiatives.
              </p>
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> {commonData.emails.support}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Phone:</strong> {commonData.phones.primary}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Office:</strong> {commonData.address.line1},{" "}
                  {commonData.address.city}, {commonData.address.state}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Need Service Information?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For client service inquiries, please visit our{" "}
                <Link to="/services" className="text-(--primary) hover:underline">
                  Services
                </Link>{" "}
                page or{" "}
                <Link to="/contact" className="text-(--primary) hover:underline">
                  Contact Us
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

export default MediaPress;
