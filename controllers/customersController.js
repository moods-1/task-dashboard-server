const Customer = require('../models/Customer');
const { OK, SUCCESS } = require('../helpers/constants');
const { tryCatch } = require('../utilities/tryCatch');
const { responseFormatter, storeImage } = require('../helpers/helperFunctions');

exports.getCustomersController = tryCatch(async (req, res) => {
	const result = await Customer.find();
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.getCustomerByIdController = tryCatch(async (req, res) => {
	const { customerId } = req.params;
	const result = await Customer.findById(customerId);
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.addCustomerController = tryCatch(async (req, res) => {
	const { body } = req;
	if (body.logo) {
		body.logo = await storeImage(body.logo, 'dashboard');
	}
	const result = await Customer.create(body);
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.patchCustomerController = tryCatch(async (req, res) => {
	const { body } = req;
	const { _id: id, newLogo, logo } = body;
	if (newLogo) {
		body.logol = await storeImage(logo, 'dashboard');
	}
	delete body.newLogo;
	const result = await Customer.findOneAndUpdate({ _id: id }, body, {
		returnOriginal: false,
	});
	let response;
	if ('customerName' in result) {
		response = responseFormatter(OK, SUCCESS, result);
		res.json(response);
	} else {
		response = responseFormatter(OK, 'No changes made.', {});
		res.json(response);
	}
});

exports.topCustomersController = tryCatch(async (req, res) => {
	const result = await Customer.find().sort({ licensesPurchased: -1 }).limit(3);
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});
