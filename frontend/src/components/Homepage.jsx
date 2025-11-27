import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProjectCard from "./Projectcard";

 

const HomePage = ({ projects, addToCart }) => {
	console.log("Homepage");
	const { user } = useAuth();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const categories = ["all", "Mini", "Medium", "Major"];

	const filteredProjects = projects.filter((project) => {
		const matchesSearch =
			project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === "all" || project.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const handleAddToCart = (project) => {
		if (!user) {
			navigate("/login");
			return;
		}
		if (user.role === "admin") {
			alert("Admin cannot add items to cart");
			return;
		}
		addToCart(project);
	};

	return (
		<div className="home-page">
			{/* Hero Section */}
			<div className="hero-section">
				<h1>Premium Academic Projects</h1>
				<p>
					Get complete project source code, reports, and presentations
					for BCA, MCA & B.Tech
				</p>
				<div className="hero-features">
					<div className="feature-item">
						<span>🔒</span>
						<span>100% Secure Payment</span>
					</div>
					<div className="feature-item">
						<span>⚡</span>
						<span>Instant Download</span>
					</div>
					<div className="feature-item">
						<span>⭐</span>
						<span>Premium Quality</span>
					</div>
				</div>
			</div>

			{/* Search and Filter */}
			<div className="search-filter-section">
				<div className="search-box">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.35-4.35"></path>
					</svg>
					<input
						type="text"
						placeholder="Search projects by title or description..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="filter-buttons">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setSelectedCategory(cat)}
							className={`filter-btn ${
								selectedCategory === cat ? "active" : ""
							}`}
						>
							{cat === "all" ? "All" : cat}
						</button>
					))}
				</div>
			</div>

			{/* Projects Grid */}
			<div className="projects-grid">
				{filteredProjects.map((project) => (
					<ProjectCard
						key={project._id}
						project={project}
						onAddToCart={handleAddToCart}
					/>
				))}
			</div>

			{filteredProjects.length === 0 && (
				<div className="no-projects">
					<svg
						width="64"
						height="64"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<polyline points="16 18 22 12 16 6"></polyline>
						<polyline points="8 6 2 12 8 18"></polyline>
					</svg>
					<h3>No projects found</h3>
					<p>Try adjusting your search or filter criteria</p>
				</div>
			)}
		</div>
	);
};

export default HomePage;
