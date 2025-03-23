"use client"

import { Send } from "lucide-react"
import { useState } from "react"

export default function LandingpageFooter() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form validation before submission
    if (!email || !message) {
      setError("Please fill in both fields.")
      return
    }

    // Handle form submission
    console.log({ email, message })
    setError("") // Clear error after submission
  }

  return (
    <footer className="py-16 px-4 bg-gray-900">
      <div className="md:px-24 pt-12 px-8 md:pt-24">
        <div className="md:grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-100">Get in Touch</h2>
            <p className="text-gray-300 mb-4">Have a project in mind? Let's talk about how we can work together.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-[#03a9f4]"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-[#03a9f4]"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-gray-100 rounded-xl hover:bg-[#03a9f4] hover:text-black transition-all duration-300"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}
