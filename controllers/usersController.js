require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { tryCatch } = require('../utilities/tryCatch');
const { OK, SUCCESS, NO_RETURN_OPTIONS } = require('../helpers/constants');
const {
	responseFormatter,
	responseCacher,
	storeImage,
	hashPassword,
} = require('../helpers/helperFunctions');

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.loginUserController = tryCatch(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email }).lean();
	let result = {};
	let response;
	let message;
	if (user) {
		const goodPassword = await bcrypt.compare(password, user.password);
		if (goodPassword) {
			const { _id } = user;
			delete user.password;
			result = { ...user, token: generateToken(_id) };
			await User.updateOne({ _id }, { loggedIn: true });
			response = responseFormatter(OK, SUCCESS, result);
		} else {
			message = 'The password is incorrect.';
			response = responseFormatter(400, message, {});
		}
	} else {
		message = `No user exists with this email: ${em}`;
		response = responseFormatter(400, message, {});
	}
	res.json(response);
});

exports.getAllUsersController = tryCatch(async (req, res) => {
	User.syncIndexes();
	const result = await User.find({}, NO_RETURN_OPTIONS).sort({ firstName: 1 });
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.getUsersByCompanyController = tryCatch(async (req, res) => {
	const { companyId } = req.params;
	const result = await User.find({ companyId }, NO_RETURN_OPTIONS).sort({
		firstName: 1,
	});
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.getUserByIdController = tryCatch(async (req, res) => {
	const { id } = req.params;
	const result = await User.findById(id, NO_RETURN_OPTIONS);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.postUserController = tryCatch(async (req, res) => {
	const { body } = req;
	const { image, password } = body;
	body.image = await storeImage(image, 'dashboard');
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error('An account with that email exists already.');
	}
	body.password = await hashPassword(password);
	body.loggedIn = true;
	const result = await User.create(body);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.patchUserController = tryCatch(async (req, res) => {
	const { body } = req;
	const { password, _id } = body;
	if (body.newImage) {
		const { image } = body;
		body.image = await storeImage(image, 'dashboard');
	}
	if (password) {
		body.password = await hashPassword(password);
	}
	delete body.newImage;
	const result = await User.findOneAndUpdate(
		{ _id },
		{ $set: { ...body } },
		{ fields: NO_RETURN_OPTIONS, new: true }
	);
	let response;
	if ('firstName' in result) {
		response = responseFormatter(OK, SUCCESS, result);
		responseCacher(req, res, response);
	} else {
		response = responseFormatter(OK, 'No changes made.', {});
		responseCacher(req, res, response);
	}
});

exports.patchLogoutController = tryCatch(async (req, res) => {
	const { body } = req;
	const { id } = body;
	const result = await User.findOneAndUpdate(
		{ _id: id },
		{ loggedIn: false },
		{ returnOriginal: false }
	);
	let response;
	if ('firstName' in result) {
		response = responseFormatter(OK, SUCCESS, result);
		res.json(response);
	} else {
		response = responseFormatter(OK, 'No changes made.', {});
		responseCacher(req, res, response);
	}
});
