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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../app/config"));
/**
 *
 * @param receiver receiver email address
 * @param body body of this email address in html format
 * @returns return nothing
 */
const sendEmail = (receiver, body) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config_1.default.node_env === "production", // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "mkmasudrana806@gmail.com",
            pass: "dmsb towk lkdy apxe",
        },
    });
    // send mail with defined transport object
    yield transporter.sendMail({
        from: "mkmasudrana806@gmail.com", // sender address
        to: receiver, // list of receivers
        subject: "Reset Your Password Within 10 min", // Subject line
        text: "Hello Dear, please reset your password by 10 min. here is the reset link", // plain text body
        html: body, // html body
    });
    return;
});
exports.default = sendEmail;
