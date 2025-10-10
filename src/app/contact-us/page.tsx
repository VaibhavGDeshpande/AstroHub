// app/contact/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { EnvelopeIcon, UserIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import LoaderWrapper from '@/components/Loader';
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init({
      publicKey: 'O0vuo1GejzvHbCFo5',
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get current timestamp
      const currentTime = new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Prepare template parameters matching your EmailJS template
      const templateParams = {
        title: formData.subject,
        name: `${formData.firstName} ${formData.lastName}`,
        time: currentTime,
        message: formData.message,
        email: formData.email,
      };

      // Send email using EmailJS
      await emailjs.send(
        "service_psw8jm6",
        "template_zd1nyma",
        templateParams
      );

      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoaderWrapper>
    <div className="h-screen overflow-hidden bg-gradient-to-b from-black via-blue-950/20 to-black">
      <div className="container mx-auto px-4 max-w-5xl h-full flex flex-col justify-center py-8">
        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
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

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Have questions about our astronomy tools? Want to report an issue or provide feedback? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-cyan-400 mb-1">
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
                      className="w-full pl-11 pr-4 py-2.5 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-cyan-400 mb-1">
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
                      className="w-full pl-11 pr-4 py-2.5 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyan-400 mb-1">
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
                    className="w-full pl-11 pr-4 py-2.5 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              {/* Subject - Now a text input */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-cyan-400 mb-1">
                  Subject *
                </label>
                <div className="relative">
                  <ChatBubbleLeftRightIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-2.5 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                    placeholder="Brief description of your inquiry"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-cyan-400 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none text-sm"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">* Required fields</p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center space-x-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </div>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 flex items-center space-x-3 text-sm">
                  <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <span>Thank you! Your message has been sent successfully. We&apos;ll get back to you within 24-48 hours.</span>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 flex items-center space-x-3 text-sm">
                  <span>⚠️ Failed to send message. Please try again or contact us at support@astrohub.com</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
    </LoaderWrapper>
  );
}
