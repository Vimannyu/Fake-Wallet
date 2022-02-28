require("dotenv").config();

const nodemailer = require("nodemailer");
const sendGridtrasnporter = require("nodemailer-sendgrid-transport");

const emailSender = async (email , name) => {
  const auth = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  };

  const trasnporter = nodemailer.createTransport(sendGridtrasnporter(auth));

  const sendFrom = "moxoda1145@reimondo.com";
  let inputuserEmail = email;

  const mailOptions = {
    from: sendfrom,
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

module.exports = emailSender;
