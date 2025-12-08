import React from 'react';
import '../../css/policy.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: December 1, 2025</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              ProjectBazar Company is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website and use our services.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Information We Collect</h2>
            <div className="subsection">
              <h3>2.1 Personal Information</h3>
              <ul>
                <li>Name and email address</li>
                <li>Phone number (optional)</li>
                <li>Postal address</li>
                <li>Payment information (processed securely)</li>
                <li>Account credentials</li>
                <li>Profile information and preferences</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>2.2 Automatic Information</h3>
              <ul>
                <li>IP address and browser type</li>
                <li>Pages visited and time spent</li>
                <li>Referring/exit pages</li>
                <li>Device information and OS</li>
                <li>Cookies and tracking data</li>
                <li>Location data (if permitted)</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>2.3 Information from Third Parties</h3>
              <p>
                We may receive information about you from third-party services, 
                social media platforms, or payment processors.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To process transactions and send confirmations</li>
              <li>To send marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To detect and prevent fraud</li>
              <li>To comply with legal obligations</li>
              <li>To personalize your experience</li>
              <li>To respond to your inquiries and support requests</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties except:</p>
            <ul>
              <li>With service providers who assist in operations (under strict confidentiality)</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights and safety</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures including SSL encryption, 
              secure payment gateways, and regular security audits. However, no method of 
              transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Cookies and Tracking</h2>
            <p>
              We use cookies to enhance your experience. You can control cookie settings 
              through your browser. Disabling cookies may affect functionality.
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for site functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand user behavior</li>
              <li><strong>Marketing Cookies:</strong> Used for personalized advertising</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Your Rights</h2>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to request deletion of your data</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>8. Children's Privacy</h2>
            <p>
              ProjectBazar is not intended for children under 13 years of age. 
              We do not knowingly collect personal information from children. 
              If we become aware of such collection, we will delete it immediately.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible 
              for their privacy practices. Please review their privacy policies before sharing information.
            </p>
          </section>

          <section className="policy-section">
            <h2>10. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant 
              changes by email or prominent notice on our website. Your continued use constitutes 
              acceptance of changes.
            </p>
          </section>

          <section className="policy-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> projectbazarofficial@gmail.com</p>
              <p><strong>Address:</strong>Dankaur, Gautam Buddha Nagar , India</p>
             
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;