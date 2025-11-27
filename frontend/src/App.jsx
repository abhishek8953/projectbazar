import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider, ProtectedRoute } from "./store/Auth";
import Navbar from "./components/Navbar";
import HomePage from "./components/Homepage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import CartPage from "./components/CartPage";
import OrdersPage from "./components/Orderpage";
import AdminDashboard from "./components/AdminDashboard";
import AdminProjects from "./components/AdminProject";
import AdminOrders from "./components/AdminOrders";
import NotFound from "./components/Notfound";

const API_URL = import.meta.env.VITE_API_URL;

// Auth Context

// Main App Component
function App() {
	return (
		<Router>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</Router>
	);
}

// App Content Component
const AppContent = () => {
	const [projects, setProjects] = useState([]);
	const [cart, setCart] = useState([]);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const fetchProjects = async () => {
		try {
			const res = await fetch(`${API_URL}/projects`);
			const data = await res.json();
			setProjects(data.projects || []);
		} catch (err) {
			console.error("Error fetching projects:", err);
		}
	};

	useEffect(() => {
		async function load() {
			fetchProjects();
		}

		load();
	}, []);

	const addToCart = (project) => {
		if (!cart.find((item) => item._id === project._id)) {
			setCart([...cart, project]);
			alert("Added to cart!");
		} else {
			alert("Already in cart!");
		}
	};

	const removeFromCart = (projectId) => {
		setCart(cart.filter((item) => item._id !== projectId));
	};

	return (
		<div className="App">
			<Navbar
				cartCount={cart.length}
				mobileMenuOpen={mobileMenuOpen}
				setMobileMenuOpen={setMobileMenuOpen}
			/>

			<main className="main-content">
				<Routes>
					<Route
						path="/"
						element={
							<HomePage
								projects={projects}
								addToCart={addToCart}
							/>
						}
					/>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					{/* Protected Routes */}
					<Route
						path="/cart"
						element={
							<ProtectedRoute>
								<CartPage
									cart={cart}
									removeFromCart={removeFromCart}
								/>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/orders"
						element={
							<ProtectedRoute>
								<OrdersPage />
							</ProtectedRoute>
						}
					/>

					{/* Admin Protected Routes */}
					<Route
						path="/admin"
						element={
							<ProtectedRoute adminOnly={true}>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/projects"
						element={
							<ProtectedRoute adminOnly={true}>
								<AdminProjects fetchProjects={fetchProjects} />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/orders"
						element={
							<ProtectedRoute adminOnly={true}>
								<AdminOrders />
							</ProtectedRoute>
						}
					/>

					{/* 404 Route */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
		</div>
	);
};

// Navbar Component with React Router

// Home Page Component

// Project Card Component

// Login Page Component

// Register Page Component

// Cart Page Component

// Admin Dashboard Component

// Admin Projects Component

// Project Form Modal

// Project Edit Modal

// Admin Orders Component

// Orders Page Component

// 404 Not Found Component

export default App;
