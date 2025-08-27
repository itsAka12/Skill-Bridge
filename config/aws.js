const AWS = require('aws-sdk');

// Configure AWS SDK
const configureAWS = () => {
    const config = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'default_access_key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'default_secret_key',
        region: process.env.AWS_REGION || 'us-east-1'
    };

    AWS.config.update(config);

    // Validate configuration
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.warn('AWS credentials not configured. File uploads will use placeholders.');
        console.log('To enable AWS S3 file uploads:');
        console.log('1. Set AWS_ACCESS_KEY_ID environment variable');
        console.log('2. Set AWS_SECRET_ACCESS_KEY environment variable');
        console.log('3. Set AWS_REGION environment variable (optional, defaults to us-east-1)');
        console.log('4. Set AWS_S3_BUCKET environment variable');
    }

    return AWS;
};

// S3 Configuration
const createS3Instance = () => {
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {
            Bucket: process.env.AWS_S3_BUCKET || 'skillbridge-uploads'
        }
    });

    return s3;
};

// Test S3 connection
const testS3Connection = async () => {
    try {
        const s3 = createS3Instance();
        const bucketName = process.env.AWS_S3_BUCKET || 'skillbridge-uploads';

        await s3.headBucket({ Bucket: bucketName }).promise();
        console.log(`AWS S3 connection successful - Bucket: ${bucketName}`);
        return true;
    } catch (error) {
        console.warn('AWS S3 connection failed:', error.message);
        console.log('File upload features will use placeholder responses');
        return false;
    }
};

// Upload file to S3
const uploadToS3 = async (file, key, bucket = null) => {
    try {
        const s3 = createS3Instance();
        const bucketName = bucket || process.env.AWS_S3_BUCKET || 'skillbridge-uploads';

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        const result = await s3.upload(uploadParams).promise();
        return {
            success: true,
            url: result.Location,
            key: result.Key
        };
    } catch (error) {
        console.error('S3 upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Delete file from S3
const deleteFromS3 = async (key, bucket = null) => {
    try {
        const s3 = createS3Instance();
        const bucketName = bucket || process.env.AWS_S3_BUCKET || 'skillbridge-uploads';

        const deleteParams = {
            Bucket: bucketName,
            Key: key
        };

        await s3.deleteObject(deleteParams).promise();
        return { success: true };
    } catch (error) {
        console.error('S3 delete error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Generate presigned URL for direct upload
const generatePresignedUrl = async (key, contentType, bucket = null) => {
    try {
        const s3 = createS3Instance();
        const bucketName = bucket || process.env.AWS_S3_BUCKET || 'skillbridge-uploads';

        const params = {
            Bucket: bucketName,
            Key: key,
            ContentType: contentType,
            ACL: 'public-read',
            Expires: 3600 // URL expires in 1 hour
        };

        const url = await s3.getSignedUrlPromise('putObject', params);
        return {
            success: true,
            url,
            key
        };
    } catch (error) {
        console.error('Presigned URL generation error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    configureAWS,
    createS3Instance,
    testS3Connection,
    uploadToS3,
    deleteFromS3,
    generatePresignedUrl
};
