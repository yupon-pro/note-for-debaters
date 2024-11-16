import Nodemailer  from "nodemailer";

export async function sendGmail(email: string, code: string, name: string) {
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
    text: `${name}さん、こんにちは！認証コードは${code}です！お早めに登録を完了させてください。`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.log(error);
    throw error
  }
}
