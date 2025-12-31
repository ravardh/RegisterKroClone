import React from 'react'

const Register = () => {
return (
    <div>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-(--background) text-(--text)">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-(--text)">Create your account</h1>
                        <p className="text-sm text-(--secondary)">Join RegisterKaro — it only takes a minute.</p>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm mb-1 text-(--secondary)">Full name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Your name"
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-(--secondary)">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-(--secondary)">Phone</label>
                        <input
                            type="tel"
                            name="number"
                            required
                            placeholder="94**********"
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-(--secondary)">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-(--secondary)">
                            <input type="checkbox" className="mr-2" />
                            Keep me signed in
                        </label>
                        <a href="#" className="text-sm font-medium text-(--primary)">Forgot?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg text-white font-medium transition-opacity bg-(--primary)"
                    >
                        Create account
                    </button>
                </form>

                <div className="mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-sm text-(--secondary)">or continue with</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 border-gray-200 bg-white text-(--text)">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 12.3c0-.7-.1-1.4-.3-2H12v3.8h5.6c-.2 1.1-.9 2-1.9 2.6v2.2h3.1c1.8-1.7 2.9-4.1 2.9-6.6z" fill="#4285F4"/><path d="M12 22c2.7 0 5-0.9 6.6-2.4l-3.1-2.2c-.9.6-2.1.9-3.5.9-2.7 0-4.9-1.8-5.7-4.3H3.1v2.7C4.8 19.9 8.1 22 12 22z" fill="#34A853"/><path d="M6.3 13.9c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7h-3.2C2.4 8.6 2 10.3 2 12s.4 3.4 1.1 5l3.2-3.1z" fill="#FBBC05"/><path d="M12 6.1c1.5 0 2.8.5 3.8 1.4l2.8-2.8C17 3.4 14.7 2.5 12 2.5 8.1 2.5 4.8 4.6 3.1 7.7l3.2 2.4C7.1 7.9 9.3 6.1 12 6.1z" fill="#EA4335"/></svg>
                            Google
                        </button>
                    </div>
                </div>

                <p className="text-xs text-center mt-5 text-(--secondary)">
                    By continuing, you agree to our <a href="#" className="underline text-(--primary)">Terms</a> and <a href="#" className="underline text-(--primary)">Privacy Policy</a>.
                </p>
            </div>
        </div>
    </div>
)
}

export default Register