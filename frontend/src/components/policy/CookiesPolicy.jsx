import React from "react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 flex justify-center">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-center py-10 px-6">
          <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
          <p className="text-sm opacity-90 mt-2">Last Updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          
          {/* Section */}
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-indigo-600 pb-2 mb-4">
              What Are Cookies?
            </h2>
            <p className="text-gray-600 leading-7">
              Cookies are small text files stored on your device to improve your 
              browsing experience. They help us analyze site usage, remember
              preferences, and enhance functionality.
            </p>
          </section>

          {/* Section */}
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-indigo-600 pb-2 mb-4">
              Types of Cookies We Use
            </h2>
            <ul className="space-y-3 pl-5 list-disc text-gray-600 leading-7">
              <li>Essential cookies for core website functionality</li>
              <li>Analytics cookies to measure user activity and performance</li>
              <li>Preference cookies to remember your settings</li>
              <li>Security cookies for safe browsing</li>
            </ul>
          </section>

          {/* Section */}
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-indigo-600 pb-2 mb-4">
              How to Disable Cookies
            </h2>
            <p className="text-gray-600 leading-7">
              You can disable cookies anytime through your browser settings. 
              Please note that disabling certain cookies may affect 
              website functionality and user experience.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-gray-100 p-5 rounded-xl border-l-4 border-indigo-600 mt-6">
            <p className="text-gray-800 font-semibold text-lg">Need Help?</p>
            <p className="text-gray-700">
              If you have questions about our Cookie Policy, contact us:
            </p>
          
          </div>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
