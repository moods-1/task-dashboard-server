const Column = require('../models/Column');
const Task = require('../models/Task');
const { tryCatch } = require('../utilities/tryCatch');
<<<<<<< HEAD
const { OK, SUCCESS, TASK_STATES } = require('../helpers/constants');
=======
const { OK, SUCCESS } = require('../helpers/constants');
>>>>>>> e1a8a88b91425d0de492c247dd5dcdbd80913118
const {
	responseFormatter,
	responseCacher,
} = require('../helpers/helperFunctions');

exports.getAllColumnsController = tryCatch(async (req, res) => {
	const result = await Column.find();
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.patchMoveInternalController = tryCatch(async (req, res) => {
	const { body } = req;
	const result = await Column.moveInternal(body);
	const response = responseFormatter(OK, SUCCESS, result);
	responseCacher(req, res, response);
});

exports.patchMoveExternalController = tryCatch(async (req, res) => {
	const {
		sourceTaskId,
		sourceIndex,
		sourceId,
		destinationIndex,
		destinationId,
	} = req.body;
	// Handle source column
	const sourceColumn = await Column.findById(sourceId);
	sourceColumn.taskIds.splice(sourceIndex, 1);
	sourceColumn.save();
	// Handle destination column
	const destinationColumn = await Column.findById(destinationId);
	const newState = destinationColumn.title;
	destinationColumn.taskIds.splice(destinationIndex, 0, sourceTaskId);
	destinationColumn.save();
	// Update task
	let compDate = '';
	if (newState === TASK_STATES.COMPLETE) {
		compDate = new Date();
	}
	await Task.updateOne(
		{ _id: sourceTaskId },
		{ $set: { state: newState, completionDate: compDate } }
	).exec();
	const response = responseFormatter(OK, SUCCESS, {});
	responseCacher(req, res, response);
});
