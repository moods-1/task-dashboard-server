const express = require('express');
const router = express.Router();
const User = require('../models/User');

//GET
router.get('/', async (req, res, next) => {
	try {
		const users = await User.findAllUsers();
		res.status(200).send(users);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findUser(id);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
});

//POST
router.post('/', async (req, res, next) => {
	try {
		const { body } = req;
		const user = await User.addUser(body);
		res.status(200).json(user);
	} catch (error) {
		res.send(error);
	}
});

//PATCH
router.patch('/', async (req, res, next) => {
	try {
		const { body } = req;
		const user = await User.updateUser(body);
		if ('firstName' in user) {
			res.status(200).json(user);
		} else {
			res.status(400).json(user);
		}
	} catch (error) {
		res.status(400).json(error);
	}
});

module.exports = router;
