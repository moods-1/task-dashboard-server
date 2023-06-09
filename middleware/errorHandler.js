exports.errorHandler = (error, req, res, next) => {
	// TODO: Implement more descriptive error messages
	return res.status(error.status || 500).send('There was an error retrieving data.');
};
