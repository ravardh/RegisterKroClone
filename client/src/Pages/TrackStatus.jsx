import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdCheckCircle } from 'react-icons/md'

const TrackStatus = () => {
  const [trackingId, setTrackingId] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const [currentStage, setCurrentStage] = useState(2)

  const stages = [
    { id: 1, name: 'Form Submitted', icon: '📝' },
    { id: 2, name: 'Lead Generated', icon: '🎯' },
    { id: 3, name: 'RM Assigned', icon: '👤' },
    { id: 4, name: 'Documents Collected', icon: '📄' },
    { id: 5, name: 'Service Delivered', icon: '✅' }
  ]

  const handleGetStatus = (e) => {
    e.preventDefault()
    setShowProgress(true)
  }

  return (
    <div className="bg-[url('hero.jpg')] bg-cover bg-center bg-fixed min-h-screen -mt-20">
      <div className="w-full px-4 md:px-8 lg:px-10 flex items-center min-h-screen py-8">
        <div className="w-full">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-8 lg:mb-12">
              
              <section className="w-full max-w-md">
                <div className="bg-white/90 rounded-2xl shadow-2xl p-6 md:p-10 border border-black">
                  <form onSubmit={handleGetStatus} className="space-y-6">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter your tracking ID"
                        className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                      Get Status
                    </button>
                  </form>
                </div>
              </section>

              <section className="text-center lg:text-left space-y-4 rounded-2xl p-6 md:p-8 w-full lg:w-auto">
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/80">Live tracking</p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                  Track your application
                </h1>
                <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                  Enter your tracking ID to check the latest status of your application instantly.
                </p>
              </section>
              
              
            </div>

            {showProgress && (
              <section className="w-full mt-8">
                <div className="bg-white/95 rounded-2xl shadow-2xl p-6 md:p-10 border border-white/30">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">Application Progress</h2>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2">
                    {stages.map((stage, index) => (
                      <div key={stage.id} className="flex md:flex-col items-start md:items-center flex-1 w-full md:w-auto">
                        <div className="flex md:flex-col items-center md:items-center md:mb-3 w-auto md:w-full relative">
                          <div
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-300 z-10 shrink-0 ${
                              index < currentStage
                                ? 'bg-green-500 text-white scale-110'
                                : index === currentStage
                                ? 'bg-blue-600 text-white scale-105 ring-4 ring-blue-300'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {index < currentStage ? (
                              <MdCheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                            ) : (
                              stage.icon
                            )}
                          </div>
                          
                          {index <= stages.length - 1 && (
                            <div
                              className={`md:hidden w-1 h-12 ml-6 transition-all duration-300 ${
                                index < currentStage ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            />
                          )}
                        </div>

                        <p
                          className={`ml-4 md:ml-0 text-left md:text-center text-sm md:text-sm font-semibold flex-1 md:flex-none ${
                            index <= currentStage ? 'text-gray-800' : 'text-gray-400'
                          }`}
                        >
                          {stage.name}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <p className="text-blue-800 font-semibold text-sm md:text-base">
                      Current Status: <span className="text-blue-600">{stages[currentStage].name}</span>
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="mt-10">
              <div className="bg-white/90 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Observed a gap?</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Let us know how the journey went</h3>
                <p className="text-gray-600 mt-2 md:mt-3 max-w-2xl">
                  Share a quick note about what we got right or where we can improve. A short send-off helps the team keep every service consistent.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to="/feedback"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-(--primary) text-white font-semibold shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-(--primary-hover)"
                  >
                    Post feedback
                  </Link>
                  <span className="text-sm text-gray-500">Feedback is anonymous unless you choose to share contact info.</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackStatus
