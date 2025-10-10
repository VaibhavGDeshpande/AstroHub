// app/terms-conditions/page.tsx
'use client'

import LoaderWrapper from "@/components/Loader";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function TermsConditionsPage() {

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Terms & Conditions
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
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              Welcome to AstroHub. By accessing or using our website, tools, and services (collectively, the &quot;Services&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you disagree with any part of these Terms, you may not access our Services.
            </p>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Use License</h2>
            <p className="leading-relaxed mb-4">
              Subject to your compliance with these Terms, AstroHub grants you a limited, non-exclusive, non-transferable, and revocable license to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and use the Services for personal, educational, and non-commercial purposes</li>
              <li>View and interact with astronomy data, images, and tools provided through our website</li>
              <li>Download content that is explicitly marked as downloadable</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. Acceptable Use Policy</h2>
            <p className="leading-relaxed mb-2">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Services for any unlawful purpose or in violation of any applicable laws</li>
              <li>Attempt to gain unauthorized access to any portion of the Services</li>
              <li>Interfere with or disrupt the Services or servers connected to the Services</li>
              <li>Use automated systems (bots, scrapers) to access the Services without permission</li>
              <li>Transmit any viruses, malware, or harmful code</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Collect or harvest personal information of other users</li>
              <li>Use the Services to distribute spam or unsolicited communications</li>
            </ul>
          </section>

          {/* NASA Data Attribution */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. Third-Party Content and APIs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4.1 NASA APIs</h3>
                <p className="leading-relaxed">
                  AstroHub utilizes NASA&apos;s publicly available APIs to provide astronomy data, images, and information. All NASA content is subject to NASA&apos;s own terms of use and media usage guidelines. We do not claim ownership of any NASA-provided content.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4.2 Third-Party Links</h3>
                <p className="leading-relaxed">
                  Our Services may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. You access these at your own risk.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Intellectual Property Rights</h2>
            <p className="leading-relaxed mb-4">
              Unless otherwise indicated, AstroHub owns or licenses all intellectual property rights in the Services, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Website design, layout, and user interface</li>
              <li>Custom-developed tools and visualizations</li>
              <li>Original text, graphics, and educational content</li>
              <li>Software, code, and algorithms</li>
            </ul>
            <p className="leading-relaxed mt-4">
              You may not reproduce, distribute, modify, or create derivative works from our proprietary content without explicit written permission.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">6. User Accounts</h2>
            <p className="leading-relaxed mb-2">
              If you create an account on our platform, you are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Providing accurate and complete registration information</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">7. Disclaimer of Warranties</h2>
            <p className="leading-relaxed mb-4">
              THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the Services will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We do not warrant that astronomical data or information provided is suitable for any specific purpose or will meet your requirements.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">8. Limitation of Liability</h2>
            <p className="leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASTROHUB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Your access to or use of (or inability to access or use) the Services</li>
              <li>Any conduct or content of third parties on the Services</li>
              <li>Unauthorized access, use, or alteration of your data</li>
              <li>Any errors, inaccuracies, or omissions in the Services</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">9. Indemnification</h2>
            <p className="leading-relaxed">
              You agree to indemnify, defend, and hold harmless AstroHub, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys&apos; fees, arising out of or in any way connected with your access to or use of the Services, or your violation of these Terms.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">10. Termination</h2>
            <p className="leading-relaxed">
              We may terminate or suspend your access to the Services immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Services will cease immediately. All provisions that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          {/* Educational Purpose */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">11. Educational Purpose Disclaimer</h2>
            <p className="leading-relaxed">
              AstroHub is designed for educational and informational purposes. The astronomical data, images, and information provided should not be used as the sole basis for critical decisions. Always verify information from multiple authoritative sources for important uses.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">12. Governing Law and Jurisdiction</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Services shall be subject to the exclusive jurisdiction of the courts located in Pune, Maharashtra, India.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">13. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. We will provide notice of any material changes by posting the new Terms on this page and updating the &quot;Last Updated&quot; date. Your continued use of the Services after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">14. Severability</h2>
            <p className="leading-relaxed">
              If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will continue in full force and effect. The invalid or unenforceable provision will be deemed superseded by a valid provision that most closely matches the intent of the original provision.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">15. Contact Us</h2>
            <p className="leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-6 space-y-2">
              <p><strong className="text-white">Email:</strong> legal@astrohub.com</p>
              <p><strong className="text-white">Website:</strong> www.astrohub.com</p>
              <p><strong className="text-white">Contact Form:</strong> <a href="/contact" className="text-cyan-400 hover:text-cyan-300 underline">Contact Us Page</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
    </LoaderWrapper>
  );
}
