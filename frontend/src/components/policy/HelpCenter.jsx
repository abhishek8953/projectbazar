import React from "react";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 py-10 px-4 flex justify-center">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-500 text-white text-center py-10 px-6">
          <h1 className="text-3xl md:text-4xl font-bold">Help Center</h1>
          <p className="text-sm opacity-90 mt-2">We’re here to help you</p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">

          {/* Section 1 */}
          <Section
            number="1"
            title="Getting Started"
            text="Learn how to create an account, set up your profile, and navigate the platform quickly."
          />

          {/* Section 2 */}
          <Section
            number="2"
            title="Account Management"
            text="Understand how to update your information, reset your password, and manage your settings securely."
          />

          {/* Section 3 */}
          <SectionList
            number="3"
            title="Common Questions"
            items={[
              "How to place an order",
              "Payment options and refunds",
              "Tracking your orders",
              "Managing notifications and preferences",
            ]}
          />

          {/* Section 4 */}
          <Section
            number="4"
            title="Technical Support"
            text="If you experience technical issues, our support team can guide you through troubleshooting steps."
          />

          {/* Section 5 */}
          <Section
            number="5"
            title="Contact Support"
            text="Need personal assistance? Reach out to our support team via email or visit our office."
          />

          {/* Contact Box */}
          <div className="bg-gray-100 p-5 rounded-xl border-l-4 border-indigo-600 mt-6">
            <p className="text-gray-800 font-semibold text-lg">Contact Us</p>
            <p className="text-gray-700">
              For further help, please contact our support team:
            </p>
            <p className="text-gray-800 font-medium mt-2">
              Email: projectbazarofficial@gmail.com
            </p>
            <p className="text-gray-800 font-medium mt-1">
              Address: Dankaur, Gautam Buddha Nagar, India
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

// ----------------- Reusable Components -------------------

const Section = ({ number, title, text }) => (
  <section className="mb-8">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-indigo-600 pb-2 mb-4">
      {number}. {title}
    </h2>
    <p className="text-gray-700 leading-7 text-sm sm:text-base">{text}</p>
  </section>
);

const SectionList = ({ number, title, items }) => (
  <section className="mb-8">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-indigo-600 pb-2 mb-4">
      {number}. {title}
    </h2>
    <ul className="space-y-3 pl-5 list-disc text-gray-700 leading-7 text-sm sm:text-base">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </section>
);
