const Company = require('../models/Company');
const { OK, SUCCESS } = require('../helpers/constants');
const { tryCatch } = require('../utilities/tryCatch');
const { responseFormatter, storeImage } = require('../helpers/helperFunctions');

exports.getCompaniesController = tryCatch(async (req, res) => {
	const result = await Company.find();
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.getCompanyByIdController = tryCatch(async (req, res) => {
	const { companyId } = req.params;
	const result = await Company.find({companyId});
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.addCompanyController = tryCatch(async (req, res) => {
	const { body } = req;
	if (body.logo) {
		body.logo = await storeImage(body.logo);
	}
	const result = await Company.create(body);
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});
