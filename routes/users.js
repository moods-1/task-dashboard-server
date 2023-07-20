const router = require('express').Router();
const {
	getAllUsersController,
	getUserByIdController,
	getUsersByCompanyController,
	postUserController,
	patchUserController,
	loginUserController,
} = require('../controllers/usersController');
const auth  = require('../middleware/auth');

//GET
router.get('/', auth, getAllUsersController);
router.get('/:id', auth, getUserByIdController);
router.get('/by/companyId/:companyId', auth, getUsersByCompanyController);

//POST
router.post('/login', loginUserController);
router.post('/add-user', auth, postUserController);

//PATCH
router.patch('/update-user', auth, patchUserController);

module.exports = router;
