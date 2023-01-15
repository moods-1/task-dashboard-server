const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

//GET
router.get('/', async (req, res, next) => {
	try {
		const tasks = await Task.findAllTasks();
		res.status(200).send(tasks);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
});

router.get('/task-by-field-and-value/:fieldValue', async (req, res, next) => {
	try {
		const { fieldValue } = req.params;
		const [field, value] = fieldValue.split(',');
		const result = await Task.findByFieldAndValue(field, value.toLowerCase());
		res.status(201).json(result);
	} catch (error) {
		res.status(400).json(error);
	}
});

//PATCH
router.patch('/', async (req, res, next) => {
	try {
		const { body } = req;
		const result = await Task.updateTask(body);
		res.status(200).json(result);
	} catch (error) {
		res.status(400).json(error);
	}
});

//POST
router.post('/', async (req, res, next) => {
	try {
		const { body } = req;
		const result = await Task.addTask(body);
		res.status(200).json(result);
	} catch (error) {
		res.status(400).json(error);
	}
});

module.exports = router;
