import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";



const Navbar = ({ cartCount, mobileMenuOpen, setMobileMenuOpen }) => {
	console.log("Navbar");
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
		setMobileMenuOpen(false);
	};

	return (
		<nav className="navbar">
			<div className="nav-container">
				<Link to="/" className="nav-logo">
					<div className="logo-icon">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
							<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
						</svg>
					</div>
					<span className="logo-text">ProjectBazar</span>
				</Link>

				{/* Desktop Menu */}
				<div className="nav-links desktop">
					<Link to="/" className="nav-link">
						Projects
					</Link>
					{user ? (
						<>
							{user.role === "admin" && (
								<Link to="/admin" className="nav-link">
									Admin Dashboard
								</Link>
							)}
							<Link to="/orders" className="nav-link">
								My Orders
							</Link>
							{user.role !== "admin" && (
								<Link to="/cart" className="nav-link cart-link">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<circle cx="9" cy="21" r="1"></circle>
										<circle cx="20" cy="21" r="1"></circle>
										<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
									</svg>
									{cartCount > 0 && (
										<span className="cart-badge">
											{cartCount}
										</span>
									)}
								</Link>
							)}
							<div className="user-menu">
								<span className="user-name">{user.name}</span>
								<button
									onClick={handleLogout}
									className="btn-logout"
								>
									Logout
								</button>
							</div>
						</>
					) : (
						<>
							<Link to="/login" className="nav-link">
								Login
							</Link>
							<Link to="/register" className="btn-primary">
								Sign Up
							</Link>
						</>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					className="mobile-menu-btn"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				>
					{mobileMenuOpen ? "✕" : "☰"}
				</button>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="mobile-menu">
					<Link
						to="/"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-link"
					>
						Projects
					</Link>
					{user ? (
						<>
							{user.role === "admin" && (
								<Link
									to="/admin"
									onClick={() => setMobileMenuOpen(false)}
									className="mobile-link"
								>
									Admin Dashboard
								</Link>
							)}
							<Link
								to="/orders"
								onClick={() => setMobileMenuOpen(false)}
								className="mobile-link"
							>
								My Orders
							</Link>
							{user.role !== "admin" && (
								<Link
									to="/cart"
									onClick={() => setMobileMenuOpen(false)}
									className="mobile-link"
								>
									Cart ({cartCount})
								</Link>
							)}
							<button
								onClick={handleLogout}
								className="mobile-link logout"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								onClick={() => setMobileMenuOpen(false)}
								className="mobile-link"
							>
								Login
							</Link>
							<Link
								to="/register"
								onClick={() => setMobileMenuOpen(false)}
								className="mobile-link"
							>
								Sign Up
							</Link>
						</>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;

