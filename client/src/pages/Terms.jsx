import React from "react";
import { Link } from "react-router-dom";
import SEOHelmet from "../components/SEOHelmet";
import commonData from "../assets/common.json";

const Terms = () => {
  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms and Conditions",
    description:
      "TaxProSolution Terms and Conditions - Our service terms and user obligations",
  };

  return (
    <>
      <SEOHelmet
        title="Terms & Conditions - TaxProSolution"
        description="Read our Terms and Conditions to understand your rights and obligations when using TaxProSolution's services."
        keywords="terms, conditions, terms of service, legal terms"
        canonicalUrl="https://taxprosolution.co.in/terms"
        structuredData={termsSchema}
      />
      <div className="bg-gray-50 -mt-20 pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms & Conditions
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
                1. Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using our website and services, you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service. These Terms and Conditions constitute a legally
                binding agreement between you and our company regarding your use
                of the website and services.
              </p>
            </section>

            {/* Use of Services */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Use of Services
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Eligibility
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    You must be at least 18 years of age to use our services. By
                    using our services, you represent and warrant that you have
                    the right, authority, and capacity to enter into this
                    agreement and to abide by all of the terms and conditions
                    set forth herein.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Account Registration
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    To access certain features of our services, you may be
                    required to register for an account. When you register, you
                    agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>
                      Maintain and promptly update your account information
                    </li>
                    <li>Maintain the security of your password and account</li>
                    <li>
                      Accept all responsibility for activities that occur under
                      your account
                    </li>
                    <li>
                      Notify us immediately of any unauthorized use of your
                      account
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Prohibited Activities
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    You may not access or use the services for any purpose other
                    than that for which we make the services available.
                    Prohibited activities include, but are not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Violating any applicable laws or regulations</li>
                    <li>Infringing on intellectual property rights</li>
                    <li>Transmitting any harmful or malicious code</li>
                    <li>Attempting to bypass security features</li>
                    <li>Interfering with or disrupting the services</li>
                    <li>Engaging in fraudulent activities</li>
                    <li>Harassing, abusing, or harming other users</li>
                    <li>
                      Using automated systems to access the services without
                      permission
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Services and Fees */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Services and Fees
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Service Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We provide business registration, compliance, tax filing,
                    GST registration, trademark registration, and related
                    professional services. The specific terms of each service
                    will be outlined in the service agreement or quotation
                    provided to you.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Fees and Payment
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Service fees will be communicated to you before you engage
                    our services. Payment terms, including any advance payments
                    or installments, will be specified in your service
                    agreement. All fees are non-refundable unless otherwise
                    stated or required by law. You are responsible for paying
                    all applicable taxes in connection with the services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Service Modifications
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify or discontinue, temporarily
                    or permanently, the services (or any part thereof) with or
                    without notice. Prices for our services are subject to
                    change without notice. We shall not be liable to you or any
                    third party for any modification, price change, suspension,
                    or discontinuance of the services.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Intellectual Property Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                The website and services, including all content, features, and
                functionality, are owned by us and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws. You are granted a limited,
                non-exclusive, non-transferable license to access and use the
                services for your personal or business use.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, modify, create derivative
                works of, publicly display, publicly perform, republish,
                download, store, or transmit any of the material on our website
                without our prior written consent.
              </p>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. User Content and Submissions
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                When you submit documents, information, or other content to us
                in connection with our services, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  You own or have the necessary rights to submit the content
                </li>
                <li>The content is accurate and not misleading</li>
                <li>The content does not violate any third-party rights</li>
                <li>The content does not contain any illegal material</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                By submitting content, you grant us a license to use, process,
                and store the content as necessary to provide our services to
                you.
              </p>
            </section>

            {/* Privacy and Data Protection */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your use of our services is also governed by our Privacy Policy.
                Please review our{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your personal
                information.
              </p>
            </section>

            {/* Disclaimers and Limitations */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Disclaimers and Limitations of Liability
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Service Disclaimer
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our services are provided on an "as is" and "as available"
                    basis. We make no warranties, expressed or implied,
                    regarding the services, including but not limited to
                    warranties of merchantability, fitness for a particular
                    purpose, or non-infringement. While we strive to provide
                    accurate and timely services, we do not guarantee that the
                    services will be uninterrupted, timely, secure, or
                    error-free.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Professional Advice
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The information provided through our services is for general
                    informational purposes and should not be considered as
                    legal, financial, or professional advice. You should consult
                    with appropriate professionals for advice specific to your
                    situation.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Limitation of Liability
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To the fullest extent permitted by law, we shall not be
                    liable for any indirect, incidental, special, consequential,
                    or punitive damages, or any loss of profits or revenues,
                    whether incurred directly or indirectly, or any loss of
                    data, use, goodwill, or other intangible losses resulting
                    from your use of the services.
                  </p>
                </div>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless our company,
                its officers, directors, employees, agents, and affiliates from
                and against any claims, liabilities, damages, losses, and
                expenses, including reasonable legal fees, arising out of or in
                any way connected with your access to or use of the services,
                your violation of these Terms, or your violation of any
                third-party rights.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Termination
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and access to the
                services immediately, without prior notice or liability, for any
                reason, including if you breach these Terms. Upon termination,
                your right to use the services will immediately cease. All
                provisions of the Terms which by their nature should survive
                termination shall survive, including ownership provisions,
                warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Governing Law and Dispute Resolution
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                These Terms shall be governed by and construed in accordance
                with the laws of India, without regard to its conflict of law
                provisions. Any disputes arising from or relating to these Terms
                or the services shall be resolved through:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>First, good faith negotiations between the parties</li>
                <li>
                  If negotiations fail, through binding arbitration in
                  accordance with the Arbitration and Conciliation Act, 1996
                </li>
                <li>
                  The arbitration shall be conducted in English and held in the
                  designated city
                </li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify or replace these Terms at any
                time at our sole discretion. We will provide notice of any
                material changes by posting the new Terms on this page and
                updating the "Last updated" date. Your continued use of the
                services after any such changes constitutes your acceptance of
                the new Terms.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Severability and Waiver
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or
                invalid, that provision will be limited or eliminated to the
                minimum extent necessary so that the Terms will otherwise remain
                in full force and effect. Our failure to enforce any right or
                provision of these Terms will not be considered a waiver of
                those rights.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                If you have any questions about these Terms and Conditions,
                please contact us:
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

export default Terms;
