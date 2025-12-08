import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 py-10 px-4 flex justify-center">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-500 text-white text-center py-10 px-6">
          <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
          <p className="text-sm opacity-90 mt-2">
            Learn more about ProjectBazar and what we do
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">

          {/* Section 1 */}
          <Section
            number="1"
            title="Our Mission"
            text="At ProjectBazar, our mission is to provide students and developers with high-quality, ready-to-use projects that help them learn, practice, and excel in their courses or personal projects. We aim to make project acquisition simple, safe, and reliable."
          />

          {/* Section 2 */}
          <Section
            number="2"
            title="Our Vision"
            text="We envision a community where learning and sharing knowledge is easy and accessible. Our platform strives to empower learners by providing them with innovative, ready-to-use projects, helping them save time while gaining practical skills."
          />

          {/* Section 3 */}
          <Section
            number="3"
            title="Why Choose Us?"
            text="We carefully create projects, ensure they are original and well-documented, and provide a seamless purchasing experience. Our dedicated support team is always ready to assist you with any queries or technical issues."
          />

          {/* Section 4 */}
          <SectionList
            number="4"
            title="Our Values"
            items={[
              "Quality: Delivering only top-notch projects",
              "Trust: Secure and reliable transactions",
              "Innovation: Keeping up with the latest trends and technologies",
              "Support: Providing prompt and helpful assistance",
              "Community: Empowering learners and developers",
            ]}
          />

          {/* Contact Box */}
          <div className="bg-gray-100 p-5 rounded-xl border-l-4 border-indigo-600 mt-6">
            <p className="text-gray-800 font-semibold text-lg">Contact Us</p>
            <p className="text-gray-700">
              Have questions? Reach out to us:
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

export default AboutUs;

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
