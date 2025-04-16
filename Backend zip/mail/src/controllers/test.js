const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "88a41a001@smtp-brevo.com",
    pass: "Hv8Cn6V9N1WdP4kp",
  },
});

transporter.sendMail({
  from: '"Test MUJ" <88a41a001@smtp-brevo.com>',
  to: "dubeyshivamraj@gmail.com",
  subject: "Test Email from Brevo SMTP",
  text: "If you're seeing this, SMTP is working 🎉",
})
.then(info => console.log("✅ Mail sent:", info))
.catch(error => console.error("❌ Mail error:", error));
