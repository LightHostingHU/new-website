interface ResetPasswordEmailParams {
  resetLink: string;
  supportEmail: string;
  appName: string;
}

export function getResetPasswordEmailTemplate(
  params: ResetPasswordEmailParams
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Reset Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #2563eb; font-size: 24px; margin-bottom: 20px; }
        .button { 
          display: inline-block; padding: 12px 24px; background-color: #2563eb; 
          color: white; text-decoration: none; border-radius: 4px; margin: 15px 0; 
          font-weight: bold;
        }
        .footer { margin-top: 30px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">Password Reset Request</div>
      <p>We received a request to reset your password for ${params.appName}. Click the button below to proceed:</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="${params.resetLink}" class="button">Reset Password</a>
      </div>
      
      <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
      
      <div class="footer">
        <p>This link will expire in 1 hour.</p>
        <p>If you're having trouble with the button above, copy and paste this link into your browser:</p>
        <p>${params.resetLink}</p>
        <p>Need help? Contact our support team at <a href="mailto:${params.supportEmail}">${params.supportEmail}</a></p>
      </div>
    </body>
    </html>
  `;
}
