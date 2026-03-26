const fs = require("fs");
const cloudinary = require("./cloudinary");

async function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "Snippet" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    fs.createReadStream(filePath).pipe(stream);
  });
}

module.exports = { uploadImage };