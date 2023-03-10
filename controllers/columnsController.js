const Column = require('../models/Column');
const Task = require('../models/Task');
const { tryCatch } = require('../utilities/tryCatch');
const { OK, SUCCESS } = require('../helpers/constants');
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
	// Update task title
	await Task.updateOne(
		{ _id: sourceTaskId },
		{ $set: { state: newState } }
	).exec();
	const response = responseFormatter(OK, SUCCESS, {});
	responseCacher(req, res, response);
});
