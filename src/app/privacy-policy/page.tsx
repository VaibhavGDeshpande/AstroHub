'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

import LoaderWrapper from "@/components/Loader"

export default function PrivacyPolicyPage() {
  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            Last Updated: October 7, 2025
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

        {/* Content */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-8 md:p-12 shadow-2xl space-y-8 text-gray-300">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to AstroHub. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our astronomy tools and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.1 Personal Information</h3>
                <p className="leading-relaxed mb-2">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Contact us through our contact form</li>
                  <li>Subscribe to our newsletter or updates</li>
                  <li>Register for an account (if applicable)</li>
                  <li>Participate in surveys or feedback forms</li>
                </ul>
                <p className="leading-relaxed mt-2">
                  This information may include your name, email address, phone number, and any other information you choose to provide.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.2 Automatically Collected Information</h3>
                <p className="leading-relaxed mb-2">
                  When you visit our website, we automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Click patterns and navigation paths</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.3 Cookies and Tracking Technologies</h3>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-2">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Providing and maintaining our astronomy tools and services</li>
              <li>Responding to your inquiries and support requests</li>
              <li>Sending you updates, newsletters, and educational content (with your consent)</li>
              <li>Improving and personalizing your user experience</li>
              <li>Analyzing usage patterns to enhance our website functionality</li>
              <li>Detecting and preventing technical issues or security threats</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. Third-Party Services and APIs</h2>
            <p className="leading-relaxed mb-4">
              AstroHub integrates with various third-party services to provide our astronomy features:
            </p>
            <div className="space-y-3">
              <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">NASA APIs</h4>
                <p className="text-sm leading-relaxed">
                  We use NASA&apos;s public APIs to provide astronomy data, images, and information. NASA&apos;s data is publicly available and subject to their own terms and conditions.
                </p>
              </div>
              <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Analytics Services</h4>
                <p className="text-sm leading-relaxed">
                  We may use analytics services to understand how users interact with our website. These services may collect information about your usage patterns.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">6. Your Privacy Rights</h2>
            <p className="leading-relaxed mb-2">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to our processing of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your information to another service</li>
              <li><strong>Withdrawal of Consent:</strong> Withdraw consent for data processing where applicable</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise these rights, please contact us using the contact information provided below.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">7. Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              Our website is intended for educational purposes and is suitable for all ages. We do not knowingly collect personal information from children under 13 without parental consent. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">8. International Data Transfers</h2>
            <p className="leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of your country or jurisdiction where data protection laws may differ. By using our website, you consent to the transfer of your information to facilities located in different countries.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">10. Contact Us</h2>
            <p className="leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-6 space-y-2">
              <p><strong className="text-white">Email:</strong> privacy@astrohub.com</p>
              <p><strong className="text-white">Website:</strong> www.astrohub.com</p>
              <p><strong className="text-white">Contact Form:</strong> <a href="/contact" className="text-cyan-400 hover:text-cyan-300 underline">Contact Us Page</a></p>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">11. GDPR Compliance (For EU Users)</h2>
            <p className="leading-relaxed mb-2">
              If you are located in the European Economic Area (EEA), we process your personal data based on the following legal grounds:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Consent:</strong> You have given explicit consent for processing</li>
              <li><strong>Legitimate Interest:</strong> Processing is necessary for our legitimate interests</li>
              <li><strong>Legal Obligation:</strong> Processing is required by law</li>
            </ul>
            <p className="leading-relaxed mt-4">
              You have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.
            </p>
          </section>
        </div>
      </div>
    </div>
    </LoaderWrapper>
  );
}
