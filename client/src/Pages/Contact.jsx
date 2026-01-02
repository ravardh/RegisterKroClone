import React, { useState } from "react";
import { RiHome2Line } from "react-icons/ri";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import CommonData from "../assets/common.json";

const ContactForm = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    formMessage: "",
  });

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    

    if (!contactData.name.trim()) {
      toast.error("Name is required");
      return;
    } else if (contactData.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    
    // Email validation - only accept major providers
    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'protonmail.com'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactData.email.trim()) {
      toast.error("Email is required");
      return;
    } else if (!emailRegex.test(contactData.email)) {
      toast.error("Please enter a valid email address");
      return;
    } else {
      const emailDomain = contactData.email.toLowerCase().split('@')[1];
      if (!allowedDomains.includes(emailDomain)) {
        toast.error("Invalid email domain");
        return;
      }
    }
    
    // Phone validation - only 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!contactData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    } else if (!phoneRegex.test(contactData.phone.replace(/\s/g, ''))) {
      toast.error("Invalid phone number");
      return;
    }
    
    if (!contactData.formMessage.trim()) {
      toast.error("Message is required");
      return;
    } else if (contactData.formMessage.trim().length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }
    
    console.log("Form submitted:", contactData);
    toast.success("Message sent successfully!");
    
    setContactData({
      name: "",
      email: "",
      phone: "",
      formMessage: "",
    });
  };
  
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <section className="contact-header bg-(--secondary) py-5 mb-10">
        <div className="contact-header-wrapper flex py-5 mx-25 w-full">
          <div className="contact-header-left max-w-1/2 text-white grid px-2.5 h-fit my-20">
            <div className="contact-header-left-heading flex flex-col">
              <h2 className="flex text-6xl font-bold my-2">
                Get Instant Support from Our Experts
              </h2>
              <p className="mb-13 text-3xl">
                Send us a quick message. We're here to help.
              </p>
            </div>
            <div className="contact-header-details grid gap-5 w-fit">
              <div className="flex h-fit gap-1">
                <div className="">
                  <RiHome2Line className="w-10 h-10" />
                </div>
                <div className="grid">
                  <span>
                    {CommonData.address.line1 + ", " + CommonData.address.city}
                  </span>
                  <span>
                    {CommonData.address.state} - {CommonData.address.postalCode}
                  </span>
                </div>
              </div>
              <div className="flex h-fit gap-1">
                <div className="flex">
                  <MdOutlinePhoneIphone className="w-10 h-10" />
                </div>
                <div className="grid">
                  <span>{CommonData.phone}</span>
                  <span>Mon - Fri</span>
                  <span>{CommonData.hours.weekdays}</span>
                </div>
              </div>
              <div className="flex h-fit gap-1">
                <div className="">
                  <FiMail className="w-10 h-10" />
                </div>
                <div className="grid">
                  <span>{CommonData.emails.support}</span>
                  <span className="text-white">
                    Send us your query anytime!
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-header-right p-5">
            <div className="contact-form max-w-lg mx-auto">
              <form className="bg-(--background) rounded-2xl grid p-5 mx-10 gap-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold text-center">
                  Something Didn't Go as Planned? Let's Fix It Together.
                </h2>

                <div>
                  <label className="block text-sm font-medium text-(--root) mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    name="name"
                    value={contactData.name}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-3xl w-full text-gray-700 text-sm"
                  />
                </div>

                <div className="flex gap-6">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-(--root) mb-1">
                      Email*
                    </label>
                    <input
                      type="email"
                      placeholder="youremail@example.com"
                      name="email"
                      value={contactData.email}
                      onChange={handleChange}
                      className="border border-gray-300 p-3 text-gray-700 rounded-3xl w-full text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-(--root) mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      name="phone"
                      value={contactData.phone}
                      onChange={handleChange}
                      className="border border-gray-300 p-3 text-gray-700 rounded-3xl w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--root) mb-1">
                    Message*
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Message"
                    name="formMessage"
                    value={contactData.formMessage}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-2xl w-full text-gray-700 text-sm"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-(--primary) rounded-2xl w-full py-4 px-8 text-white text-lg font-medium hover:bg-(--primary-hover) transition-colors duration-200"
                  >
                    Submit
                  </button>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">
                    By submitting this form, you will be redirected to log in or
                    create an account to track your support ticket.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="location mx-39 py-5 px-0.5 mb-10">
        <div className="loaction-heading text-(--primary) text-3xl font-bold mb-10 text-center ">
          Our Location
        </div>
        <div className="location-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28018.57321108115!2d77.31823025881644!3d28.620120427859174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5456ef36d9f%3A0x3b7191b1286136c8!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1767250519672!5m2!1sen!2sin"
            className="border-0 w-full"
            width="100%"
            height="400"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default ContactForm;
