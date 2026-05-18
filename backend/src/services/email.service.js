const transporter = require('../config/nodemailer');

const BRAND_COLORS = {
  primary: '#0b3c5d',   // Deep Blue
  accent: '#1abc9c',    // Turquoise
  text: '#333333',
  background: '#f4f6f8'
};

const getBaseTemplate = (title, content, actionUrl = null, actionText = null) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: ${BRAND_COLORS.background};
            color: ${BRAND_COLORS.text};
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: ${BRAND_COLORS.primary};
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
          }
          .header p {
            color: ${BRAND_COLORS.accent};
            margin: 5px 0 0 0;
            font-size: 14px;
          }
          .content {
            padding: 30px;
            line-height: 1.6;
            font-size: 16px;
          }
          .button-container {
            text-align: center;
            margin: 25px 0;
          }
          .button {
            background-color: ${BRAND_COLORS.accent};
            color: #ffffff !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
            box-shadow: 0 2px 5px rgba(26, 188, 156, 0.3);
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            border-top: 1px solid #eef2f5;
          }
          .footer a {
            color: ${BRAND_COLORS.accent};
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VIDYAVAIDYA</h1>
            <p>Healthcare & Education Foundation</p>
          </div>
          <div class="content">
            ${content}
            ${actionUrl && actionText ? `
              <div class="button-container">
                <a href="${actionUrl}" class="button">${actionText}</a>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Vidyavaidya Foundation. All rights reserved.</p>
            <p>Nellore, Andhra Pradesh, India</p>
            <p>You received this email because you registered or donated on <a href="https://vidyavaidya.org">Vidyavaidya</a>.</p>
            <p><a href="{{unsubscribe}}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const emailService = {
  /**
   * General purpose send email helper
   */
  async sendMail({ to, subject, html, attachments = [] }) {
    try {
      const info = await transporter.sendMail({
        from: `"Vidyavaidya Foundation" <${process.env.EMAIL_USER || 'vidyavaidyanlr@gmail.com'}>`,
        to,
        subject,
        html,
        attachments
      });
      console.log(`✉️ Email successfully sent to ${to}. Message ID: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('❌ Error dispatching email via Nodemailer:', error);
      // Fail gracefully so that process flow (like webhook verification) is not broken by email server hiccups
      return null;
    }
  },

  /**
   * Welcome Email for New Signups
   */
  async sendWelcomeEmail(email, fullName) {
    const content = `
      <h3>Dear ${fullName || 'Friend'},</h3>
      <p>A warm welcome to the <strong>Vidyavaidya Foundation</strong> family! We are thrilled to have you join our mission of enabling quality healthcare and life-changing education opportunities for underprivileged communities.</p>
      <p>Through your personal dashboard, you will be able to track your donation history, apply to join our diverse volunteer teams, initiate corporate social responsibility (CSR) collaborations, and stay informed about ongoing community welfare camps.</p>
      <p>Please secure your login credentials and verify your email to unlock all features of our portal.</p>
      <p>Thank you for extending your hand of support.</p>
      <p>Warm Regards,<br><strong>Team Vidyavaidya</strong></p>
    `;
    const html = getBaseTemplate('Welcome to Vidyavaidya!', content, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth`, 'Access Your Dashboard');
    return this.sendMail({ to: email, subject: 'Welcome to Vidyavaidya Foundation! 🚀', html });
  },

  /**
   * Tax-exempt Receipt & Thank You Email
   */
  async sendDonationSuccessEmail(email, donation, pdfBuffer) {
    const content = `
      <h3>Dear ${donation.donorName || 'Donor'},</h3>
      <p>On behalf of the children, patients, and entire team at Vidyavaidya, we express our deepest gratitude for your generous donation of <strong>INR ${donation.amount.toFixed(2)}</strong> towards our <strong>${donation.category}</strong> initiative.</p>
      <p>Your contribution makes a direct impact. Every single rupee helps us reach individuals in critical need of healthcare and quality education.</p>
      <p><strong>Exemption benefits:</strong> As requested, your 80G tax exemption receipt is attached to this email. You can also view and download all your historical donation receipts anytime from your user dashboard.</p>
      <p><strong>Donation Receipt Details:</strong></p>
      <ul>
        <li><strong>Receipt Number:</strong> ${donation.receiptNumber}</li>
        <li><strong>Transaction ID:</strong> ${donation.donationId}</li>
        <li><strong>Amount:</strong> INR ${donation.amount.toFixed(2)}</li>
        <li><strong>Cause Category:</strong> ${donation.category}</li>
      </ul>
      <p>Thank you once again for your incredible benevolence.</p>
      <p>With deep gratitude,<br><strong>Trustees, Vidyavaidya Foundation</strong></p>
    `;
    const html = getBaseTemplate('Thank you for your donation!', content);
    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `${donation.receiptNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }
    return this.sendMail({
      to: email,
      subject: `Thank you! Donation of INR ${donation.amount.toFixed(2)} Successful | Vidyavaidya 💖`,
      html,
      attachments
    });
  },

  /**
   * Payment Failure Warning
   */
  async sendDonationFailedEmail(email, order) {
    const content = `
      <h3>Dear Supporter,</h3>
      <p>We noticed that your attempt to donate <strong>INR ${(order.amount / 100).toFixed(2)}</strong> to Vidyavaidya was not successful. The payment gateway returned a transaction failure status.</p>
      <p>If the money was deducted from your bank account, please do not worry. Razorpay will automatically refund the amount within 5-7 business days. Alternatively, we will capture the transaction and generate your receipt asynchronously once confirmed by our bank.</p>
      <p>If you'd like to try again, please click below or visit our donation portal.</p>
      <p>We are grateful for your intent to support our causes.</p>
    `;
    const html = getBaseTemplate('Donation Payment Attempt Failed', content, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/donate`, 'Retry Donation');
    return this.sendMail({
      to: email,
      subject: 'Transaction Unsuccessful - Vidyavaidya Donation ⚠️',
      html
    });
  },

  /**
   * Contact Form Submission
   */
  async sendContactSubmissionEmails(contact) {
    // 1. Send Auto-Reply to Submitter
    const userContent = `
      <h3>Hello ${contact.name},</h3>
      <p>Thank you for reaching out to the Vidyavaidya Foundation. We have received your query regarding <strong>"${contact.queryType}"</strong>.</p>
      <p>Our administrative team has logged your submission (Ticket Ref: ${contact.contactId.slice(-6).toUpperCase()}) and is reviewing it. We aim to respond to all inquiries within 2 to 3 business days.</p>
      <p><strong>Your Message Details:</strong></p>
      <blockquote style="background: #f7f9fa; border-left: 4px solid ${BRAND_COLORS.accent}; padding: 10px; margin: 10px 0;">
        <strong>Subject:</strong> ${contact.subject}<br>
        <strong>Message:</strong> ${contact.message}
      </blockquote>
      <p>Have a great day ahead!</p>
      <p>Warm Regards,<br><strong>Team Vidyavaidya Helpdesk</strong></p>
    `;
    const userHtml = getBaseTemplate("We've received your query!", userContent);
    await this.sendMail({ to: contact.email, subject: `We have received your Vidyavaidya Inquiry [Ref: ${contact.contactId.slice(-6).toUpperCase()}]`, html: userHtml });

    // 2. Alert Admins (to info@vidyavaidya.org or the configured EMAIL_USER)
    const adminContent = `
      <h3>🚨 New Contact Submission Received</h3>
      <p>A user has submitted an inquiry on the Vidyavaidya website:</p>
      <table cellpadding="6" cellspacing="0" border="1" style="border-collapse: collapse; border-color: #dddddd; width: 100%;">
        <tr><td><strong>Name</strong></td><td>${contact.name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${contact.email}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${contact.phone || 'Not Provided'}</td></tr>
        <tr><td><strong>Category</strong></td><td>${contact.queryType}</td></tr>
        <tr><td><strong>Subject</strong></td><td>${contact.subject}</td></tr>
        <tr><td><strong>Message</strong></td><td>${contact.message}</td></tr>
      </table>
      <p>Please log in to the admin panel to address or assign this ticket.</p>
    `;
    const adminHtml = getBaseTemplate("New Helpdesk Inquiry", adminContent);
    await this.sendMail({
      to: 'info@vidyavaidya.org',
      subject: `🚨 Alert: New [${contact.queryType}] submission from ${contact.name}`,
      html: adminHtml
    });
  },

  /**
   * Community Application Received
   */
  async sendCommunityApplicationReceivedEmail(app) {
    const userContent = `
      <h3>Dear ${app.applicantName},</h3>
      <p>Thank you for submitting your application to join the Vidyavaidya Community as a <strong>${app.type.toUpperCase()}</strong> partner.</p>
      <p>Your application (ID: ${app.applicationId}) is currently <strong>Under Review</strong> by our verification board. We carefully audit all applications (especially volunteering interests and medical/healthcare partnership registrations) to ensure alignment with standard protocols.</p>
      <p>You can monitor the real-time status of your application from your personal user dashboard.</p>
      <p>Thank you for taking this step to create a positive social impact.</p>
    `;
    const userHtml = getBaseTemplate("Application Received", userContent, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`, 'Check Application Status');
    await this.sendMail({ to: app.applicantEmail, subject: `Community Application [${app.type.toUpperCase()}] Received | Vidyavaidya`, html: userHtml });

    const adminContent = `
      <h3>🌍 New Community Application Submitted</h3>
      <p>A new partnership application has been filed on the Vidyavaidya platform:</p>
      <ul>
        <li><strong>Applicant:</strong> ${app.applicantName} (${app.applicantEmail})</li>
        <li><strong>Application Type:</strong> ${app.type.toUpperCase()}</li>
        <li><strong>Status:</strong> Pending Review</li>
      </ul>
      <p>Please navigate to the admin portal applications console to approve or reject this request.</p>
    `;
    const adminHtml = getBaseTemplate("New Community Application", adminContent);
    await this.sendMail({
      to: 'info@vidyavaidya.org',
      subject: `🌍 Alert: New ${app.type.toUpperCase()} application from ${app.applicantName}`,
      html: adminHtml
    });
  },

  /**
   * Community Application Approval/Rejection
   */
  async sendCommunityApplicationStatusEmail(app) {
    const isApproved = app.status === 'approved';
    const statusText = isApproved ? 'APPROVED 🎉' : 'REJECTED';
    
    let content = `
      <h3>Dear ${app.applicantName},</h3>
      <p>We are writing to update you on your application to join the Vidyavaidya Community as a <strong>${app.type.toUpperCase()}</strong>.</p>
      <p>Our review board has evaluated your request. The status of your application has been updated to: <strong style="color: ${isApproved ? BRAND_COLORS.accent : '#e74c3c'}">${statusText}</strong>.</p>
    `;

    if (isApproved) {
      content += `
        <p><strong>Welcome Aboard!</strong> We are excited to collaborate with you. Our administrative team will reach out directly to your registered contact number to orchestrate onboarding schedules, training briefings, or facility audits.</p>
        <p>Your portal login custom claims have been updated accordingly to authorize community-tier actions.</p>
      `;
    } else {
      content += `
        <p>Unfortunately, we are unable to approve your application at this time.</p>
        ${app.adminNotes ? `<p><strong>Feedback from Review Board:</strong> <em>"${app.adminNotes}"</em></p>` : ''}
        <p>We encourage you to review our community collaboration guides and re-apply in the future or contact us if you believe this was an error.</p>
      `;
    }

    content += `<p>Best Regards,<br><strong>Community Board, Vidyavaidya Foundation</strong></p>`;
    const html = getBaseTemplate(`Community Application Status Update`, content);
    
    return this.sendMail({
      to: app.applicantEmail,
      subject: `Vidyavaidya Community Application Status: [${statusText}]`,
      html
    });
  }
};

module.exports = emailService;
