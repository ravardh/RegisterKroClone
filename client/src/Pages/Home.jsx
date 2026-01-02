import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Step1 from "../assets/comp1.svg";
import Step2 from "../assets/comp2.svg";
import Step3 from "../assets/comp3.svg";
import Step4 from "../assets/comp4.svg";

const Home = () => {
  const services = [
    {
      title: "Company Registration",
      description:
        "Register your business quickly and easily with our expert assistance.",
    },
    {
      title: "Tax Filing",
      description:
        "Ensure compliance with our hassle-free tax filing services.",
    },
    {
      title: "Business Consultation",
      description: "Get expert advice to help your business grow and succeed.",
    },
    {
      title: "Trademark Registration",
      description:
        "Protect your brand with our comprehensive trademark services.",
    },
    {
      title: "GST Registration",
      description: "Simplified GST registration and compliance management.",
    },
    {
      title: "Legal Documentation",
      description:
        "Professional legal documentation services for your business.",
    },
    {
      title: "Annual Compliance",
      description:
        "Stay compliant with annual filing and regulatory requirements.",
    },
    {
      title: "Accounting Services",
      description:
        "Expert accounting and bookkeeping solutions for your business.",
    },
    {
      title: "License & Permits",
      description:
        "Obtain all necessary licenses and permits for your business.",
    },
  ];

  const reviews = [
    {
      name: "Rajesh Kumar",
      company: "Tech Solutions Pvt Ltd",
      rating: 5,
      text: "Exceptional service! They handled our company registration seamlessly. The team was professional, responsive, and made the entire process stress-free. Highly recommended!",
      image: ""
    },
    {
      name: "Priya Sharma",
      company: "Creative Designs Studio",
      rating: 5,
      text: "Amazing experience with their tax filing services. The experts were knowledgeable and guided us through every step. Our business is now fully compliant thanks to them!",
      image: ""
    },
    {
      name: "Amit Patel",
      company: "Global Traders Inc",
      rating: 5,
      text: "Outstanding support for GST registration and compliance. The relationship manager assigned to us was incredibly helpful and always available to answer our questions.",
      image: ""
    },
    {
      name: "Sneha Reddy",
      company: "Fashion Boutique",
      rating: 5,
      text: "I was worried about the trademark registration process, but they made it so simple. Great communication, timely updates, and professional service throughout.",
      image: ""
    },
    {
      name: "Vikram Singh",
      company: "Manufacturing Hub",
      rating: 5,
      text: "Best decision we made was choosing them for our business setup. From documentation to final approval, everything was handled efficiently. Five-star service!",
      image: ""
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const servicesPerPage = 3;
  const maxIndex = Math.ceil(services.length / servicesPerPage) - 1;

  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewsPerPage = 3;
  const maxReviewIndex = Math.ceil(reviews.length / reviewsPerPage) - 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [maxReviewIndex]);

  const handleReviewNext = () => {
    setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
  };

  const handleReviewPrev = () => {
    setReviewIndex((prev) => (prev <= 0 ? maxReviewIndex : prev - 1));
  };

  const visibleReviews = reviews.slice(
    reviewIndex * reviewsPerPage,
    (reviewIndex + 1) * reviewsPerPage
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const visibleServices = services.slice(
    currentIndex * servicesPerPage,
    (currentIndex + 1) * servicesPerPage
  );

  return (
    <>
      <section className="hero-section flex flex-col items-center justify-center h-screen bg-[url('/hero.jpg')] opacity-90 bg-cover bg-center">
        <div className="hero-content text-white px-50 py-10 text-center">
          <h1 className="text-6xl font-semibold mb-4">
            Get Your Business Registered in 7 Days
          </h1>
          <p className="text-2xl mb-8">
            Fast, reliable, and tailored online business solutions with free
            expert consultation.
          </p>
          <button className="bg-(--primary) text-white px-6 py-3 rounded-2xl hover:bg-(--primary-hover) transition">
            Get Started
          </button>
        </div>
      </section>

      <section className="services">
        <div className="services-section py-20 bg-(--background)">
          <h2 className="text-(--primary) text-4xl font-bold text-center mb-2">
            Our Services
          </h2>
          <p className="text-(--secondary) text-xl text-center mb-12 w-1/2 mx-auto">
            One platform for legal consultation, business setup, compliance, and
            startup solutions built for businesses of every industry.
          </p>
          <div className="relative mx-25">
            <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
              {visibleServices.map((service, index) => (
                <div
                  key={index}
                  className="service-card bg-white p-6 rounded-2xl shadow-md text-center"
                >
                  <h3 className="text-(--text) text-2xl font-semibold mb-4">
                    {service.title}
                  </h3>
                  <p className="text-(--secondary)">{service.description}</p>
                  <Link
                    to="/services"
                    className="mt-4 flex text-(--primary) hover:text-(--primary-hover) font-medium"
                  >
                    Learn More <FaArrowRightLong className="pt-2 w-6 h-5"/>
                  </Link>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className=" text-(--primary) hover:text-(--primary-hover) transition"
                aria-label="Previous services"
              >
                <FaChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      currentIndex === index ? "bg-(--primary)" : "bg-gray-300"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="text-(--primary) hover:text-(--primary-hover) transition"
                aria-label="Next services"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section py-20 bg-[url('/process-bg.jpg')] bg-cover bg-center">
        <div className="container mx-auto px-50">
          <h2 className="text-(--primary) text-4xl font-bold text-center mb-4">
            Grow Your Business in Just a Few Clicks
          </h2>
          <p className="text-(--secondary) text-xl text-center mb-16 w-2/3 mx-auto">
            Simple, guided, and fully online—from application to completion, we handle everything for you.
          </p>

          <div className="flex items-center gap-5 mb-20">
            <div className="w-1/2">
              <img src={Step1} alt="Choose a Service" className="rounded-2xl shadow-lg w-100 h-auto" />
            </div>
            <div className="w-1/2">
              <div className="grid items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-16 h-16 text-2xl font-medium text-white bg-(--primary) rounded-full">1</span>
                <h3 className="text-3xl font-semibold text-(--text)">
                  Choose a Service & Submit Your Application
                </h3>
              </div>
              <ul className="space-y-3 text-lg text-(--secondary) mb-6">
                <li>• Select the service you need from our platform</li>
                <li>• Fill in a quick and simple application form</li>
                <li>• Share only essential details—no complexity</li>
                <li>• Your information stays safe, secure, and private</li>
              </ul>
              <button className="inline-flex border-2 border-(--primary) py-2 px-4 rounded-2xl items-center gap-2 text-(--primary) hover:bg-(--primary-hover) hover:text-white font-semibold text-lg">
                Start Application <FaArrowRightLong />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-12 mb-20">
            <div className="w-1/2">
              <div className="grid items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-(--primary) text-white text-2xl font-medium">2</span>
                <h3 className="text-3xl font-semibold text-(--text)">
                  Lead Generation & Manager Assignment
                </h3>
              </div>
              <ul className="space-y-3 text-lg text-(--secondary) mb-6">
                <li>• Your application instantly creates a lead in our system</li>
                <li>• An experienced Relationship Manager (RM) is assigned to you</li>
                <li>• Your RM becomes your single point of contact</li>
              </ul>
              <button className="inline-flex border-2 border-(--primary) py-2 px-4 rounded-2xl items-center gap-2 text-(--primary) hover:bg-(--primary-hover) hover:text-white font-semibold text-lg">
                Proceed <FaArrowRightLong />
              </button>
            </div>
            <div className="w-1/2">
              <img src={Step2} alt="Lead Generation" className="rounded-2xl shadow-lg w-100 h-auto" />
            </div>
          </div>

          <div className="flex items-center gap-12 mb-20">
            <div className="w-1/2">
              <img src={Step3} alt="Document Collection" className="rounded-2xl shadow-lg w-100 h-auto" />
            </div>
            <div className="w-1/2">
              <div className="grid items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-(--primary) text-white text-2xl font-medium">3</span>
                <h3 className="text-3xl font-semibold text-(--text)">
                  Document Collection & Expert Handling
                </h3>
              </div>
              <ul className="space-y-3 text-lg text-(--secondary) mb-6">
                <li>• Your RM contacts you personally</li>
                <li>• Required documents are collected and verified</li>
                <li>• Experts take care of filings, compliance, and processing</li>
              </ul>
              <button className="inline-flex border-2 border-(--primary) py-2 px-4 rounded-2xl items-center gap-2 text-(--primary) hover:bg-(--primary-hover) hover:text-white font-semibold text-lg">
                Continue <FaArrowRightLong />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <div className="w-1/2">
              <div className="grid items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-(--primary) text-white text-2xl font-medium">4</span>
                <h3 className="text-3xl font-semibold text-(--text)">
                  Track Progress & Get Confirmation
                </h3>
              </div>
              <ul className="space-y-3 text-lg text-(--secondary) mb-6">
                <li>• Lead status is updated at every stage</li>
                <li>• Track your application anytime via our tracking dashboard</li>
                <li>• Receive confirmations, updates, and documents on email</li>
                <li>• Get expert support whenever you need it</li>
              </ul>
              <button className="inline-flex border-2 border-(--primary) py-2 px-4 rounded-2xl items-center gap-2 text-(--primary) hover:bg-(--primary-hover) hover:text-white font-semibold text-lg">
                Track Application <FaArrowRightLong />
              </button>
            </div>
            <div className="w-1/2">
              <img src={Step4} alt="Track Progress" className="rounded-2xl shadow-lg w-100 h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section m-20 py-8 bg-[url('/hero.jpg')] rounded-2xl opacity-90 bg-cover bg-center">
        <div className="container flex items-center justify-between mx-auto px-25 gap-2">
          <div className="flex-1">
            <h2 className="text-white text-2xl font-bold mb-3">
              Have Questions? Speak with Our Experts
            </h2>
            <p className="text-white text-lg">
              Get tailored advice on business registration, legal requirements, and compliance from our seasoned professional available to assist you anytime.
            </p>
          </div>
          <div className="ml-8">
            <button className="bg-(--primary) text-white px-8 py-4 rounded-2xl text-lg font-medium hover:bg-(--primary-hover) transition whitespace-nowrap">
              Call Us Now
            </button>
          </div>
        </div>
      </section>

      <section className="reviews-section py-20 bg-(--background)">
        <div className="container mx-auto px-25">
          <h2 className="text-(--primary) text-4xl font-bold text-center mb-4">
            What Our Clients Say
          </h2>
          <p className="text-(--secondary) text-xl text-center mb-12 w-2/3 mx-auto">
            Trusted by thousands of businesses across the country. Here's what they have to say about our services.
          </p>

          <div className="relative mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
              {visibleReviews.map((review, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      {review.image ? (
                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-(--primary) text-white text-2xl font-semibold">
                          {review.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-(--text)">{review.name}</h3>
                      <p className="text-(--secondary) text-sm">{review.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-(--secondary) text-base leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handleReviewPrev}
                className="text-(--primary) hover:text-(--primary-hover) transition"
                aria-label="Previous reviews"
              >
                <FaChevronLeft size={24} />
              </button>

              <div className="flex gap-3">
                {Array.from({ length: maxReviewIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setReviewIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      reviewIndex === index ? 'bg-(--primary)' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleReviewNext}
                className="text-(--primary) hover:text-(--primary-hover) transition"
                aria-label="Next reviews"
              >
                <FaChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
