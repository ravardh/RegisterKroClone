import React from 'react';
import About1 from '../assets/about1.png';
import About2 from '../assets/about2.png';
import SEOHelmet from '../components/SEOHelmet';

const About = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About TaxProSolution",
    "description": "Learn about TaxProSolution - your trusted partner in business registration and compliance"
  };

  return (
    <>
      <SEOHelmet
        title="About TaxProSolution - Your Business Growth Partner"
        description="Discover TaxProSolution's mission to simplify business registration and compliance. We're your trusted partner for GST, company registration, and tax solutions."
        keywords="about us, business solutions, company registration, tax services, compliance"
        canonicalUrl="https://taxprosolution.co.in/about"
        structuredData={aboutSchema}
      />
      <section className="hero-section -mt-20 flex flex-col items-center justify-center h-screen bg-[url('/hero.webp')] opacity-90 bg-cover bg-center">
        <div className="hero-content px-6 sm:px-20 md:px-32 lg:px-48 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-semibold mb-4">
            About Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 w-full sm:w-3/4 mx-auto">
            Your trusted partner in business registration and compliance solutions. 
            We simplify the complex, so you can focus on growing your business.
          </p>
          <button className="bg-(--primary) text-white px-6 py-3 rounded-2xl hover:bg-(--primary-hover) transition">
            Know More
          </button>
        </div>
      </section>

      <section className="about-content mt-10 sm:mt-20 py-10 bg-(--background)">
        <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
            <div>
              <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                Who We Are
              </h2>
              <p className="text-(--secondary) text-lg leading-relaxed mb-4">
                TaxPro Solution is a leading business services platform dedicated to helping entrepreneurs and businesses navigate the complex world of company registration, compliance, and legal documentation.
              </p>
              <p className="text-(--secondary) text-lg leading-relaxed mb-4">
                With years of experience and a team of seasoned professionals, we've helped thousands of businesses establish their presence, maintain compliance, and achieve their growth objectives.
              </p>
              <p className="text-(--secondary) text-lg leading-relaxed">
                Our mission is to make business registration and compliance simple, accessible, and affordable for everyone—from startups to established enterprises.
              </p>
            </div>
            <div>
              <img src={About1} alt="Who We Are" className="rounded-2xl shadow-lg w-full h-auto" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
            <div className="order-2 md:order-1">
              <img src={About2} alt="Our Mission" className="rounded-2xl shadow-lg w-full h-auto" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                Our Mission
              </h2>
              <p className="text-(--secondary) text-lg leading-relaxed mb-4">
                To empower businesses with seamless, efficient, and expert-driven solutions for registration, compliance, and legal requirements.
              </p>
              <p className="text-(--secondary) text-lg leading-relaxed mb-4">
                We believe that every business deserves access to professional services without the complexity and high costs traditionally associated with legal and compliance work.
              </p>
              <p className="text-(--secondary) text-lg leading-relaxed">
                Through technology, expertise, and dedicated support, we're transforming how businesses approach their registration and compliance needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-[url('/process-bg.jpg')] opacity-90 bg-cover bg-center px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-10 mx-4 sm:mx-8 md:mx-12 lg:mx-20 my-10 md:my-20 rounded-2xl shadow-lg">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 my-8 md:my-12">
            <div className="bg-white/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-md text-center border border-white/30">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--primary) mb-3">5000+</div>
              <h3 className="text-lg md:text-xl font-semibold text-(--text) mb-2">Happy Clients</h3>
              <p className="text-(--secondary)">Businesses registered and served successfully</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-md text-center border border-white/30">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--primary) mb-3">50+</div>
              <h3 className="text-lg md:text-xl font-semibold text-(--text) mb-2">Expert Team</h3>
              <p className="text-(--secondary)">Dedicated professionals at your service</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-md text-center border border-white/30">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--primary) mb-3">98%</div>
              <h3 className="text-lg md:text-xl font-semibold text-(--text) mb-2">Success Rate</h3>
              <p className="text-(--secondary)">Applications approved on first attempt</p>
            </div>
          </div>
      </section>

    </>
  )
}

export default About