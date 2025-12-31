import React from 'react'
import { RiHome2Line } from 'react-icons/ri'
import { MdOutlinePhoneIphone } from 'react-icons/md'
import { FiMail } from 'react-icons/fi'

const ContactForm = () => {
  return (
    <>
    <section id="contact" className="bg-(--background) py-12">
      <div className="flex gap-10 w-full mx-40">
        <div className="row-container w-1/2">
          <h2 className="text-3xl">Get In Touch</h2>
          <form className="grid my-10 gap-6">
            <textarea
              rows={10}
              placeholder="Enter message"
              name="formMessage"
              className="border border-gray-300 p-3 text-gray-700 text-sm"
            />
            <div className="flex gap-6">
              <input
                type="text"
                placeholder="Enter your name"
                name="name"
                className="border border-gray-300 p-3 text-gray-700 text-sm w-1/2"
              />
              <input
                type="text"
                placeholder="Enter your email"
                name="email"
                className="border border-gray-300 p-3 text-gray-700 text-sm w-1/2"
              />
            </div>
            <input
              type="text"
              placeholder="Enter subject"
              name="subject"
              className="border border-gray-300 p-3 text-gray-700 text-sm"
            />
            <div>
              <button
                type="submit"
                className="border border-(--primary) text-(--primary) py-4 px-8 hover:bg-(--primary-hover) hover:text-white"
              >
                SEND
              </button>
            </div>
          </form>
        </div>
        <div className="row-container grid gap-10 px-20 h-fit my-20">
          <div className="flex h-fit gap-1">
            <div className="">
              <RiHome2Line className="w-10 h-10 text-gray-400" />
            </div>
            <div className="grid">
              <span>Buttonwood, California.</span>
              <span className="text-gray-500">Rosemead, CA 91770</span>
            </div>
          </div>
          <div className="flex h-fit gap-1">
            <div className="flex">
              <MdOutlinePhoneIphone className="w-10 h-10 text-gray-400" />
            </div>
            <div className="grid">
              <span>+1 253 565 2365</span>
              <span className="text-gray-500">Mon to Fri 9am to 6pm</span>
            </div>
          </div>
          <div className="flex h-fit gap-1">
            <div className="">
              <FiMail className="w-10 h-10 text-gray-400" />
            </div>
            <div className="grid">
              <span>support@colorlib.com</span>
              <span className="text-gray-500">Send us your query anytime!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default ContactForm