const nodemailer = require("nodemailer");

// Direct SMTP config (no .env)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "88a41a001@smtp-brevo.com",
    pass: "Hv8Cn6V9N1WdP4kp",
  },
});

const sendEmails = async (req, res) => {
  const { emails, subject, message } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ success: false, message: "No recipient emails provided" });
  }

  try {
    const emailTasks = emails.map((to) =>
      transporter.sendMail({
        from: `MUJ Placement Cell <mujtcp@gmail.com>`,
        to,
        subject,
        text: message,
      })
    );

    await Promise.all(emailTasks);

    return res.status(200).json({ success: true, message: "Bulk emails sent successfully" });
  } catch (err) {
    console.error("Bulk email error:", err);
    return res.status(500).json({ success: false, message: "Failed to send bulk emails" });
  }
};

const sendSingleEmail = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Missing email, subject or message" });
  }

  try {
    await transporter.sendMail({
      from: `MUJ Placement Cell <mujtcp@gmail.com> `,
      to: email,
      subject,
      text: message,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Single email error:", err);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

module.exports = { sendEmails, sendSingleEmail };
//<88a41a001@smtp-brevo.com>