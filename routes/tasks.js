const router = require('express').Router();
const {
	getAllTasksController,
	updateTaskController,
	addTaskController,
	deleteTaskController,
} = require('../controllers/tasksController');

//GET
router.get('/', getAllTasksController);

//PATCH
router.patch('/', updateTaskController);

//POST
router.post('/', addTaskController);

//DELETE
router.delete('/', deleteTaskController);

module.exports = router;
