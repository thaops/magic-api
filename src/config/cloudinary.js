const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary and return the result.
 * @param {Buffer} buffer
 * @param {object} options  — Cloudinary upload options
 * @returns {Promise<object>}
 */
function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

module.exports = { cloudinary, uploadBuffer };
