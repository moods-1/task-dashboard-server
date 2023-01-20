const Task = require('../models/Task');
const User = require('../models/User');
const Column = require('../models/Column');
const { tryCatch } = require('../utilities/tryCatch');
const { OK, SUCCESS } = require('../helpers/constants');
const { responseFormatter } = require('../helpers/helperFunctions');

exports.getAllTasksController = tryCatch(async (req, res) => {
	const result = await Task.find();
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.getTaskDetailsController = tryCatch(async (req, res) => {
	const { body: filter } = req;
	const select = 'taskTitle assignee';
	const result = await Task.getTaskDetails(filter, select);
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.updateTaskController = tryCatch(async (req, res) => {
	const { body } = req;
	const result = await Task.updateTask(body);
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.addTaskController = tryCatch(async (req, res) => {
	const { body } = req;
	const result = await Task.addTask(body);
	const response = responseFormatter(OK, SUCCESS, result);
	res.json(response);
});

exports.deleteTaskController = tryCatch(async (req, res) => {
	const { body } = req;
	const { _id: id, assignee, columnId } = body;
	await User.findByIdAndUpdate(assignee, {
		$pull: { assignedTasks: id },
	}).exec();
	await Column.findByIdAndUpdate(columnId, { $pull: { taskIds: id } }).exec();
	await Task.findByIdAndDelete({ _id: id }).exec();
	const response = responseFormatter(OK, 'Task deleted successfully!', {});
	res.json(response);
});
