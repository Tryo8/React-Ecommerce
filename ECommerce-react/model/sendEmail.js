import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // 16-char App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"Shoponaire" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);

  } catch (err) {
    console.error("Failed to send email:", err.message);
    // optionally log to DB to retry later
  }
};

export default sendEmail;
