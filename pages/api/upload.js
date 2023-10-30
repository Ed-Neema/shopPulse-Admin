import cloudinary from "cloudinary";
import { v2 as cloudinaryUploader } from "cloudinary";
import multiparty from "multiparty";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
    // await isAdminRequest(req, res);

  const form = new multiparty.Form();

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });


  const uploadPromises = files.file.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinaryUploader.uploader.upload(
        file.path,
        { resource_type: "auto" }, //Use "auto" to automatically detect the resource type
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
    });
  });

  try {
    const urls = await Promise.all(uploadPromises);
    // console.log(urls);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed." });
  }
}

export const config = {
  api: { bodyParser: false },
};
