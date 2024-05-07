const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { USER_ROLES } = require('../helpers/constants');

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
		roles: [
			{
				type: String,
				default: USER_ROLES.DEFAULT,
			}
		],
		token: {
			type: String,
		},
		companyId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		loggedIn: {
			type: Boolean,
			default: false,
		}
	},
	{ collection: 'User' }
);

// Create new user
UserSchema.statics.addUser = function (userObject) {
	const newUser = new User(userObject);
	newUser.save();
	return newUser;
};

// Update user
UserSchema.statics.updateUser = async function (userObject) {
	const { _id: id } = userObject;
	return await User.findByIdAndUpdate(
		id,
		{
			$set: { ...userObject },
		},
		{ returnDocument: 'after' }
	);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
