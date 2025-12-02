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

/**
 * Create Taalam account creation email template
 */
function createTaalamAccountEmail(userData) {
  const { userName, userEmail, userRole, userPassword } = userData;
  
  const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created - Taalam</title>
    <style>
        /* Reset and base styles */
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f5f5;
            width: 100%;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        /* Container for centering */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        /* Header section */
        .header {
            text-align: center;
            padding: 40px 40px 30px 40px;
        }

        .main-title {
            color: #032746;
            font-size: 36px;
            font-weight: bold;
            margin: 0;
            padding: 0;
            line-height: 1.3;
        }

        .subtitle {
            color: #6B7280;
            font-size: 18px;
            font-weight: normal;
            margin: 0;
            padding: 0;
        }

        /* Content section */
        .content {
            padding: 0 40px;
            font-size: 15px;
            color: #6B7280;
            text-align: center;
        }

        .greeting {
            margin: 0 0 10px 0;
        }

        .description {
            margin: 0 0 20px 0;
            font-size: 14px;
            line-height: 1.6;
        }

        .login-details-heading {
            font-size: 14px;
            font-weight: normal;
            margin: 0 0 25px 0;
            color: #666666;
        }

        /* Account details box */
        .account-details {
            border: 1px solid #e0e0e0;
            margin: 0 0 30px 0;
            border-radius: 6px;
            background-color: #f9f9f9;
            overflow: hidden;
        }

        .account-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            color: #000000;
            padding: 20px;
            background-color: #ffffff;
            border-bottom: 1px solid #e0e0e0;
        }

        .detail-row {
            margin: 0;
            display: flex;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #e0e0e0;
            justify-content: space-between;
        }

        .detail-row:last-of-type {
            border-bottom: none;
        }

        .detail-label {
            font-weight: 600;
            color: #003d6b;
            flex-shrink: 0;
            font-size: 14px;
        }

        .detail-value {
            color: #666666;
            flex-grow: 1;
            text-align: right;
            font-size: 14px;
        }

        .password-value {
            font-family: 'Courier New', monospace;
            background-color: #f5f5f5;
            border: 1px solid #dddddd;
            padding: 6px 10px;
            border-radius: 3px;
            font-weight: normal;
            color: #333333;
            display: inline-block;
            font-size: 13px;
        }

        /* Login section */
        .login-section {
            text-align: center;
            margin: 0 0 30px 0;
        }

        .login-button {
            display: block;
            background-color: #ff5722;
            color: #ffffff;
            text-decoration: none;
            padding: 16px 30px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 16px;
            border: none;
            cursor: pointer;
            width: 100%;
            box-sizing: border-box;
        }

        .login-button:hover {
            background-color: #e64a19;
        }

        /* Security note */
        .security-note {
            background-color: transparent;
            border: none;
            padding: 0;
            margin: 0 0 25px 0;
            border-radius: 0;
            font-size: 14px;
            color: #ff5722;
            font-weight: 500;
            text-align: center;
        }

        /* Footer */
        .footer {
            padding: 0 40px 30px 40px;
            font-size: 14px;
            color: #999999;
            text-align: center;
        }

        .contact-note {
            margin: 0;
        }

        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }

            .header {
                padding: 30px 20px 20px 20px;
            }

            .main-title {
                font-size: 24px;
            }

            .content {
                padding: 0 20px;
            }

            .footer {
                padding: 0 20px 20px 20px;
            }

            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                text-align: left;
            }

            .detail-value {
                text-align: left;
                margin-top: 5px;
            }

            .login-button {
                padding: 14px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1 class="main-title">Your Taalam Account Has Been Created</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Hello ${userName}, Your Account has been successfully created on Taalam-Question Bank Management System by the administrator.<br>Below are your login details:</p>

            <!-- Account Details Box -->
            <div class="account-details">
                <h2 class="account-title">Account Details</h2>

                <div class="detail-row">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">${userEmail}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Role Assigned:</div>
                    <div class="detail-value">${userRole}</div>
                </div>

                <div class="detail-row">
                    <div class="detail-label">Temporary Password:</div>
                    <div class="detail-value">
                        <span class="password-value">${userPassword}</span>
                    </div>
                </div>
            </div>

            <!-- Login Section -->
            <div class="login-section">
                <a href="${loginUrl}" class="login-button">Login to Your Account</a>
            </div>

            <!-- Security Note -->
            <div class="security-note">
                <strong>For your security,</strong> Please login and change your password immediately after your first login.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="contact-note">If you face any issue accessing your account, please contact your system administrator.</p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Send Taalam account creation email
 */
const sendTaalamAccountEmail = async (email, name, role, password) => {
  // Validate email configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const error = new Error('SMTP configuration is missing. SMTP_USER and SMTP_PASS environment variables are required.');
    console.error('Email configuration error:', error.message);
    throw error;
  }

  const userData = {
    userName: name || email,
    userEmail: email,
    userRole: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize first letter
    userPassword: password,
  };

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Talaam'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Taalam Account Has Been Created',
    html: createTaalamAccountEmail(userData),
  };

  console.log('Attempting to send account creation email:', {
    to: email,
    from: mailOptions.from,
    role: role,
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpUser: process.env.SMTP_USER ? 'Set' : 'Missing',
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Taalam account creation email sent successfully:', {
      messageId: info.messageId,
      to: email,
      accepted: info.accepted,
      rejected: info.rejected,
    });
    return info;
  } catch (error) {
    console.error('Error sending Taalam account creation email:', {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode,
      command: error.command,
      response: error.response,
      to: email,
    });
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendTaalamAccountEmail,
};

