import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to send real OTP email to user inbox
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { recipientEmail, recipientName, otpCode, purpose } = req.body;

      if (!recipientEmail || !otpCode) {
        return res.status(400).json({ success: false, message: "Missing recipient email or OTP code." });
      }

      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || `"Attendance Security" <${smtpUser || "noreply@college.edu"}>`;

      // Check if real SMTP credentials are configured in environment
      if (!smtpUser || !smtpPass) {
        console.log(`[OTP DISPATCH] SMTP credentials not set in environment. Simulated dispatch to ${recipientEmail} with OTP: ${otpCode}`);
        return res.json({
          success: true,
          deliveredToInbox: false,
          message: `SMTP email server not configured in environment (.env). The OTP (${otpCode}) was generated for ${recipientEmail}. Add SMTP_USER and SMTP_PASS to send emails to real inboxes.`
        });
      }

      // Initialize Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const subject = purpose === "registration" 
        ? "🔐 Account Registration OTP Verification Code" 
        : "🔐 Security Verification: OTP Password Reset";

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #1e293b; text-align: center; margin-top: 0; font-size: 20px;">Student Attendance System</h2>
          <p style="color: #475569; font-size: 14px;">Hello ${recipientName || 'User'},</p>
          <p style="color: #475569; font-size: 14px;">Your 6-digit confirmation OTP code for <strong>${purpose === 'registration' ? 'Account Registration' : 'Password Recovery'}</strong> is:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb; background-color: #eff6ff; padding: 12px 24px; border-radius: 8px; border: 1px solid #bfdbfe; display: inline-block;">${otpCode}</span>
          </div>
          <p style="color: #64748b; font-size: 12px; text-align: center;">This code will expire in 10 minutes. If you did not request this verification code, please ignore this email.</p>
        </div>
      `;

      await transporter.sendMail({
        from: smtpFrom,
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
      });

      console.log(`[OTP DISPATCH] Real email delivered to inbox: ${recipientEmail}`);
      return res.json({
        success: true,
        deliveredToInbox: true,
        message: `Real confirmation email sent directly to ${recipientEmail}!`
      });
    } catch (error: any) {
      console.error("[OTP DISPATCH ERROR]", error);
      return res.status(500).json({
        success: false,
        deliveredToInbox: false,
        message: `Failed to dispatch email via SMTP: ${error.message || error}`
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
