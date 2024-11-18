import { configDotenv } from "dotenv";
import { createTransport } from "nodemailer";
import { log } from "console";
import { generateEmailToken } from "./tokenService.js";

configDotenv();

const emailHost = process.env.HOST!;
const emailPort = Number(process.env.PORT!);
const emailUser = process.env.USER!;
const emailPass = process.env.PASS!;

const appBaseURL = process.env.BASE_URL!;

const createTransporter = () => {
  try {
    const transporter = createTransport({
      host: emailHost,
      port: emailPort,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    log("Email transporter initialized successfully!");

    return transporter;
  } catch (error) {
    log(error);
  }
};

const transporter = createTransporter();

const sendVerificationEmail = (targetEmail: string) => {
  const token = generateEmailToken({ email: targetEmail });
  const verificationLink = `${appBaseURL}/auth/verification/${token}`;
  const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; margin-top: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <h1 style="color: #333333; font-size: 24px; text-align: center; margin-bottom: 20px;">Verify Your Email Address</h1>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #0066cc; padding: 15px; margin-bottom: 20px;">
                  <p style="color: #666666; margin: 0;">This verification link will expire in 10 days</p>
              </div>
  
              <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; text-align: center;">
                  To complete your registration and verify your email address, please click the button below:
              </p>
  
              <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${verificationLink}" style="display: inline-block; background-color: #0066cc; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
              </div>
  
              <div style="border-top: 1px solid #eeeeee; padding-top: 20px; margin-top: 20px;">
                  <p style="color: #999999; font-size: 14px; margin-bottom: 10px;">If the button doesn't work, copy and paste this URL into your browser:</p>
                  <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 14px; color: #666666;">${verificationLink}</p>
              </div>
  
              <div style="margin-top: 30px; text-align: center; color: #999999; font-size: 13px;">
                  <p style="margin-bottom: 10px;">If you didn't request this verification, please ignore this email.</p>
                  <p style="margin: 0;">© 2024 Aditya Surishetti. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  transporter?.sendMail({
    from: emailUser,
    to: targetEmail,
    subject: "Email Verification",
    html: htmlContent,
  });
};

export default sendVerificationEmail;
