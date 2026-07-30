import React from "react";
import { Link } from "react-router-dom";
import SEOHelmet from "../components/SEOHelmet";
import commonData from "../assets/common.json";

const Refund = () => {
  const refundSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Refund Policy",
    description:
      "Tax Pro Solution Refund Policy - How refunds are handled for our business services",
  };

  return (
    <>
      <SEOHelmet
        title="Refund Policy - Tax Pro Solution"
        description="Read Tax Pro Solution's refund policy to understand eligibility, timelines, and how refund requests are processed."
        keywords="refund policy, cancellation, refund eligibility, payment refund"
        canonicalUrl="https://taxprosolution.co.in/refund"
        structuredData={refundSchema}
      />
      <div className="bg-gray-50 -mt-20 pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Refund Policy
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
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At {commonData.companyName}, we strive to deliver professional
                registration, tax, and compliance services with transparency.
                This Refund Policy explains when refunds may be issued, how
                requests are reviewed, and what to expect after you submit a
                request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                General Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Fees paid for government filings, third-party charges, and work
                already completed are generally non-refundable. Refunds, when
                approved, apply only to the unused portion of our professional
                service fee and exclude statutory or third-party costs already
                incurred on your behalf.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  Service-specific refund terms may be stated in your proposal,
                  invoice, or service agreement.
                </li>
                <li>
                  If we are unable to initiate your service due to an error on
                  our side, we will offer a full refund of the professional fee
                  or re-process the service at no extra cost.
                </li>
                <li>
                  Delays caused by incomplete documents, government processing,
                  or client-side inaction are not grounds for automatic refunds.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Eligibility for a Refund
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may request a refund review if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  You cancel before we begin substantive work on your application.
                </li>
                <li>
                  We decline or cannot accept your engagement after payment.
                </li>
                <li>
                  A duplicate payment was made by mistake.
                </li>
                <li>
                  Our team confirms that the service was not delivered as agreed
                  under your written scope of work.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Non-Refundable Items
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Government fees, stamp duty, and statutory charges</li>
                <li>Third-party verification, DSC, or filing fees</li>
                <li>Services already filed, submitted, or completed</li>
                <li>Consultation or document review already performed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How to Request a Refund
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Email us at{" "}
                <a
                  href={`mailto:${commonData.emails.support}`}
                  className="text-(--primary) hover:underline"
                >
                  {commonData.emails.support}
                </a>{" "}
                or use our{" "}
                <Link to="/contact" className="text-(--primary) hover:underline">
                  contact form
                </Link>{" "}
                with your registered name, phone number, service ID (if
                available), payment reference, and reason for the request. We
                aim to acknowledge requests within 2 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Processing Time
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Approved refunds are typically processed within 7–14 business
                days to the original payment method. Bank or payment-gateway
                timelines may add additional days before funds appear in your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Related Policies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Please also review our{" "}
                <Link to="/terms" className="text-(--primary) hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-(--primary) hover:underline">
                  Privacy Policy
                </Link>
                . For service status updates, visit{" "}
                <Link
                  to="/trackStatus"
                  className="text-(--primary) hover:underline"
                >
                  Track Application
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Questions about this policy? Reach our support team at{" "}
                <a
                  href={`tel:${commonData.phones.primary.replace(/\s/g, "")}`}
                  className="text-(--primary) hover:underline"
                >
                  {commonData.phones.primary}
                </a>{" "}
                or {commonData.emails.support}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Refund;
