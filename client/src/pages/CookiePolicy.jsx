import React from "react";
import { Link } from "react-router-dom";
import SEOHelmet from "../components/SEOHelmet";
import commonData from "../assets/common.json";

const CookiePolicy = () => {
  const cookieSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cookie Policy",
    description:
      "Cookie Policy for Tax Pro Solution - how cookies support service forms, analytics, and website performance.",
  };

  return (
    <>
      <SEOHelmet
        title="Cookie Policy - Tax Pro Solution"
        description="Learn how Tax Pro Solution uses cookies and similar technologies to improve website performance, service forms, analytics, and user experience."
        keywords="cookie policy, website cookies, analytics, user preferences"
        canonicalUrl="https://taxprosolution.co.in/cookie-policy"
        structuredData={cookieSchema}
      />
      <div className="bg-gray-50 -mt-20 pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cookie Policy
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
                What Cookies Are
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small files stored on your device when you visit a
                website. At {commonData.companyName}, cookies help our website
                remember basic preferences, keep service forms working smoothly,
                understand page performance, and improve your experience while
                exploring registration, tax, GST, trademark, and compliance
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Use Cookies
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Essential cookies:</strong> Support core website
                  functions such as navigation, forms, dashboard sessions, and
                  basic security checks.
                </li>
                <li>
                  <strong>Preference cookies:</strong> Help remember simple
                  choices such as form progress or interface preferences where
                  applicable.
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Help us understand which
                  services and pages are most useful so we can improve content
                  and customer support.
                </li>
                <li>
                  <strong>Communication cookies:</strong> May support contact,
                  lead, WhatsApp, or callback flows when you request assistance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Third-Party Tools
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Some cookies or similar technologies may be placed by trusted
                tools used for hosting, analytics, maps, email delivery,
                security, payment support, or customer communication. These
                tools are used only to operate and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Managing Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You can disable or delete cookies through your browser settings.
                Please note that blocking essential cookies may affect forms,
                login, application tracking, or other service-related features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about this Cookie Policy, contact us at{" "}
                <a
                  href={`mailto:${commonData.emails.support}`}
                  className="text-(--primary) hover:underline"
                >
                  {commonData.emails.support}
                </a>{" "}
                or visit our{" "}
                <Link to="/contact" className="text-(--primary) hover:underline">
                  Contact Page
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

export default CookiePolicy;
