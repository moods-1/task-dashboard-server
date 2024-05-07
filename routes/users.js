const router = require('express').Router();
const {
	getAllUsersController,
	getUserByIdController,
	getUsersByCompanyController,
	postUserController,
	patchUserController,
	patchLogoutController,
	loginUserController,
} = require('../controllers/usersController');
const auth = require('../middleware/auth');

//GET
router.get('/', auth, getAllUsersController);
router.get('/by/userId/:id', auth, getUserByIdController);
router.get('/by/companyId/:companyId', auth, getUsersByCompanyController);

//POST
router.post('/login', loginUserController);
router.post('/add-user', auth, postUserController);

//PATCH
router.patch('/update-user', auth, patchUserController);
router.patch('/logout-user', auth, patchLogoutController);

module.exports = router;
