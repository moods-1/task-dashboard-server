const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

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
		assigneeName: {
			type: String,
		},
		assigneeImage: {
			type: String,
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

// Get task by field and partial value
TaskSchema.statics.findByFieldAndValue = async function (field, value) {
	return await Task.find({
		[field]: { $regex: `${value.toLowerCase()}` },
	});
};

// Update task
TaskSchema.statics.updateTask = async function (taskObject) {
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
	return await Task.findByIdAndUpdate(
		{ _id: id },
		{ $set: { ...taskObject } },
		{ returnDocument: 'after' }
	).exec();
};

TaskSchema.statics.getTaskDetails = async (filter, select) => {
	return await Task.find(filter).select(select);
};

TaskSchema.statics.dueSoon = async (days) => {
	const today = new Date();
	const daysUntilDue = Number(days) || 5;
	const dateDue = new Date(today.setDate(today.getDate() + daysUntilDue));
	return await Task.find({
		dueDate: {
			$gte: new Date(),
			$lt: dateDue,
		},
		complete: false,
	});
};

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
