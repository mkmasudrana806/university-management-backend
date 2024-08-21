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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../app/config"));
const user_constant_1 = require("./user.constant");
// user schema
const userSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: 0, // hide password field in client response
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["student", "faculty", "admin", "superAdmin"],
    },
    status: {
        type: String,
        enum: user_constant_1.USER_STATUS,
        default: "in-progress",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// *************** document middleware start **************
// this pre.save event will called before save document into database. we can do anything before save document into database
// pre save middleware / hook: will work on create() or save() method
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // hassing password and save into DB
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// ****************** statics methods ***************************
// isUserExistsByCustomId method
userSchema.statics.isUserExistsByCustomId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.User.findOne({ id }).select("+password");
        return result;
    });
};
// isPasswordMatched
userSchema.statics.isPasswordMatched = function (plain, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bcrypt_1.default.compare(plain, hash);
        return result;
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChange = function (passwordChangedTimestamp, jwtIssuedtimestamp) {
    // UTC datetime to milliseconds
    const passwordChangedtime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedtime > jwtIssuedtimestamp;
};
// set empty string after saving password
userSchema.post("save", function (doc) {
    doc.password = "";
});
// *************** query middleware start **************
userSchema.pre("find", function (next) {
    this.findOne({ isDeleted: { $ne: true } });
    next();
});
// userSchema.pre("findOne", function (next) {
//   // filter out data which is deleted true
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });
userSchema.pre("aggregate", function (next) {
    // filter out data which is deleted true
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
// user model export
exports.User = (0, mongoose_1.model)("User", userSchema);
