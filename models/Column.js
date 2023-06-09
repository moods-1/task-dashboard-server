const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
	},
	{ collection: 'Column' }
);

// Move tasks internally
ColumnSchema.statics.moveInternal = async function (body) {
	const { sourceTaskId, sourceIndex, destinationIndex, destinationId } = body;
	const column = await Column.findById(destinationId);
	column.taskIds.splice(sourceIndex, 1);
	column.taskIds.splice(destinationIndex, 0, sourceTaskId);
	await column.save();
	return column;
};

const Column = mongoose.model('Column', ColumnSchema);
module.exports = Column;
