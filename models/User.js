const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minlength: 2,
			unique: false,
		},
		lastName: {
			type: String,
			required: true,
			minlength: 2,
			unique: false,
		},
		email: {
			type: String,
			required: true,
			minlength: 5,
			unique: true,
		},
		phoneNumber: {
			type: String,
			minlength: 10,
			maxLength: 12,
			required: false,
			unique: false,
		},
		password: {
			type: String,
			minlength: 6,
			required: false,
		},
		image: {
			type: String,
			required: true,
			default: '/images/default-profile.jpg',
		},
		joinDate: {
			type: Date,
			default: Date.now,
			required: true,
		},
		assignedTasks: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Task',
			},
		],
		token: {
			type: String,
		},
	},
	{ collection: 'User' }
);

// Find a user by id
UserSchema.statics.findUser = async function (id) {
	return await User.findById(id);
};

// Get all users
UserSchema.statics.findAllUsers = async function () {
	return await User.find();
};

// Create new user
UserSchema.statics.addUser = function (userObject) {
	const newUser = new User(userObject);
	newUser.save();
	return newUser;
};

// Update user
UserSchema.statics.updateUser = async function (userObject) {
	const { _id: id } = userObject;
	return await User.findByIdAndUpdate(id, {
		$set: { ...userObject },
	}).exec();
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
