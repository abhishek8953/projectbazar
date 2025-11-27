// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload a file to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, fileName = "",extension) => {
	return new Promise((resolve, reject) => {
    let k="";
     if(extension=="pptx"){
      k=".pptx";
     }
     else{
      k="";
     }
    
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: `project-marketplace/${folder}`,
				resource_type: "raw",
				public_id: `${Date.now()}_${fileName}${k}`,
			},
			(error, result) => {
				if (error) {
					console.error("Upload stream error:", error);
					reject(error);
				} else {
					resolve(result.secure_url);
				}
			}
		);

		uploadStream.on("error", (error) => {
			console.error("Stream error:", error);
			reject(error);
		});

		uploadStream.end(fileBuffer);
	});
};

// Helper function to delete a file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
	try {
		await cloudinary.uploader.destroy(publicId);
		console.log(`Deleted: ${publicId}`);
		return true;
	} catch (error) {
		console.error("Error deleting from Cloudinary:", error);
		return false;
	}
};

// Multer configuration for in-memory storage
const uploadProjectFiles = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 50 * 1024 * 1024, // 50MB per file
	},
	fileFilter: (req, file, cb) => {
		const allowedMimes = {
			report: ["application/pdf"],
			ppt: [
				"application/vnd.ms-powerpoint",
				"application/vnd.openxmlformats-officedocument.presentationml.presentation",
				"application/octet-stream",
				"application/zip",
				"application/x-zip-compressed",
				"application/wps-office.pptx", // <-- ADD THIS
				"application/wps-office.ppt", // <-- Optional
			],

			code: [
				"application/zip",
				"application/x-zip-compressed",
				"application/x-rar-compressed",
			],
		};

	

		const fieldName = file.fieldname;
		const mimes = allowedMimes[fieldName] || [];

		
		if (mimes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error(`Invalid file type for ${fieldName}`));
		}
	},
}).fields([
	{ name: "report", maxCount: 1 },
	{ name: "ppt", maxCount: 1 },
	{ name: "code", maxCount: 1 },
]);

module.exports = {
	cloudinary,
	uploadProjectFiles,
	uploadToCloudinary,
	deleteFromCloudinary,
};
