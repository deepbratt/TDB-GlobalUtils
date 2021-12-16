const S3 = require('aws-sdk/clients/s3');
const { v4: uuidv4 } = require('uuid');

const uploadS3WithTag = (file, region, accessKeyId, secretAccessKey, bucketName) => {
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

  return s3
    .upload(uploadParams, {
      tags: [
        {
          Key: 'imageType',
          Value: 'Temporary',
        },
      ],
    })
    .promise();
};

module.exports = uploadS3WithTag;
