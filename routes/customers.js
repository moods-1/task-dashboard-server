const router = require('express').Router();
const {
	getCustomersController,
	getCustomerByIdController,
	addCustomerController,
	patchCustomerController,
	topCustomersController,
} = require('../controllers/customersController');
const auth = require('../middleware/auth');

// GET
router.get('/', getCustomersController);
router.get('/by/customerId/:customerId', getCustomerByIdController);
router.get('/top-by-licenses', topCustomersController);

// PATCH
router.patch('/update-customer', auth, patchCustomerController);

// POST
router.post('/add-customer', addCustomerController);

module.exports = router;
