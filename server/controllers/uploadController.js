import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ecommerce-products" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

    const result = await uploadFromBuffer();
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};
