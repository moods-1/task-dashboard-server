const router = require('express').Router();
const {
	getAllUsersController,
	getUserByIdController,
	postUserController,
	patchUserController,
} = require('../controllers/usersController');

//GET
router.get('/', getAllUsersController);

router.get('/:id', getUserByIdController);

//POST
router.post('/', postUserController);

//PATCH
router.patch('/', patchUserController);

module.exports = router;
