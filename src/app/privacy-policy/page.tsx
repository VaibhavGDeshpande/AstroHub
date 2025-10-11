// app/privacy-policy/page.tsx
'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";
import LoaderWrapper from "@/components/Loader"

export default function PrivacyPolicyPage() {
  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            Last updated: October 10, 2025
          </p>
        </div>
        
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

        {/* Content */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-8 md:p-12 shadow-2xl space-y-8 text-gray-300">
          
          {/* Introduction */}
          <section>
            <p className="leading-relaxed">
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the AstroHub Service and tells You about Your privacy rights and how the law protects You.
            </p>
            <p className="leading-relaxed mt-4">
              We use Your Personal data to provide and improve the AstroHub Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Interpretation and Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Interpretation and Definitions</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">Interpretation</h3>
            <p className="leading-relaxed mb-6">
              The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Definitions</h3>
            <p className="leading-relaxed mb-3">For the purposes of this Privacy Policy:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong className="text-white">Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong className="text-white">Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to AstroHub.</li>
              <li><strong className="text-white">Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
              <li><strong className="text-white">Country</strong> refers to: Maharashtra, India</li>
              <li><strong className="text-white">Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
              <li><strong className="text-white">Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
              <li><strong className="text-white">Service</strong> refers to the AstroHub Website.</li>
              <li><strong className="text-white">Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</li>
              <li><strong className="text-white">Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</li>
              <li><strong className="text-white">Website</strong> refers to AstroHub, accessible from <a href="https://explorenasa.vercel.app/" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">https://explorenasa.vercel.app/</a></li>
              <li><strong className="text-white">You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>
          </section>

          {/* Collecting and Using Your Personal Data */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Collecting and Using Your Personal Data</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">Types of Data Collected</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Personal Data</h4>
                <p className="leading-relaxed mb-2">
                  While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Usage Data</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Usage Data</h4>
                <p className="leading-relaxed mb-3">
                  Usage Data is collected automatically when using the Service.
                </p>
                <p className="leading-relaxed mb-3">
                  Usage Data may include information such as Your Device&apos;s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                </p>
                <p className="leading-relaxed mb-3">
                  When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device&apos;s unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                </p>
                <p className="leading-relaxed">
                  We may also collect information that Your browser sends whenever You visit Our Service or when You access the Service by or through a mobile device.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Tracking Technologies and Cookies</h4>
                <p className="leading-relaxed mb-3">
                  We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies We use include beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li>
                  <li><strong className="text-white">Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
                </ul>
                <p className="leading-relaxed mt-3 mb-3">
                  Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.
                </p>
                <p className="leading-relaxed mb-3">
                  We use both Session and Persistent Cookies for the purposes set out below:
                </p>
                <ul className="list-disc list-inside space-y-3 ml-4">
                  <li>
                    <strong className="text-white">Necessary / Essential Cookies</strong>
                    <p className="ml-6 mt-1 text-sm">Type: Session Cookies</p>
                    <p className="ml-6 text-sm">Administered by: Us</p>
                    <p className="ml-6 text-sm">Purpose: These Cookies are essential to provide You with services available through the AstroHub Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
                  </li>
                  <li>
                    <strong className="text-white">Cookies Policy / Notice Acceptance Cookies</strong>
                    <p className="ml-6 mt-1 text-sm">Type: Persistent Cookies</p>
                    <p className="ml-6 text-sm">Administered by: Us</p>
                    <p className="ml-6 text-sm">Purpose: These Cookies identify if users have accepted the use of cookies on the AstroHub Website.</p>
                  </li>
                  <li>
                    <strong className="text-white">Functionality Cookies</strong>
                    <p className="ml-6 mt-1 text-sm">Type: Persistent Cookies</p>
                    <p className="ml-6 text-sm">Administered by: Us</p>
                    <p className="ml-6 text-sm">Purpose: These Cookies allow us to remember choices You make when You use the AstroHub Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use of Your Personal Data */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">Use of Your Personal Data</h3>
            <p className="leading-relaxed mb-3">The Company may use Personal Data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
              <li><strong className="text-white">To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
              <li><strong className="text-white">For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
              <li><strong className="text-white">To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application&apos;s push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
              <li><strong className="text-white">To provide You</strong> with news, special offers, and general information about other goods, services and events which We offer that are similar to those that you have already purchased or inquired about unless You have opted not to receive such information.</li>
              <li><strong className="text-white">To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
              <li><strong className="text-white">For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</li>
              <li><strong className="text-white">For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
            </ul>

            <p className="leading-relaxed mt-6 mb-3">We may share Your personal information in the following situations:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">With Service Providers:</strong> We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.</li>
              <li><strong className="text-white">For business transfers:</strong> We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
              <li><strong className="text-white">With Affiliates:</strong> We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
              <li><strong className="text-white">With business partners:</strong> We may share Your information with Our business partners to offer You certain products, services or promotions.</li>
              <li><strong className="text-white">With other users:</strong> when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li>
              <li><strong className="text-white">With Your consent</strong>: We may disclose Your personal information for any other purpose with Your consent.</li>
            </ul>
          </section>

          {/* Retention of Your Personal Data */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">Retention of Your Personal Data</h3>
            <p className="leading-relaxed mb-4">
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p className="leading-relaxed">
              The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer periods.
            </p>
          </section>

          {/* Transfer of Your Personal Data */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">Transfer of Your Personal Data</h3>
            <p className="leading-relaxed mb-4">
              Your information, including Personal Data, is processed at the Company&apos;s operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from Your jurisdiction.
            </p>
            <p className="leading-relaxed mb-4">
              Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.
            </p>
            <p className="leading-relaxed">
              The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.
            </p>
          </section>

          {/* Delete Your Personal Data */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">Delete Your Personal Data</h3>
            <p className="leading-relaxed mb-4">
              You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.
            </p>
            <p className="leading-relaxed mb-4">
              Our Service may give You the ability to delete certain information about You from within the Service.
            </p>
            <p className="leading-relaxed mb-4">
              You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.
            </p>
            <p className="leading-relaxed">
              Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
            </p>
          </section>

          {/* Disclosure of Your Personal Data */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">Disclosure of Your Personal Data</h3>
            
            <h4 className="text-lg font-semibold text-white mb-2">Business Transactions</h4>
            <p className="leading-relaxed mb-6">
              If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.
            </p>

            <h4 className="text-lg font-semibold text-white mb-2">Law enforcement</h4>
            <p className="leading-relaxed mb-6">
              Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
            </p>

            <h4 className="text-lg font-semibold text-white mb-2">Other legal requirements</h4>
            <p className="leading-relaxed mb-3">
              The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of the Company</li>
              <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>Protect the personal safety of Users of the Service or the public</li>
              <li>Protect against legal liability</li>
            </ul>
          </section>

          {/* Security of Your Personal Data */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">Security of Your Personal Data</h3>
            <p className="leading-relaxed">
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Children&apos;s Privacy</h2>
            <p className="leading-relaxed mb-4">
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.
            </p>
            <p className="leading-relaxed">
              If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent&apos;s consent before We collect and use that information.
            </p>
          </section>

          {/* Links to Other Websites */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Links to Other Websites</h2>
            <p className="leading-relaxed mb-4">
              Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party&apos;s site. We strongly advise You to review the Privacy Policy of every site You visit.
            </p>
            <p className="leading-relaxed">
              We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
            </p>
          </section>

          {/* Changes to this Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Changes to this Privacy Policy</h2>
            <p className="leading-relaxed mb-4">
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
            </p>
            <p className="leading-relaxed mb-4">
              We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.
            </p>
            <p className="leading-relaxed">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Us</h2>
            <p className="leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, You can contact us:
            </p>
            <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-6">
              <p><strong className="text-white">By email:</strong> deshpande.vaibhav1012@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
    </LoaderWrapper>
  );
}
