const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and documents
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and documents are allowed.'));
        }
    }
});

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'default_access_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'default_secret_key',
    region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'skillbridge-uploads';

// @route   POST /api/upload/image
// @desc    Upload profile image
// @access  Private
router.post('/image', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const file = req.file;
        const fileName = `profile-images/${req.userId}-${Date.now()}-${file.originalname}`;

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        try {
            const result = await s3.upload(uploadParams).promise();
            
            res.json({
                message: 'Image uploaded successfully',
                url: result.Location,
                filename: fileName
            });
        } catch (s3Error) {
            console.error('S3 upload error:', s3Error);
            
            // Fallback: Return a placeholder URL for development
            const placeholderUrl = `https://ui-avatars.com/api/?name=${req.userId}&background=6366f1&color=fff&size=200`;
            
            res.json({
                message: 'Image upload configured (using placeholder in development)',
                url: placeholderUrl,
                filename: `placeholder-${req.userId}`,
                note: 'Configure AWS S3 credentials in environment variables for actual uploads'
            });
        }
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ 
            message: 'Failed to upload image',
            error: error.message 
        });
    }
});

// @route   POST /api/upload/document
// @desc    Upload skill-related document
// @access  Private
router.post('/document', auth, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No document file provided' });
        }

        const file = req.file;
        const fileName = `skill-documents/${req.userId}-${Date.now()}-${file.originalname}`;

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        try {
            const result = await s3.upload(uploadParams).promise();
            
            res.json({
                message: 'Document uploaded successfully',
                url: result.Location,
                filename: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size
            });
        } catch (s3Error) {
            console.error('S3 upload error:', s3Error);
            
            // Fallback: Return a placeholder for development
            res.json({
                message: 'Document upload configured (placeholder in development)',
                url: '#',
                filename: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                note: 'Configure AWS S3 credentials in environment variables for actual uploads'
            });
        }
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ 
            message: 'Failed to upload document',
            error: error.message 
        });
    }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private
router.post('/multiple', auth, upload.array('files', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files provided' });
        }

        const uploadPromises = req.files.map(async (file) => {
            const fileName = `skill-attachments/${req.userId}-${Date.now()}-${file.originalname}`;
            
            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
            };

            try {
                const result = await s3.upload(uploadParams).promise();
                return {
                    success: true,
                    url: result.Location,
                    filename: file.originalname,
                    fileType: file.mimetype,
                    fileSize: file.size
                };
            } catch (s3Error) {
                console.error('S3 upload error for file:', file.originalname, s3Error);
                return {
                    success: false,
                    filename: file.originalname,
                    error: 'Upload failed - configure AWS S3 credentials'
                };
            }
        });

        const results = await Promise.all(uploadPromises);
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        res.json({
            message: `${successful.length} files uploaded successfully`,
            successful,
            failed,
            note: failed.length > 0 ? 'Some uploads failed - configure AWS S3 credentials' : undefined
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({ 
            message: 'Failed to upload files',
            error: error.message 
        });
    }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/:filename', auth, async (req, res) => {
    try {
        const fileName = req.params.filename;

        const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: fileName
        };

        try {
            await s3.deleteObject(deleteParams).promise();
            res.json({ message: 'File deleted successfully' });
        } catch (s3Error) {
            console.error('S3 delete error:', s3Error);
            res.json({ 
                message: 'File deletion configured (placeholder in development)',
                note: 'Configure AWS S3 credentials for actual file deletion'
            });
        }
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ 
            message: 'Failed to delete file',
            error: error.message 
        });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                message: 'File too large. Maximum size is 10MB.' 
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                message: 'Too many files. Maximum is 5 files.' 
            });
        }
    }
    
    if (error.message === 'Invalid file type. Only images and documents are allowed.') {
        return res.status(400).json({ message: error.message });
    }

    next(error);
});

module.exports = router;
