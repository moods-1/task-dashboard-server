const Column = require('../models/Column');
const Task = require('../models/Task');

exports.getAllColumnsController = async (req, res) => {
	try {
		const columns = await Column.find();
		res.status(200).send(columns);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
};

exports.patchMoveInternalController = async (req, res) => {
	try {
		const { body } = req;
		const result = await Column.moveInternal(body);
		res.status(200).json(result);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
};

exports.patchMoveExternalController = async (req, res) => {
	try {
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
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		res.status(400).send({ msg: error });
	}
};
