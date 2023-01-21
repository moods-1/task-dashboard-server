const User = require('../models/User');
const { tryCatch } = require('../utilities/tryCatch');
const { OK, SUCCESS } = require('../helpers/constants');
const {
	responseFormatter,
	responseCacher,
} = require('../helpers/helperFunctions');

exports.getAllUsersController = tryCatch(async (req, res, next) => {
	const result = await User.find();
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
	const result = await User.addUser(body);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.patchUserController = tryCatch(async (req, res) => {
	const { body } = req;
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
