


const ProjectCard = ({ project, onAddToCart }) => {
	console.log("Project card add link to another page TODO??");
	return (
		<div className="project-card">
			<div className="project-image">
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
			</div>
			<div className="project-content">
				<div className="project-header">
					<span className="category-badge">{project.category}</span>
					<div className="rating">
						<span>⭐</span>
						<span>4.8</span>
					</div>
				</div>
				<h3 className="project-title">{project.title}</h3>
				<p className="project-description">{project.description}</p>
				<div className="project-footer">
					<div className="price">₹{project.price}</div>
					<button
						onClick={() => onAddToCart(project)}
						className="btn-add-cart"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);

};

export default ProjectCard;

