const router = require('express').Router();
const {
	getAllTasksController,
	updateTaskController,
	addTaskController,
	deleteTaskController,
	getTaskDetailsController,
} = require('../controllers/tasksController');

//GET
router.get('/', getAllTasksController);
router.get('/details', getTaskDetailsController);

//PATCH
router.patch('/', updateTaskController);

//POST
router.post('/', addTaskController);

//DELETE
router.delete('/', deleteTaskController);

module.exports = router;
