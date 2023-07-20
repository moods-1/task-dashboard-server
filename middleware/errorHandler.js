const { FAILED } = require('../helpers/constants');
exports.errorHandler = (error, req, res, next) => {
	const status = res.statusCode ? res.statusCode : 500;
	const message = error.message || FAILED;
	res.json({ status, message, response: null });
};
