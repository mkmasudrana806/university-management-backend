"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../app/config"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
/**
 * -------------- send image to cloudinary ----------------------
 *
 * @param imageName name of the image to send to cloudinary
 * @param path path of the image to send to cloudinary
 */
const sendImageToCloudinary = (imageName, path) => __awaiter(void 0, void 0, void 0, function* () {
    // Configuration
    cloudinary_1.v2.config({
        cloud_name: config_1.default.cloudinary_cloudname,
        api_key: config_1.default.cloudinary_api_key,
        api_secret: config_1.default.cloudinary_api_secret,
    });
    // Upload an image
    const uploadResult = yield cloudinary_1.v2.uploader
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
    fs_1.default.unlink(path, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("file is deleted successfully!");
        }
    });
    return uploadResult;
});
exports.default = sendImageToCloudinary;
// ----------------  multer storage configuration ----------------
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
// ----------------  multer upload ----------------
exports.upload = (0, multer_1.default)({ storage: storage });
