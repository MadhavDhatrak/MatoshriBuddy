const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Welcome to MatoshriBuddy!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to MatoshriBuddy, ${user.name}!</h2>
          <p>Thank you for joining our platform. We're excited to have you as part of our community!</p>
          <p>With MatoshriBuddy, you can:</p>
          <ul>
            <li>Discover exciting college events</li>
            <li>Register for events</li>
            <li>Connect with fellow students</li>
          </ul>
          <p>Start exploring events now!</p>
          <p>Best regards,<br>The MatoshriBuddy Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error(`Failed to send welcome email: ${error.message}. Please check your email configuration.`);
  }
};