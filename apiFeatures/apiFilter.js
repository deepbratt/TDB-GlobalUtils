class APIFeatures {
	constructor(query, queryParams) {
		this.query = query;
		this.queryParams = queryParams;
	}
	filter() {
		//QUERY FILTER
		const queryParams = { ...this.queryParams };
		const excludedFields = ['limit', 'page', 'sort', 'fields', 'keyword'];
		excludedFields.forEach((el) => delete queryParams[el]);
		// CASE INSENSITIVE SEARCH
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

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	search() {
		if (this.queryParams.keyword) {
			this.query = this.query
				.find(
					{ $text: { $search: this.queryParams.keyword } },
					{ score: { $meta: 'textScore' } }
				)
				.sort({ score: { $meta: 'textScore' } });
		}
		return this;
	}

	sort() {
		if (this.queryParams.sort) {
			const sortBy = this.queryParams.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-updatedAt');
		}
		return this;
	}

	limitFields() {
		if (this.queryParams.fields) {
			const fields = this.queryParams.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}

	pagination() {
		const page = this.queryParams.page * 1 || 1;
		const limit = this.queryParams.limit * 1 || 100;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

module.exports = APIFeatures;
