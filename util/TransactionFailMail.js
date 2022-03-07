

import { createTransport } from "nodemailer";
import sendGridtrasnporter from "nodemailer-sendgrid-transport";


// eslint-disable-next-line import/no-extraneous-dependencies



 export const emailFail = async (  name , money ) => {
  const auth = {
    auth: {
      api_key: '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'
    },
  };

  const trasnporter = createTransport(sendGridtrasnporter(auth));

  const sendFrom = "moxoda1145@reimondo.com";
  const inputuserEmail = 'vimannyu11m@outlook.com';

  const mailOptions = {
    from: sendFrom,
    to: inputuserEmail,
    subject: "Failed to transfer your money",
    html: `<h1>Hi ${name} your money has not been transfered due to some issue kindly be patient.</h1>
            <p>if your amount  has been deducted which is ${money} will be refunded back to the your account in short period of time.</p>
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

export default emailFail;