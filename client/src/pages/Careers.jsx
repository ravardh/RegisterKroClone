import React, { useState } from "react";
import axiosInstance from "../config/api";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { HiOutlineBriefcase, HiOutlineUser, HiOutlinePhone, HiOutlineDocumentText } from "react-icons/hi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const designations = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Digital Marketing Expert",
  "Business Consultant",
  "Legal Expert",
  "Chartered Accountant",
  "Sales Representative",
  "Customer Support",
  "HR Manager",
];

const Careers = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    designation: "",
  });
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("mobile", formData.mobile);
    data.append("designation", formData.designation);
    data.append("resume", resume);

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/public/apply-career", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ fullName: "", mobile: "", designation: "" });
        setResume(null);
        e.target.reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-(--primary) rounded-full text-sm font-bold mb-4"
          >
            <HiOutlineBriefcase size={18} />
            Careers at RegisterKro
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
          >
            Build the Future of <br className="hidden md:block" />
            <span className="text-(--primary)">Business Compliance</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Join our mission to simplify business legalities. We're looking for passionate individuals to join our growing team.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Why Join Us?
              </h3>
              <ul className="space-y-4">
                {[
                  "Dynamic Work Environment",
                  "Growth Opportunities",
                  "Industry Leading Benefits",
                  "Work with Industry Experts",
                  "Creative Freedom",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <IoShieldCheckmarkOutline size={14} />
                    </div>
                    <span className="font-medium text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-(--primary) p-6 rounded-2xl text-white shadow-xl shadow-blue-500/20">
              <h4 className="font-bold mb-2">Need Help?</h4>
              <p className="text-blue-100 text-sm mb-4">
                If you have any questions regarding the application process, feel free to contact our HR team.
              </p>
              <a href="mailto:hr@registerkro.com" className="text-white font-bold underline">
                hr@registerkro.com
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Apply Now</h2>
              <p className="text-gray-500 text-sm mb-8">Fill in your details and upload your latest resume.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <HiOutlineUser className="text-(--primary)" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-(--primary) outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <HiOutlinePhone className="text-(--primary)" /> Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData(p => ({ ...p, mobile: val }));
                    }}
                    placeholder="10 digit number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-(--primary) outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <HiOutlineBriefcase className="text-(--primary)" /> Applying For
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-(--primary) outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <HiOutlineDocumentText className="text-(--primary)" /> Resume (PDF/DOCX)
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="w-full px-4 py-10 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-(--primary) group-hover:bg-blue-50/50 transition-all text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-(--primary) group-hover:text-white transition-colors">
                        <HiOutlineDocumentText size={24} />
                      </div>
                      <p className="text-sm font-bold text-gray-600">
                        {resume ? resume.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-(--primary) cursor-pointer text-white py-4 rounded-xl font-black shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:translate-y-0"
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
