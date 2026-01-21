import React from "react";
import { Link } from "react-router-dom";
import SEOHelmet from "../components/SEOHelmet";
import commonData from "../assets/common.json";

const Privacy = () => {
  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
      "TaxProSolution Privacy Policy - How we protect your personal information",
  };

  return (
    <>
      <SEOHelmet
        title="Privacy Policy - TaxProSolution"
        description="Read TaxProSolution's privacy policy to understand how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, personal information, privacy"
        canonicalUrl="https://taxprosolution.co.in/privacy"
        structuredData={privacySchema}
      />
      <div className="bg-gray-50 -mt-20 pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
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

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to our Privacy Policy. Your privacy is critically
                important to us. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you visit our
                website and use our services. Please read this privacy policy
                carefully. If you do not agree with the terms of this privacy
                policy, please do not access the site.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Personal Information
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    We may collect personal information that you voluntarily
                    provide to us when you:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Register for an account</li>
                    <li>Submit application forms for our services</li>
                    <li>Contact us through our contact form</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Provide feedback or reviews</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    This information may include your name, email address, phone
                    number, company details, and other information relevant to
                    the services you request.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Automatically Collected Information
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you visit our website, we may automatically collect
                    certain information about your device, including information
                    about your web browser, IP address, time zone, and some of
                    the cookies that are installed on your device. Additionally,
                    we may collect information about the individual web pages
                    you view, what websites or search terms referred you to the
                    site, and information about how you interact with the site.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We use the information we collect in various ways, including to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Provide, operate, and maintain our services</li>
                <li>Process your applications and service requests</li>
                <li>
                  Communicate with you about your applications and our services
                </li>
                <li>
                  Send you updates, newsletters, and promotional materials (with
                  your consent)
                </li>
                <li>Improve, personalize, and expand our services</li>
                <li>Understand and analyze how you use our website</li>
                <li>
                  Develop new products, services, features, and functionality
                </li>
                <li>Comply with legal obligations and resolve disputes</li>
                <li>
                  Prevent fraudulent transactions and protect against criminal
                  activity
                </li>
              </ul>
            </section>

            {/* Sharing Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Sharing Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  <strong>Service Providers:</strong> We may share your
                  information with third-party service providers who perform
                  services on our behalf, such as payment processing, data
                  analysis, email delivery, and hosting services.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your
                  information if required to do so by law or in response to
                  valid requests by public authorities.
                </li>
                <li>
                  <strong>Business Transfers:</strong> We may share or transfer
                  your information in connection with, or during negotiations
                  of, any merger, sale of company assets, financing, or
                  acquisition of all or a portion of our business.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may disclose your
                  personal information for any other purpose with your consent.
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, please
                note that no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your personal
                information, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* Your Privacy Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Privacy Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete data</li>
                <li>Deletion of your personal information</li>
                <li>Objection to processing of your personal information</li>
                <li>Restriction of processing your personal information</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                To exercise these rights, please contact us using the contact
                information provided below.
              </p>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to track
                activity on our website and store certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent. However, if you do not accept cookies,
                you may not be able to use some portions of our service.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Third-Party Links
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices or the content of
                these third-party sites. We encourage you to review the privacy
                policies of any third-party sites you visit.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children under 18. If you are a parent or guardian and believe
                that your child has provided us with personal information,
                please contact us so that we can delete such information.
              </p>
            </section>

            {/* Changes to This Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
                Changes to this Privacy Policy are effective when they are
                posted on this page.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> {commonData.emails.support}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Phone:</strong> {commonData.phones.primary}
                </p>
                <p className="text-gray-700 mt-2">
                  Or visit our{" "}
                  <Link to="/contact" className="text-blue-600 hover:underline">
                    Contact Page
                  </Link>
                </p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
