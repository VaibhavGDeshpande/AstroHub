// app/contact/page.tsx
'use client'
import { useState } from 'react';
import { EnvelopeIcon, UserIcon, PhoneIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import LoaderWrapper from '@/components/Loader';
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call - Replace with your actual API endpoint
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Have questions about our astronomy tools? Want to report an issue or provide feedback? We&apos;d love to hear from you.
          </p>
        </div>
        <div className="fixed top-4 left-4 z-50">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-sm">Back</span>
            </Link>
          </motion.div> 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-cyan-400 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-cyan-400 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-cyan-400 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-cyan-400 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-cyan-400 mb-2">
                    Subject *
                  </label>
                  <div className="relative">
                    <ChatBubbleLeftRightIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="bug">Report a Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-cyan-400 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">* Required fields</p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </div>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 flex-shrink-0" />
                    <span>Thank you! Your message has been sent successfully. We&apos;sll get back to you within 24-48 hours.</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-cyan-400/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <EnvelopeIcon className="h-6 w-6 text-cyan-400" />
                <h3 className="text-white font-semibold text-lg">Email</h3>
              </div>
              <p className="text-gray-300 text-sm mb-2">For general inquiries:</p>
              <a href="mailto:support@astrohub.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                support@astrohub.com
              </a>
              <p className="text-gray-300 text-sm mt-3 mb-2">For technical support:</p>
              <a href="mailto:tech@astrohub.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                tech@astrohub.com
              </a>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-cyan-400/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <PhoneIcon className="h-6 w-6 text-cyan-400" />
                <h3 className="text-white font-semibold text-lg">Phone</h3>
              </div>
              <p className="text-gray-300 text-sm mb-2">Support Hotline:</p>
              <p className="text-cyan-400">+91 98765 43210</p>
              <p className="text-gray-400 text-xs mt-2">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-cyan-400/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-cyan-400" />
                <h3 className="text-white font-semibold text-lg">Response Time</h3>
              </div>
              <p className="text-gray-300 text-sm">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">Need Quick Answers?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Check out our documentation for common questions and guides.
              </p>
              <a 
                href="/documentation" 
                className="inline-block px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm font-medium"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </LoaderWrapper>
  );
}
