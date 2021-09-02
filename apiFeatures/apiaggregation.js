const sp = require('stopword');
exports.APIFilter = (Model) => {
	return catchAsync(async (req, res, next) => {
		let array = [];
		if (req.query.keyword) {
			const oldString = req.query.keyword.split(' ');
			console.log(oldString);
			let newString = sp.removeStopwords(oldString);
			let unique = [...new Set(newString)];
			console.log(unique);
			array.push({ $match: { $text: { $search: unique.join(' ') } } });
			array.push({ $project: { score: { $meta: 'textScore' } } });
			array.push({ $match: { score: { $gt: unique.length } } });
		}
		array.push({ $match: filter(req.query) });
		if (req.query.sort) {
			const sortArray = req.query.sort.split(',');
			var obj = {};
			for (let i = 0; i < sortArray.length; i++) {
				if (sortArray[i].startsWith('-')) {
					var s2 = sortArray[i].substring(1);
					obj[s2] = -1;
				} else {
					obj[sortArray[i]] = 1;
				}
			}
			array.push({ $sort: obj });
		} else {
			array.push({ $sort: { createAt: -1 } });
		}
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;
		const skip = (page - 1) * limit;
		array.push({ $count: 'totalCount' }, { $skip: skip }, { $limit: limit });

		const stats = await Model.aggregate(array);
		res.status(200).json({
			status: STATUS.SUCCESS,
			data: {
				stats,
			},
		});
	});
};

function filter(queryParams) {
	//QUERY FILTER
	const queryParams = { ...queryParams };
	const excludedFields = ['limit', 'page', 'sort', 'fields', 'keyword'];
	excludedFields.forEach((el) => delete queryParams[el]);
	// CASE INSENSITIVE SEARCH
	console.log(parseInt(queryParams.price));
	let newObj = {};
	const excluded = [
		'price',
		'engineCapacity',
		'milage',
		'modelYear',
		'_id',
		'id',
		'active',
		'banned',
		'isSold',
		'imageStatus',
	];
	Object.keys(queryParams).forEach((el) => {
		if (!excluded.includes(el)) {
			if (Array.isArray(queryParams[el])) {
				console.log(Array.isArray(queryParams[el]));
				var regex = queryParams[el].map(function (val) {
					return `^${val}$`;
				});
				const reg = regex.join('|');
				newObj[el] = { regex: reg, options: 'i' };
			} else {
				const value = `^${queryParams[el]}$`;
				newObj[el] = { regex: value, options: 'i' };
			}
		} else {
			newObj[el] = queryParams[el];
		}
	});
	console.log(newObj);
	// FILTER MONGOOSE OPERATORS
	let queryStr = JSON.stringify(newObj);
	queryStr = queryStr.replace(
		/\b(gte|gt|lte|lt|regex|options)\b/g,
		(match) => `$${match}`
	);

	console.log(JSON.parse(queryStr));

	// QUERY BUILDING

	return JSON.parse(queryStr);
}
