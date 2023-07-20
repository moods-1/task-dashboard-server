const router = require('express').Router();
const {
	getTasksController,
	getCompanyTasksController,
	updateTaskController,
	addTaskController,
	deleteTaskController,
	getTaskDetailsController,
	tasksDueSoonController,
} = require('../controllers/tasksController');
const auth = require('../middleware/auth');

//GET
router.get('/:done', auth, getTasksController);
router.get('/by/companyId/:done/:companyId', auth, getCompanyTasksController);
router.get('/details', auth, getTaskDetailsController);
router.get('/tasks-due-soon/:days/:companyId', auth, tasksDueSoonController);
router.get('/by/companyId/:companyId', auth, getCompanyTasksController);

//PATCH
router.patch('/', auth, updateTaskController);
//POST
router.post('/', auth, addTaskController);
//DELETE
router.delete('/', auth, deleteTaskController);

module.exports = router;
