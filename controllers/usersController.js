const User = require('../models/User');
const { tryCatch } = require('../utilities/tryCatch');

exports.getAllUsersController = tryCatch(async (req, res, next) => {
	const users = await User.find();
	res.status(200).send(users);
});

exports.getUserByIdController = tryCatch(async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);
	res.status(200).send(user);
});

exports.postUserController = tryCatch(async (req, res) => {
	const { body } = req;
	const user = await User.addUser(body);
	res.status(200).json(user);
});

exports.patchUserController = tryCatch(async (req, res) => {
	const { body } = req;
	const user = await User.updateUser(body);
	if ('firstName' in user) {
		res.status(200).json(user);
	} else {
		res.status(200).json({ message: 'No changes made.' });
	}
});
