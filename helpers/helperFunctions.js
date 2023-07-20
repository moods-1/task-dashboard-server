const { v2 } = require('cloudinary');
const bcrypt = require('bcryptjs');
const Task = require('../models/Task');

v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.responseFormatter = (status, message, response) => ({
	status,
	message,
	response,
});

exports.responseCacher = (req, res, data) => {
	const type = req.method;
	if (type === 'GET') {
		return res
			.set('Cache-control', 'must-revalidate', 'public, max-age=86400')
			.json(data);
	}
	return res.json(data);
};

exports.updateMovedTask = async (taskId, mover) => {
	await Task.findByIdAndUpdate(
		{ _id: taskId },
		{ $set: { lastMovedBy: { ...mover, date: new Date() } } }
	);
};

exports.storeImage = async (data) => {
	const img = await v2.uploader.upload(data);
	return img.url;
};

exports.hashPassword = async (data) => {
	return await bcrypt.hashSync(data, 8);
}