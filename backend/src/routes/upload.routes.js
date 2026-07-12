const express = require('express');
const r = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth.middleware');
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
r.post('/image', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: req.query.folder || 'zeno-africa' }, (err, result) => err ? reject(err) : resolve(result)).end(req.file.buffer);
    });
    res.status(200).json({ success: true, public_id: result.public_id, url: result.secure_url });
  } catch (err) { next(err); }
});
module.exports = r;
