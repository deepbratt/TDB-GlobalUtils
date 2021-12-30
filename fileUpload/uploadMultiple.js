const multer = require('multer');
const { memoryStorage } = require('multer');
const { AppError } = require('@utils/tdb_globalutils');

exports.multipleUploads = (mineType, myType) => {
  return multer({
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (file.mimetype.startsWith(mineType) || file.mimetype.startsWith(myType)) {
        callback(null, true);
      } else {
        callback(new AppError(`Not an ${mineType}  ! Please upload only ${mineType}`, 400), false);
      }
    },
  });
};
