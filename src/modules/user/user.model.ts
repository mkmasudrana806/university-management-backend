import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserModel, TUser } from "./user.interface";
import config from "../../app/config";
import { USER_STATUS } from "./user.constant";

// user schema
const userSchema = new Schema<TUser, IUserModel>(
  {
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
      enum: USER_STATUS,
      default: "in-progress",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// *************** document middleware start **************
// this pre.save event will called before save document into database. we can do anything before save document into database
// pre save middleware / hook: will work on create() or save() method
userSchema.pre("save", async function (next) {
  // hassing password and save into DB
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// ****************** statics methods ***************************
// isUserExistsByCustomId method
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  const result = await User.findOne({ id }).select("+password");
  return result;
};

// isPasswordMatched
userSchema.statics.isPasswordMatched = async function (
  plain: string,
  hash: string
) {
  const result = await bcrypt.compare(plain, hash);
  return result;
};

userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangedTimestamp: Date,
  jwtIssuedtimestamp: number
) {
  // UTC datetime to milliseconds
  const passwordChangedtime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
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
export const User = model<TUser, IUserModel>("User", userSchema);
