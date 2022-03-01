import { createTransport } from "nodemailer";
import sendGridtrasnporter from "nodemailer-sendgrid-transport";


// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

 export const emailSender = async (email , name) => {
  const auth = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  };

  const trasnporter = createTransport(sendGridtrasnporter(auth));

  const sendFrom = "moxoda1145@reimondo.com";
  const inputuserEmail = email;

  const mailOptions = {
    from: sendFrom,
    to: inputuserEmail,
    subject: "User Verification",
    html: `<h1>Hi ${name}</h1>
            <p>Thanks for signing up your account you are now verified now .kindly,please exchange your money using our seervices.</p>
            `,
  };

  await trasnporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("message Sent: ", data);
    }
  });
};

export default emailSender;
