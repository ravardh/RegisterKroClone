import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAILUSER,
      pass: process.env.PASSCODE,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.GMAILUSER,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
