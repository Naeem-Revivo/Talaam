const transporter = require('./transporter');

// Send OTP email
const sendOTPEmail = async (email, name, otp) => {
  // Use generic greeting if name is same as email (name not provided)
  const greeting = name === email ? 'Hello!' : `Hello ${name}!`;
  
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Talaam'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Email Verification OTP - Talaam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${greeting}</h2>
        <p style="color: #666; font-size: 16px;">
          Thank you for registering with Talaam. Please use the following OTP to verify your email address:
        </p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <h1 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">
          This OTP will expire in 10 minutes.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this verification, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated email, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  const greeting = name === email ? 'Hello!' : `Hello ${name}!`;

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/set-new-password?token=${resetToken}`;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Talaam'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset Request - Talaam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${greeting}</h2>
        <p style="color: #666; font-size: 16px;">You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #007bff; font-size: 14px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
};

