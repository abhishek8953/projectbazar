import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Sample project data for demonstration
const sampleProject = {
	_id: "1",
	title: "E-Commerce Website with React & Node.js",
	description:
		"A comprehensive e-commerce platform built using the MERN stack. This project includes user authentication, product management, shopping cart functionality, payment gateway integration with Razorpay, order tracking, and an admin dashboard for managing products and orders.\n\nFeatures include responsive design, real-time inventory updates, email notifications, and secure payment processing. Perfect for final year projects or portfolio demonstrations.",
	category: "Major",
	price: 2499,
	tags: ["React", "Node.js", "MongoDB", "E-commerce", "Full-Stack"],
	isActive: true,
	createdAt: "2024-10-15T10:30:00.000Z",
	updatedAt: "2024-11-20T14:20:00.000Z",
	fileUrls: {
		report: "https://example.com/report.pdf",
		ppt: "https://example.com/presentation.pptx",
		code: "https://example.com/code.zip",
	},
};

const sampleRecommendations = [
	{
		_id: "2",
		title: "Restaurant Management System",
		category: "Major",
		price: 2299,
	},
];

const ProjectDetail = ({ addToCart }) => {
	const API_URL = import.meta.env.VITE_API_URL;
	const [project, setProjects] = useState([]);
	const [recommendations, setRecomendation] = useState([]);
	const [selectedTab, setSelectedTab] = useState("description");
	const [addedToCart, setAddedToCart] = useState(false);
	const { id } = useParams();
	const [loader, setLoder] = useState(false);

	const { user } = useAuth();
	const navigate = useNavigate();
	const total = project.price;
	// 🔒 Debounce / cooldown reference
	const checkoutCooldown = useRef(false);

	const handleCheckout = async () => {
		// ⛔ Prevent multiple calls within 10 sec
		if (checkoutCooldown.current) {
			// alert("Please wait 10 seconds before trying again.");
			return;
		}

		// 🔒 Start cooldown
		checkoutCooldown.current = true;
		setTimeout(() => {
			checkoutCooldown.current = false;
		}, 10000); // 10 seconds

		if (!project) {
			alert("not selected project");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${API_URL}/payments/create-order`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					projects: [project._id],
					amount: total,
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Failed to create order");
			}

			const data = await res.json();

			const options = {
				key:
					import.meta.env.VITE_RAZORPAY_KEY_ID ||
					"rzp_test_xxxxxxxxxx",
				amount: data.amount,
				currency: "INR",
				name: "ProjectBazar",
				description: "Project Purchase",
				order_id: data.orderId,
				handler: async function (response) {
					try {
						const verifyRes = await fetch(
							`${API_URL}/payments/verify`,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${token}`,
								},
								body: JSON.stringify(response),
							}
						);

						const verifyData = await verifyRes.json();
						if (verifyData.success) {
							alert("Payment successful! Check your orders.");
							navigate("/orders");
						} else {
							alert("Payment verification failed");
						}
					} catch (err) {
						alert("Payment verification failed: " + err.message);
					}
				},
				prefill: {
					name: user.name,
					email: user.email,
				},
				theme: {
					color: "#4F46E5",
				},
			};

			const rzp = new window.Razorpay(options);
			rzp.open();
		} catch (err) {
			alert("Checkout failed: " + err.message);
		}
	};

	useEffect(() => {
		setLoder(true);
		async function getData() {
			Promise.all([
				fetch(`${API_URL}/projects/${id}`),
				fetch(`${API_URL}/projects`),
			])
				.then(async ([usersProject, projectsRes]) => {
					const project = await usersProject.json();
					setProjects(project.project);
					const projects = await projectsRes.json();

					const filteredProject = projects.projects.map((p) => {
						return {
							_id: p._id,
							title: p.title,
							category: p.category,
							price: p.price,
						};
					});

					setRecomendation(filteredProject);
				})
				.catch((err) => {
					console.error("Error fetching APIs:", err);
				})
				.finally(() => {
					setTimeout(() => {
						setLoder(false);
					}, 50);
				});
		}
		getData();
	}, [id]);

	const handleAddToCart = () => {
		setAddedToCart(true);
		addToCart(project); //hello
		setTimeout(() => setAddedToCart(false), 3000);
	};

	const handleBuyNow = () => {
		handleCheckout();
	};

	if (loader) return <h1> Loading</h1>;
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Main Product Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white rounded-lg shadow-sm">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 lg:p-8">
						{/* Left: Product Image/Icon */}
						<div className="lg:col-span-1">
							<div className="sticky top-8">
								<div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg p-12 flex items-center justify-center mb-4">
									<svg
										className="w-32 h-32 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="1.5"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<div className="flex gap-2">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
										{project?.category}
									</span>
									{project.isActive && (
										<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
											Available
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Middle: Product Details */}
						<div className="lg:col-span-1">
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
								{project.title}
							</h1>

							<div className="flex items-baseline gap-4 mb-6">
								<span className="text-3xl sm:text-4xl font-bold text-gray-900">
									₹{project.price}
								</span>
								<span className="text-sm text-gray-500">
									Inclusive of all taxes
								</span>
							</div>

							{/* Tags */}
							{project.tags && project.tags.length > 0 && (
								<div className="mb-6">
									<h3 className="text-sm font-medium text-gray-900 mb-2">
										Tags:
									</h3>
									<div className="flex flex-wrap gap-2">
										{project.tags.map((tag, idx) => (
											<span
												key={idx}
												className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
											>
												#{tag}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Key Features */}
							<div className="mb-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									What's Included:
								</h3>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="text-gray-700">
											Complete Project Report
										</span>
									</li>
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="text-gray-700">
											PowerPoint Presentation
										</span>
									</li>
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="text-gray-700">
											Source Code & Documentation
										</span>
									</li>
									<li className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="text-gray-700">
											Instant Digital Download
										</span>
									</li>
								</ul>
							</div>
						</div>

						{/* Right: Purchase Box */}
						<div className="lg:col-span-1">
							<div className="border border-gray-200 rounded-lg p-6 lg:sticky lg:top-8">
								<div className="mb-6">
									<div className="flex items-center gap-2 text-green-600 mb-2">
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="font-medium">
											In Stock
										</span>
									</div>
									<p className="text-sm text-gray-600">
										Download immediately after purchase
									</p>
								</div>

								<div className="space-y-3 mb-6">
									<button
										onClick={handleAddToCart}
										className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
											addedToCart
												? "bg-green-100 text-green-700"
												: "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
										}`}
									>
										{addedToCart
											? "✓ Added to Cart"
											: "Add to Cart"}
									</button>
									<button
										onClick={handleBuyNow}
										className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
									>
										Buy Now
									</button>
								</div>

								<div className="border-t border-gray-200 pt-4 space-y-3 text-sm text-gray-600">
									<div className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-gray-400 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										</svg>
										<span>Secure transaction</span>
									</div>
									<div className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-gray-400 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
										<span>
											Your payment information is
											protected
										</span>
									</div>
									<div className="flex items-start gap-2">
										<svg
											className="w-5 h-5 text-gray-400 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
											/>
										</svg>
										<span>
											Instant download after payment
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Tabs Section */}
					<div className="border-t border-gray-200">
						<div className="px-6 lg:px-8">
							<div className="flex gap-4 sm:gap-8 border-b border-gray-200 overflow-x-auto">
								<button
									onClick={() =>
										setSelectedTab("description")
									}
									className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
										selectedTab === "description"
											? "border-indigo-600 text-indigo-600"
											: "border-transparent text-gray-500 hover:text-gray-700"
									}`}
								>
									Description
								</button>
								<button
									onClick={() => setSelectedTab("details")}
									className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
										selectedTab === "details"
											? "border-indigo-600 text-indigo-600"
											: "border-transparent text-gray-500 hover:text-gray-700"
									}`}
								>
									Project Details
								</button>
							</div>

							<div className="py-6">
								{selectedTab === "description" && (
									<div className="prose max-w-none">
										<p className="text-gray-700 leading-relaxed whitespace-pre-line">
											{project.description}
										</p>
									</div>
								)}
								{selectedTab === "details" && (
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<div>
											<h3 className="text-sm font-medium text-gray-900 mb-2">
												Category
											</h3>
											<p className="text-gray-700">
												{project.category} Project
											</p>
										</div>
										<div>
											<h3 className="text-sm font-medium text-gray-900 mb-2">
												Created
											</h3>
											<p className="text-gray-700">
												{new Date(
													project.createdAt
												).toLocaleDateString()}
											</p>
										</div>
										<div>
											<h3 className="text-sm font-medium text-gray-900 mb-2">
												Last Updated
											</h3>
											<p className="text-gray-700">
												{new Date(
													project.updatedAt
												).toLocaleDateString()}
											</p>
										</div>
										<div>
											<h3 className="text-sm font-medium text-gray-900 mb-2">
												Status
											</h3>
											<p className="text-gray-700">
												{project.isActive
													? "Active & Available"
													: "Inactive"}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Recommendations Section */}
				<div className="mt-12">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						Similar Projects You May Like
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{recommendations.map((rec) => (
							<div
								key={rec._id}
								onClick={() => navigate(`/projects/${rec._id}`)}
								className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
							>
								<div className="bg-linear-to-br from-indigo-400 to-purple-500 h-48 flex items-center justify-center">
									<svg
										className="w-20 h-20 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="1.5"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<div className="p-4">
									<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
										{rec.title}
									</h3>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500">
											{rec.category}
										</span>
										<span className="font-bold text-gray-900">
											₹{rec.price}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectDetail;
