const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
	{
		customerName: {
			type: String,
			required: true,
			minlength: 2,
			unique: true,
		},
		city: {
			type: String,
			required: true,
			minlength: 2,
			unique: false,
		},
		state: {
			type: String,
			required: true,
			minlength: 2,
			unique: false,
		},

		country: {
			type: String,
			required: true,
			minlength: 3,
			unique: false,
		},
		address: {
			type: String,
			required: true,
			minlength: 6,
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
			required: true,
			unique: true,
		},
		logo: {
			type: String,
			required: false,
			default: '/images/default-brand.png',
		},
		joinDate: {
			type: Date,
			default: Date.now,
			required: true,
		},
		licensesPurchased: {
			type: Number,
			default: 1,
		},
	},
	{ timestamps: true, collection: 'Customer' }
);

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
