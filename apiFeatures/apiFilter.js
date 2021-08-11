class APIFeatures {
	constructor(query, queryParams) {
		this.query = query;
		this.queryParams = queryParams;
		this.length = 0;
	}
	filter() {
		//QUERY FILTER
		const queryParams = { ...this.queryParams };
		const excludedFields = ['limit', 'page', 'sort', 'fields', 'keyword'];
		excludedFields.forEach((el) => delete queryParams[el]);

		// FILTER MONGOOSE OPERATORS
		let queryStr = JSON.stringify(queryParams);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		// QUERY BUILDING
		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	search() {
		if (this.queryParams.keyword) {
			this.query = this.query.find({ $text: { $search: this.queryParams.keyword } });
		}
		return this;
	}

	sort() {
		if (this.queryParams.sort) {
			const sortBy = this.queryParams.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-date');
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
	getLength() {
		this.length = this.query.countDocuments();
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
