const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { updateMovedTask } = require('../helpers/helperFunctions');

const ColumnSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			minlength: 2,
			unique: false,
		},
		taskIds: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Task',
			},
		],
		companyId: {
			type: Schema.Types.ObjectId,
		}
	},
	{ collection: 'Column' }
);

// Move tasks internally
ColumnSchema.statics.moveInternal = async function (body) {
	const { sourceTaskId, sourceIndex, destinationIndex, destinationId, mover } = body;
	await updateMovedTask(sourceTaskId, mover)
	const column = await Column.findById(destinationId);
	column.taskIds.splice(sourceIndex, 1);
	column.taskIds.splice(destinationIndex, 0, sourceTaskId);
	await column.save();
	return column;
};

const Column = mongoose.model('Column', ColumnSchema);
module.exports = Column;
