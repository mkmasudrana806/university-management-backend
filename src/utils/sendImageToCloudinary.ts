import { v2 as cloudinary } from "cloudinary";
import config from "../app/config";
import multer from "multer";
import fs from "fs";

/**
 * -------------- send image to cloudinary ----------------------
 *
 * @param imageName name of the image to send to cloudinary
 * @param path path(where image first temporary uploaded into server) of the image to send to cloudinary
 */
const sendImageToCloudinary = async (imageName: string, path: string) => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary_cloudname,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error) => {
      console.log(error);
    });

  // // Optimize delivery by resizing and applying auto-format and auto-quality
  // const optimizeUrl = cloudinary.url(imageName, {
  //   fetch_format: "auto",
  //   quality: "auto",
  // });

  // // Transform the image: auto-crop to square aspect_ratio
  // const autoCropUrl = cloudinary.url(imageName, {
  //   crop: "auto",
  //   gravity: "auto",
  //   width: 500,
  //   height: 500,
  // });

  // unlink the image link from server after uploading image to cloudinary
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("file is deleted successfull from server");
    }
  });
  return uploadResult;
};

export default sendImageToCloudinary;

// ----------------  multer storage configuration ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// ----------------  multer upload ----------------
export const upload = multer({ storage: storage });
