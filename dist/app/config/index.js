"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    // node environment
    node_env: process.env.NODE_ENV,
    // app port and database url
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    // bcryptjs for hashing passwords
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    // user default password
    default_password: process.env.DEFAULT_PASS,
    // jwt
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    // reset password ui link
    reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
    // cloudinary
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    cloudinary_cloudname: process.env.CLOUDINARY_CLOUDNAME,
    // super admin password
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    // node mailer user and password
    node_mailer_user: process.env.NODE_MAILER_USER,
    node_mailer_password: process.env.NODE_PASSWORD,
};
