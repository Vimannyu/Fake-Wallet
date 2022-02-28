require("dotenv").config();

const nodemailer = require("nodemailer");
const sendGridtrasnporter = require("nodemailer-sendgrid-transport");

const emailSucsessTransfer = async (email , name , money ) => {
  const auth = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  };

  const trasnporter = nodemailer.createTransport(sendGridtrasnporter(auth));

  const sendFrom = "moxoda1145@reimondo.com";
  const inputuserEmail = email;

  const mailOptions = {
    from: sendfrom,
    to: inputuserEmail,
    subject: "Sucsessfully transfered",
    html: `<h1>Hi ${name} your money has been succesfully transfered.</h1>
            <p>The amount that has been debited from your account is ${money}</p>
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

module.exports = emailSucsessTransfer;
