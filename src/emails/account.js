const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: "harshil.paladiya@marutitech.com",
    subject: "Thanks for joining in!",
    text: `Welcome to Task App, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancelationEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: "harshil.paladiyamarutitech.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
