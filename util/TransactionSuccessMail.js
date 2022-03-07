/* eslint-disable import/extensions */



import { createTransport } from "nodemailer";
import sendGridtrasnporter from "nodemailer-sendgrid-transport";


const emailSucsessTransfer = async (  name , money ) => {
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
    subject: "Sucsessfully transfered",
    html: `<h1>Hi ${name} your money has been succesfully transfered.</h1>
            <p>The amount that has been debited from your account is ${money}</p>
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

export default emailSucsessTransfer;
