const router = require('express').Router();
const {
	getCompaniesController,
	getCompanyByIdController,
	addCompanyController,
} = require('../controllers/companiesController');

// GET
router.get('/', getCompaniesController);
router.get('/by/companyId/:companyId', getCompanyByIdController);

// POST
router.post('/add-company', addCompanyController);

module.exports = router;
