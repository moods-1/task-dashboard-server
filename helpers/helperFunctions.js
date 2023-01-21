exports.responseFormatter = (status, message, response) => ({
	status,
	message,
	response,
});

exports.responseCacher = (req, res, data) => {
	const type = req.method;
	if (type === 'GET') {
		return res
			.set('Cache-control', 'must-revalidate', 'public, max-age=86400')
			.json(data);
	}
	return res.json(data);
};
