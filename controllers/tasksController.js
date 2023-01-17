const Task = require('../models/Task');
const User = require('../models/User');
const Column = require('../models/Column');

exports.getAllTasksController = async (req, res) => {
	try {
		const tasks = await Task.find();
		res.status(200).json(tasks);
	} catch (error) {
		res.status(400).json({ msg: error });
	}
};

exports.updateTaskController = async (req, res) => {
	try {
		const { body } = req;
		const result = await Task.updateTask(body);
		res.status(200).json(result);
	} catch (error) {
		res.status(400).json(error);
	}
};

exports.addTaskController = async (req, res) => {
	try {
		const { body } = req;
		const result = await Task.updateTask(body);
		res.status(200).json(result);
	} catch (error) {
		res.status(400).json(error);
	}
};

exports.deleteTaskController = async (req, res) => {
	try {
		const { body } = req;
		const { _id: id, assignee, columnId } = body;
		await User.findByIdAndUpdate(assignee, {
			$pull: { assignedTasks: id },
		}).exec();
		await Column.findByIdAndUpdate(columnId, { $pull: { taskIds: id } }).exec();
		await Task.findByIdAndDelete({ _id: id }).exec();
		res.status(200).json({ message: 'Task deleted successfully!' });
	} catch (error) {
		res.status(400).json(error);
	}
};
