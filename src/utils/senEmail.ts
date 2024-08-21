import nodemailer from "nodemailer";
import config from "../app/config";

/**
 *
 * @param receiver receiver email address
 * @param body body of this email address in html format
 * @returns return nothing
 */
const sendEmail = async (receiver: string, body: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.node_env === "production", // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "mkmasudrana806@gmail.com",
      pass: "dmsb towk lkdy apxe",
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "mkmasudrana806@gmail.com", // sender address
    to: receiver, // list of receivers
    subject: "Reset Your Password Within 10 min", // Subject line
    text: "Hello Dear, please reset your password by 10 min. here is the reset link", // plain text body
    html: body, // html body
  });
  return;
};

export default sendEmail;
