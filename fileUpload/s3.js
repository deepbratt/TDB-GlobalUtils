const S3 = require('aws-sdk/clients/s3');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../errorHandling/AppError');

// const bucketName = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_BUCKET_REGION;
// const accessKeyId = process.env.AWS_ACCESS_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;

const uploadS3 = (file, region, accessKeyId, secretAccessKey, bucketName) => {
	let myFile = file.originalname.split('.');
	const ext = myFile[myFile.length - 1];
	const s3 = new S3({
		region,
		accessKeyId,
		secretAccessKey,
	});
	const uploadParams = {
		Bucket: bucketName,
		Body: file.buffer,
		Key: `${uuidv4()}.${ext}`,
	};
	return s3.upload(uploadParams).promise();
};

module.exports = uploadS3;
