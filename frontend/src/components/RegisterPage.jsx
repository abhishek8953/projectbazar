import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";


const API_URL=import.meta.env.VITE_API_URL;




const RegisterPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (res.ok) {
				setSuccess("Registration successful! Redirecting to login...");
				setTimeout(() => navigate("/login"), 2000);
			} else {
				setError(data.message || "Registration failed");
			}
		} catch (err) {
			setError("Network error. Please try again.",err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-card">
				<div className="auth-header">
					<div className="auth-icon">
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</div>
					<h2>Create Account</h2>
					<p>Join ProjectHub today</p>
				</div>
				{error && <div className="error-message">{error}</div>}
				{success && <div className="success-message">{success}</div>}
				<form onSubmit={handleRegister} className="auth-form">
					<div className="form-group">
						<label>Full Name</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
							placeholder="John Doe"
							required
						/>
					</div>
					<div className="form-group">
						<label>Email Address</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
							placeholder="you@example.com"
							required
						/>
					</div>
					<div className="form-group">
						<label>Password</label>
						<input
							type="password"
							value={formData.password}
							onChange={(e) =>
								setFormData({
									...formData,
									password: e.target.value,
								})
							}
							placeholder="••••••••"
							required
							minLength="6"
						/>
					</div>
					<button
						type="submit"
						className="btn-submit"
						disabled={loading}
					>
						{loading ? "Creating Account..." : "Create Account"}
					</button>
				</form>
				<p className="auth-footer">
					Already have an account?{" "}
					<Link to="/login" className="link-btn">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
};


export default RegisterPage;
