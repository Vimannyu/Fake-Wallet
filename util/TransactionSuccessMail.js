

import { error, log } from "consola";

import { createTransport } from "nodemailer";
import sendGridtrasnporter from "nodemailer-sendgrid-transport";


// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });


const emailSucsessTransfer = async (email , name , money ) => {
  const auth = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    },
  };

  const trasnporter = createTransport(sendGridtrasnporter(auth));

  const sendFrom = "moxoda1145@reimondo.com";
  const inputuserEmail = email;

  const mailOptions = {
    from: sendFrom,
    to: inputuserEmail,
    subject: "Sucsessfully transfered",
    html: `<h1>Hi ${name} your money has been succesfully transfered.</h1>
            <p>The amount that has been debited from your account is ${money}</p>
            `,
  };

  await trasnporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      error(err);
    } else {
      log("message Sent: ", data);
    }
  });
};

export default emailSucsessTransfer;
