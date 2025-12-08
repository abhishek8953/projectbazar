import React, { useState } from "react";
import "../../css/aboutus.css";

const ContactUs = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});

	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
    setFormData({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	})
    alert("Message send")
		setLoading(true);

		try {
			// Replace with your API endpoint
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/contact`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);

			if (response.ok) {
				setSubmitted(true);
				setFormData({
					name: "",
					email: "",
					phone: "",
					subject: "",
					message: "",
				});
				setTimeout(() => setSubmitted(false), 5000);
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Error submitting form. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="contact-page">
			<div className="contact-header">
				<h1>Contact Us</h1>
				<p>We'd love to hear from you. Get in touch with our team.</p>
			</div>

			<div className="contact-container">
				{/* Contact Information */}
				<div className="contact-info-section">
					<div className="info-card">
						<div className="info-icon email">📧</div>
						<h3>Email</h3>

						<a
							href="https://mail.google.com/mail/?view=cm&fs=1&to=projectbazarofficial@gmail.com"
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							projectbazarofficial@gmail.com
						</a>

						<p className="info-desc">
							We'll respond within 24 hours
						</p>
					</div>

					<div className="info-card">
						<div className="info-icon instagram">📸</div>
						<h3>Instagram</h3>
						<a
							href="https://instagram.com/projectbazarofficial"
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							@projectbazarofficial
						</a>
						<p className="info-desc">
							Follow us for updates & support
						</p>
					</div>

					<div className="info-card">
						<div className="info-icon location">📍</div>
						<h3>Address</h3>
						<p>Noida </p>
						<p>Gautam Buddha Nagar</p>
						<p className="info-desc">India</p>
					</div>

					{/* <div className="info-card">
            <div className="info-icon chat">💬</div>
            <h3>Live Chat</h3>
            <p>Available on our website</p>
            <p className="info-desc">Chat with our support team</p>
          </div> */}
				</div>

				{/* Contact Form */}
				<div className="contact-form-section">
					<h2>Send us a Message</h2>

					{submitted && (
						<div className="success-message">
							✓ Thank you! Your message has been sent
							successfully. We'll be in touch soon.
						</div>
					)}

					<form onSubmit={handleSubmit} className="contact-form">
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="name">Full Name *</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									placeholder="John Doe"
								/>
							</div>

							<div className="form-group">
								<label htmlFor="email">Email Address *</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									placeholder="john@example.com"
								/>
							</div>
						</div>

						<div className="form-row">
							{/* <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div> */}

							<div className="form-group">
								<label htmlFor="subject">Subject *</label>
								<input
									type="text"
									id="subject"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									required
									placeholder="How can we help?"
								/>
							</div>
						</div>

						<div className="form-group full-width">
							<label htmlFor="message">Message *</label>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleChange}
								required
								placeholder="Tell us more about your inquiry..."
								rows="6"
							/>
						</div>

						<button
							type="submit"
							className="btn-submit"
							disabled={loading}
						>
							{loading ? "Sending..." : "Send Message"}
						</button>
					</form>

					<p className="form-note">* Required fields</p>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="faq-section">
				<h2>Frequently Asked Questions</h2>
				<div className="faq-grid">
					<div className="faq-card">
						<h4>What are your business hours?</h4>
						<p>
							We operate Monday to Friday, 9 AM to 6 PM EST.
							Outside these hours, you can still reach us via
							email.
						</p>
					</div>

					<div className="faq-card">
						<h4>How quickly will you respond?</h4>
						<p>
							We aim to respond to all inquiries within 24 hours
							during business days.
						</p>
					</div>

					<div className="faq-card">
						<h4>Do you offer technical support?</h4>
						<p>
							Yes, our technical support team is available to help
							with any issues or questions about our platform.
						</p>
					</div>

					<div className="faq-card">
						<h4>Can I request a callback?</h4>
						<p>
							Yes, mention in your message if you'd like us to
							call you back at a specific time.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactUs;
