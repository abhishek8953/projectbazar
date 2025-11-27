// routes/projects.js
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const Project = require("../models/Project");
const {
	uploadProjectFiles,
	uploadToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get("/", async (req, res) => {
	try {
		const { category, search, minPrice, maxPrice } = req.query;

		// Build query
		let query = { isActive: true };

		if (category && category !== "all") {
			query.category = category;
		}

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number(minPrice);
			if (maxPrice) query.price.$lte = Number(maxPrice);
		}

		const projects = await Project.find(query)
			.sort({ createdAt: -1 })
			.select("-__v");

		res.status(200).json({
			success: true,
			count: projects.length,
			projects,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Error fetching projects",
			error: err.message,
		});
	}
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get("/:id", async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		res.status(200).json({
			success: true,
			project,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Error fetching project",
			error: err.message,
		});
	}
});

// @route   POST /api/projects
// @desc    Create a new project with file uploads
// @access  Private/Admin
router.post(
	"/upload",
	protect,
	authorize("admin"),
	uploadProjectFiles,
	async (req, res) => {
		console.log("hello");
		try {
			const { title, description, category, price, tags } = req.body;

			// Validate required fields
			if (!title || !description || !category || !price) {
				return res.status(400).json({
					success: false,
					message: "Please provide all required fields",
				});
			}

			// Check if all files are provided
			if (
				!req.files ||
				!req.files.report ||
				!req.files.ppt ||
				!req.files.code
			) {
				return res.status(400).json({
					success: false,
					message:
						"Please upload all three files (report, ppt, code)",
				});
			}

			// Upload files to Cloudinary
			let reportUrl, pptUrl, codeUrl;

			try {
				function getExtension(req) {
					let arr = req.originalname.split(".");
					let length = arr.length - 1;
					 let extension = arr[length];
           return extension;
				}

				// Upload all files in parallel
				const [reportResult, pptResult, codeResult] = await Promise.all(
					[
						uploadToCloudinary(
							req.files.report[0].buffer,
							"reports",
							"report",
              getExtension(req.files.report[0])
						),
						uploadToCloudinary(
							req.files.ppt[0].buffer,
							"presentations",
							"ppt",
               getExtension(req.files.ppt[0])
						),
						uploadToCloudinary(
							req.files.code[0].buffer,
							"source-code",
							"code",
               getExtension(req.files.code[0])
						),
					]
				);

				reportUrl = reportResult;
				pptUrl = pptResult;
				codeUrl = codeResult;
			} catch (uploadErr) {
				console.error("Cloudinary Upload Error:", uploadErr);
				return res.status(500).json({
					success: false,
					message: "Failed to upload files to Cloudinary",
					error: uploadErr.message,
				});
			}

			// Create project with uploaded URLs
			const project = await Project.create({
				title,
				description,
				category,
				price: Number(price),
				fileUrls: {
					report: reportUrl,
					ppt: pptUrl,
					code: codeUrl,
				},
				tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
				createdBy: req.user.id,
			});

			res.status(201).json({
				success: true,
				message: "Project uploaded successfully",
				project,
			});
		} catch (err) {
			console.error("Project Creation Error:", err);
			res.status(500).json({
				success: false,
				message: "Error creating project",
				error: err.message,
			});
		}
	}
);

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req, res) => {
	try {
		let project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		project = await Project.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			project,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Error updating project",
			error: err.message,
		});
	}
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project (soft delete)
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Delete files from Cloudinary if they exist
		if (project.cloudinaryIds) {
			if (project.cloudinaryIds.report) {
				await deleteFromCloudinary(project.cloudinaryIds.report);
			}
			if (project.cloudinaryIds.ppt) {
				await deleteFromCloudinary(project.cloudinaryIds.ppt);
			}
			if (project.cloudinaryIds.code) {
				await deleteFromCloudinary(project.cloudinaryIds.code);
			}
		}

		// Soft delete - set isActive to false
		project.isActive = false;
		await project.save();

		res.status(200).json({
			success: true,
			message: "Project deleted successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Error deleting project",
			error: err.message,
		});
	}
});

module.exports = router;
