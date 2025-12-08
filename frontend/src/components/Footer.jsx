import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
     
      <div className="footer-container">
        {/* Footer Content */}
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">📦</div>
              <span className="logo-text">ProjectBazar</span>
            </div>
            <p className="footer-description">
              Discover, explore, and manage amazing projects with ProjectBazar. 
              Your one-stop platform for creative solutions.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" title="Facebook">f</a>
              <a href="#" className="social-link" title="Twitter">𝕏</a>
              <a href="#" className="social-link" title="Instagram">📷</a>
              <a href="#" className="social-link" title="LinkedIn">in</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/">Projects</a></li>
              <li><a href="/about">About Us</a></li>
             
    
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
             
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4>Subscribe</h4>
            <p className="newsletter-desc">Get updates on new projects and features.</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {currentYear} ProjectBazar. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <span className="footer-divider">|</span>
            <a href="/privacy" className="footer-bottom-link">Privacy</a>
            <span className="footer-divider">|</span>
            <a href="/terms" className="footer-bottom-link">Terms</a>
            <span className="footer-divider">|</span>
            <a href="/contact" className="footer-bottom-link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;