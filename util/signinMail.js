/* eslint-disable import/extensions */
import { createTransport } from "nodemailer";
import sendGridtrasnporter from "nodemailer-sendgrid-transport";





 export const emailSender = async (email , name) => {
  const auth = {
    auth: {
      api_key: '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',
    },
  };

  const trasnporter = createTransport(sendGridtrasnporter(auth));

  const sendFrom = "moxoda1145@reimondo.com";
  const inputuserEmail = 'sukhdevmanhas23@gmail.com'

  const mailOptions = {
    from: sendFrom,
    to: inputuserEmail,
    subject: "User Verification",
    html: `<h1>Hi ${name}</h1>
            <p>Thanks for signing up your account you are now verified now .kindly,please exchange your money using our seervices.</p>
            `,
  };

   trasnporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("message Sent: ", data);
    }
  });
};

export default emailSender;
