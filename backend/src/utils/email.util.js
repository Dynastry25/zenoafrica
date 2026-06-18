const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

// ─── Email Templates ────────────────────────────────────────
const templates = {
  welcome: ({ name, verifyUrl }) => ({
    subject: 'Welcome to Zeno Africa Adventures 🌍',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F5F0E8;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#D4AF37,#A8860A);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#0D0D0D;font-size:28px;">Welcome to Zeno Africa Adventures</h1>
          <p style="color:#0D0D0D;margin:8px 0 0;opacity:0.8;">Your gateway to extraordinary African journeys</p>
        </div>
        <div style="padding:40px 32px;">
          <p style="font-size:18px;">Dear ${name},</p>
          <p style="color:#B8A98A;line-height:1.8;">Welcome to the Zeno Africa Adventures family! We're thrilled to have you as part of our community of passionate African explorers.</p>
          <p style="color:#B8A98A;line-height:1.8;">Please verify your email to unlock all features:</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#D4AF37,#F0D060);color:#0D0D0D;text-decoration:none;border-radius:100px;font-weight:700;font-size:15px;">Verify My Email ✦</a>
          </div>
          <p style="color:#7A6B52;font-size:13px;">Link expires in 24 hours. If you didn't create this account, please ignore this email.</p>
        </div>
        <div style="background:#141414;padding:24px;text-align:center;border-top:1px solid rgba(212,175,55,0.2);">
          <p style="color:#7A6B52;font-size:12px;margin:0;">© 2024 Zeno Africa Adventures · Johannesburg, South Africa</p>
          <p style="color:#7A6B52;font-size:12px;margin:4px 0 0;">📞 0674 448 795 · ✉ zenoafricaadventures@gmail.com</p>
        </div>
      </div>`,
  }),

  bookingConfirmation: ({ name, reference, package: pkg, travelDate, guests, total, deposit }) => ({
    subject: `Booking Confirmed — ${reference} ✈`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F5F0E8;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#D4AF37,#A8860A);padding:32px;text-align:center;">
          <div style="font-size:48px;">✈</div>
          <h1 style="margin:8px 0;color:#0D0D0D;">Booking Confirmed!</h1>
          <p style="color:#0D0D0D;margin:4px 0;font-size:18px;font-weight:700;">Ref: ${reference}</p>
        </div>
        <div style="padding:40px 32px;">
          <p style="font-size:18px;">Dear ${name},</p>
          <p style="color:#B8A98A;">Your adventure booking has been confirmed. Here are your details:</p>
          <div style="background:#1A1A1A;border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:24px;margin:24px 0;">
            ${[['📦 Package', pkg], ['📅 Travel Date', travelDate], ['👥 Guests', guests], ['💰 Total', total], ['💳 Deposit Paid', deposit]].map(([k,v]) => `
              <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="color:#7A6B52;">${k}</span>
                <span style="font-weight:600;color:#D4AF37;">${v}</span>
              </div>`).join('')}
          </div>
          <p style="color:#B8A98A;line-height:1.8;">Our travel specialist will contact you within 24 hours to finalise all details. In the meantime, feel free to reach out:</p>
          <p style="color:#D4AF37;">📞 0674 448 795 · ✉ zenoafricaadventures@gmail.com</p>
        </div>
        <div style="background:#141414;padding:24px;text-align:center;border-top:1px solid rgba(212,175,55,0.2);">
          <p style="color:#7A6B52;font-size:12px;">© 2024 Zeno Africa Adventures</p>
        </div>
      </div>`,
  }),

  paymentReceipt: ({ name, reference, package: pkg, amount, paymentType, date }) => ({
    subject: `Payment Receipt — ${reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F5F0E8;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#27AE60,#1E8449);padding:32px;text-align:center;">
          <div style="font-size:48px;">💳</div>
          <h1 style="margin:8px 0;color:#FFFFFF;">Payment Received</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0;font-size:22px;font-weight:700;">${amount}</p>
        </div>
        <div style="padding:40px 32px;">
          <p>Dear ${name},</p>
          <p style="color:#B8A98A;">We've received your ${paymentType === 'deposit' ? 'deposit' : 'full'} payment. Thank you!</p>
          <div style="background:#1A1A1A;border:1px solid rgba(39,174,96,0.3);border-radius:12px;padding:24px;margin:24px 0;">
            ${[['Reference', reference], ['Package', pkg], ['Amount', amount], ['Type', paymentType === 'deposit' ? 'Deposit (30%)' : 'Full Payment'], ['Date', date]].map(([k,v]) => `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="color:#7A6B52;">${k}</span><span style="font-weight:600;">${v}</span>
              </div>`).join('')}
          </div>
        </div>
        <div style="background:#141414;padding:24px;text-align:center;border-top:1px solid rgba(212,175,55,0.2);">
          <p style="color:#7A6B52;font-size:12px;">© 2024 Zeno Africa Adventures</p>
        </div>
      </div>`,
  }),

  resetPassword: ({ name, resetUrl, expiry }) => ({
    subject: 'Password Reset Request — Zeno Africa Adventures',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F5F0E8;border-radius:16px;overflow:hidden;">
        <div style="background:#1A1A1A;padding:32px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.2);">
          <h1 style="margin:0;color:#D4AF37;">Password Reset</h1>
        </div>
        <div style="padding:40px 32px;">
          <p>Hi ${name},</p>
          <p style="color:#B8A98A;">We received a password reset request for your Zeno Africa Adventures account.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#D4AF37,#F0D060);color:#0D0D0D;text-decoration:none;border-radius:100px;font-weight:700;">Reset Password</a>
          </div>
          <p style="color:#7A6B52;font-size:13px;">This link expires in ${expiry}. If you didn't request this, please ignore this email — your account is safe.</p>
        </div>
      </div>`,
  }),

  visaReceived: ({ name, reference, destination }) => ({
    subject: `Visa Application Received — ${reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F5F0E8;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#D4AF37,#A8860A);padding:32px;text-align:center;">
          <div style="font-size:48px;">📋</div>
          <h1 style="color:#0D0D0D;margin:8px 0;">Visa Application Received</h1>
        </div>
        <div style="padding:40px 32px;">
          <p>Dear ${name},</p>
          <p style="color:#B8A98A;line-height:1.8;">We've received your visa application for <strong style="color:#D4AF37;">${destination}</strong>. Our certified visa specialists will review your application within 2 business hours.</p>
          <p><strong>Reference:</strong> <span style="color:#D4AF37;">${reference}</span></p>
          <p style="color:#B8A98A;">We'll notify you of any updates and may request additional documents if required.</p>
        </div>
        <div style="background:#141414;padding:24px;text-align:center;border-top:1px solid rgba(212,175,55,0.2);">
          <p style="color:#7A6B52;font-size:12px;">© 2024 Zeno Africa Adventures</p>
        </div>
      </div>`,
  }),
};

// ─── Send Email ──────────────────────────────────────────────
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    let emailContent = { html, text };
    if (template && templates[template]) {
      emailContent = templates[template](data || {});
    }
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Zeno Africa Adventures'}" <${process.env.FROM_EMAIL}>`,
      to,
      subject: subject || emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };
