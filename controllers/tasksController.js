const Task = require('../models/Task');
const User = require('../models/User');
const Column = require('../models/Column');
const { tryCatch } = require('../utilities/tryCatch');

exports.getAllTasksController = tryCatch(async (req, res) => {
	const tasks = await Task.find();
	res.status(200).json(tasks);
});

exports.updateTaskController = tryCatch(async (req, res) => {
	const { body } = req;
	const result = await Task.updateTask(body);
	res.status(200).json(result);
});

exports.addTaskController = tryCatch(async (req, res) => {
	const { body } = req;
	const result = await Task.updateTask(body);
	res.status(200).json(result);
});

exports.deleteTaskController = tryCatch(async (req, res) => {
	const { body } = req;
	const { _id: id, assignee, columnId } = body;
	await User.findByIdAndUpdate(assignee, {
		$pull: { assignedTasks: id },
	}).exec();
	await Column.findByIdAndUpdate(columnId, { $pull: { taskIds: id } }).exec();
	await Task.findByIdAndDelete({ _id: id }).exec();
	res.status(200).json({ message: 'Task deleted successfully!' });
});
