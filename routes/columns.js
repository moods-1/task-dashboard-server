const express = require('express');
const router = express.Router();
const Column = require('../models/Column');
const Task = require('../models/Task');

//GET
router.get('/', async (req, res, next) => {
	try {
		const columns = await Column.findAllColumns();
		res.status(200).send(columns);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
});

//PATCH
router.patch('/move-internal', async (req, res, next) => {
	try {
		const { body } = req;
		const result = await Column.moveInternal(body);
		res.status(200).json(result);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
});

router.patch('/move-external', async (req, res, next) => {
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
});

module.exports = router;
