const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Column = require('./Column');

const TaskSchema = new Schema(
	{
		assignor: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		assignee: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		complete: {
			type: Boolean,
			required: true,
			default: false,
		},
		completionDate: {
			type: Date,
		},
		state: {
			type: String,
			required: true,
		},
		priority: {
			type: Number,
			required: true,
			default: 2,
		},
		taskTitle: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 150,
		},
		dueDate: {
			type: Date,
			default: Date.now,
			required: true,
		},
		assignDate: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	{ collection: 'Task' }
);

// Add task
TaskSchema.statics.addTask = async function (taskObject) {
	const newTask = new Task(taskObject);
	newTask.save();
	const { _id: taskId, assignee } = newTask;
	await Column.findOneAndUpdate(
		{ state: 'To Do' },
		{ $push: { taskIds: taskId } }
	);
	await User.findByIdAndUpdate(
		{ _id: assignee },
		{ $push: { assignedTasks: taskId } }
	);
	return newTask;
};

// Get all tasks
TaskSchema.statics.findAllTasks = function () {
	return this.find();
};

// Get task by field and partial value
TaskSchema.statics.findByFieldAndValue = async function (field, value) {
	try {
		const result = await Task.find({
			[field]: { $regex: `${value.toLowerCase()}` },
		});
		return result;
	} catch (error) {
		return error;
	}
};

// Update task
TaskSchema.statics.updateTask = async function (taskObject) {
	try {
		const { _id: id, assignee, originalAssignee } = taskObject;
		// Update assigned user
		await User.findByIdAndUpdate(
			{ _id: originalAssignee },
			{ $pull: { assignedTasks: id } }
		).exec();
		await User.findByIdAndUpdate(
			{ _id: assignee },
			{ $push: { assignedTasks: id } }
		).exec();
		delete taskObject.originalAssignee;
		return await Task.updateOne(
			{ _id: id },
			{ $set: { ...taskObject } }
		).exec();
	} catch (error) {
		return error;
	}
};

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
