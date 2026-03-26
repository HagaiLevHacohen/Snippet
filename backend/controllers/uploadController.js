const formidable = require("formidable");
const { uploadImage } = require("../lib/upload");

const uploadFile = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed" });
    }

    try {
      console.log("FILES:", files);
      // Handle single file
      const file = files.file[0]; // no [0]
      if (!file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const url = await uploadImage(file.filepath);

      return res.json({ url });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }
  });
};

module.exports = { uploadFile };