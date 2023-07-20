require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { tryCatch } = require('../utilities/tryCatch');
const { OK, SUCCESS } = require('../helpers/constants');
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
	const { email: em, password } = req.body;
	const user = await User.findOne({ email: em });
	let result = {};
	let response;
	let message;
	if (user) {
		const goodPassword = await bcrypt.compare(password, user.password);
		if (goodPassword) {
			const { firstName, lastName, email, phoneNumber, image, _id, companyId, roles } =
				user;
			result = {
				firstName,
				lastName,
				email,
				phoneNumber,
				image,
				_id,
				companyId,
				roles,
				token: generateToken(_id),
			};
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
	const result = await User.find({}, { password: 0, joinDate: 0 });
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.getUsersByCompanyController = tryCatch(async (req, res) => {
	const { companyId } = req.params;
	const result = await User.find({ companyId }, { password: 0, joinDate: 0 });
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.getUserByIdController = tryCatch(async (req, res) => {
	const { id } = req.params;
	const result = await User.findById(id);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.postUserController = tryCatch(async (req, res) => {
	const { body } = req;
	const { image, password } = body;
	const imageUrl = await storeImage(image);
	body.image = imageUrl.url;
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error('An account with that email exists already.');
	}
	body.password = await hashPassword(password);
	const result = await User.addUser(body);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.patchUserController = tryCatch(async (req, res) => {
	const { body } = req;
	const { password } = body;
	if (body.newImage) {
		const { image } = body;
		const imageUrl = await storeImage(image);
		body.image = imageUrl.url;
	}
	if (password) {
		body.password = await hashPassword(password);
	}
	delete body.newImage;
	const result = await User.updateUser(body);
	let response;
	if ('firstName' in result) {
		response = responseFormatter(OK, SUCCESS, result);
		responseCacher(req, res, response);
	} else {
		response = responseFormatter(OK, 'No changes made.', {});
		responseCacher(req, res, response);
	}
});
