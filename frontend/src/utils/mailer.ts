import Nodemailer  from "nodemailer";

export async function sendGmail(email: string, text: string) {
  const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: "メール認証",
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.log(error);
    throw error
  }
}
