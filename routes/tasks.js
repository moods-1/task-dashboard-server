const router = require('express').Router();
const {
	getAllTasksController,
	updateTaskController,
	addTaskController,
	deleteTaskController,
	getTaskDetailsController,
	tasksDueSoonController,
} = require('../controllers/tasksController');

//GET
router.get('/', getAllTasksController);
router.get('/details', getTaskDetailsController);
router.get('/tasks-due-soon/:days', tasksDueSoonController);

//PATCH
router.patch('/', updateTaskController);

//POST
router.post('/', addTaskController);

//DELETE
router.delete('/', deleteTaskController);

module.exports = router;
