const multer = require('multer');
const AppError = require('../errorHandling/AppError');

const upload = (mineType) => {
	return multer({
		storage: memoryStorage(),
		fileFilter: (req, file, callback) => {
			if (file.mimetype.startsWith(mineType)) {
				callback(null, true);
			} else {
				callback(new AppError(`Not an ${mineType} ! Please upload only ${mineType}`, 400), false);
			}
		},
	});
};

module.exports = upload;
