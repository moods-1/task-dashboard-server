const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const Column = require('../models/Column');
const { tryCatch } = require('../utilities/tryCatch');
const { OK, SUCCESS, TASK_STATES } = require('../helpers/constants');
const {
	responseFormatter,
	responseCacher,
} = require('../helpers/helperFunctions');

const taskManager = async () => {
	const completeColumnId = '63c16dc19e9fb6a68ff1a4a6';
	const now = new Date().toISOString().split('T')[0];
	const result = await Task.find({ state: TASK_STATES.COMPLETE });
	const update = async (t) => {
		await Task.findByIdAndUpdate({ _id: t._id }, { ...t }).exec();
		await Column.findByIdAndUpdate(
			{ _id: completeColumnId },
			{ $pull: { taskIds: t._id } }
		).exec();
	};

	if (result) {
		result.forEach((t) => {
			const compDate = t.completionDate.toISOString().split('T')[0];
			if (now !== compDate) {
				t.complete = true;
				t.state = TASK_STATES.DONE;
				t.priority = 99;
				update(t);
			}
		});
	}
};

cron.schedule(
	// Run every 5 minutes
	'*/5 * * * *',
	() => {
		console.log('Run cron job.');
		taskManager();
	},
	{
		scheduled: true,
		timezone: 'America/Toronto',
	}
);

exports.getTasksController = tryCatch(async (req, res) => {
	const { done } = req.params;
	let result;
	if (done === 'true') {
		result = await Task.find({ complete: true }).sort({ completionDate: 1 });
	} else {
		result = await Task.find({ complete: false });
	}
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.getTaskDetailsController = tryCatch(async (req, res) => {
	const { body: filter } = req;
	const select = 'taskTitle assignee';
	const result = await Task.getTaskDetails(filter, select);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.updateTaskController = tryCatch(async (req, res) => {
	Task.syncIndexes();
	const { body } = req;
	const result = await Task.updateTask(body);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.addTaskController = tryCatch(async (req, res) => {
	Task.syncIndexes();
	const { body } = req;
	const result = await Task.addTask(body);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
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
	responseCacher(req, res, response);
});

exports.tasksDueSoonController = tryCatch(async (req, res) => {
	const { days } = req.params;
	const result = await Task.dueSoon(days);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});
