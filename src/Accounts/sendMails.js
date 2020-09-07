const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
const msg = {
  to: "test@example.com",
  from: "test@example.com",
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
sgMail.send(msg);
