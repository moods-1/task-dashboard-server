const User = require('../models/User');

exports.getAllUsersController = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).send(users);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
};

exports.getUserByIdController = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findUser(id);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send({ msg: error });
	}
};

exports.postUserController = async (req, res) => {
	try {
		const { body } = req;
		const user = await User.addUser(body);
		res.status(200).json(user);
	} catch (error) {
		res.send(error);
	}
};

exports.patchUserController = async (req, res) => {
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
};
