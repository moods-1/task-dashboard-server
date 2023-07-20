const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema(
	{
		companyName: {
			type: String,
			required: true,
			minlength: 2,
			unique: false,
		},
		city: {
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
	},
	{ collection: 'Company' }
);

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
