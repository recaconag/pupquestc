import nodemailer from "nodemailer";
import config from "../config/config";
import AppError from "../global/error";
import { StatusCodes } from "http-status-codes";
import { systemSettingsService } from "../modules/systemSettings/systemSettings.service";

// ── Types ──────────────────────────────────────────────────────────────────────
interface SmtpCreds {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  fromName: string;
  fromEmail: string;
}

// ── Build a transporter from any credentials (used by test-email too) ─────────
export const buildTransporter = (creds: SmtpCreds) => {
  if (!creds.user || !creds.pass) {
    throw new AppError(
      StatusCodes.SERVICE_UNAVAILABLE,
      "Email service is not configured. Please set SMTP credentials in Settings → Email."
    );
  }
  return nodemailer.createTransport({
    host: creds.host,
    port: creds.port,
    secure: creds.secure,
    requireTLS: !creds.secure,
    auth: { user: creds.user, pass: creds.pass },
  });
};

// ── Fetch creds: DB-first, .env fallback ───────────────────────────────────────
const getSmtpCreds = async (): Promise<SmtpCreds> => {
  try {
    const s = await systemSettingsService.getSettings();
    if (s.smtpUser && s.smtpPass) {
      return {
        host:      s.smtpHost      || config.smtp.host,
        port:      s.smtpPort      || config.smtp.port,
        user:      s.smtpUser,
        pass:      s.smtpPass,
        secure:    s.smtpSecure    ?? config.smtp.secure,
        fromName:  s.smtpFromName  || "PUPQuestC",
        fromEmail: s.smtpFromEmail || s.smtpUser,
      };
    }
  } catch {}
  return {
    host:      config.smtp.host,
    port:      config.smtp.port,
    user:      config.smtp.user  || "",
    pass:      config.smtp.pass  || "",
    secure:    config.smtp.secure,
    fromName:  "PUPQuestC",
    fromEmail: config.smtp.from  || config.smtp.user || "",
  };
};

const getTransporter = async () => {
  const creds = await getSmtpCreds();
  return { transporter: buildTransporter(creds), creds };
};

// Backward-compat: called before email ops in auth/user services
// Now async — verifies credentials are available (DB or .env)
export const validateSmtpConfig = async (): Promise<void> => {
  const creds = await getSmtpCreds();
  if (!creds.user || !creds.pass) {
    throw new AppError(
      StatusCodes.SERVICE_UNAVAILABLE,
      "Email service is not configured. Please set SMTP credentials in Settings → Email or the .env file."
    );
  }
};

export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
  const { transporter, creds } = await getTransporter();
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PUPQuestC Identity Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background-color:#1a1a1a;border-radius:16px;border:1px solid #2d1a0e;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7f0000 0%,#9a0000 50%,#5c0000 100%);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#d4a017;">
                Polytechnic University of the Philippines — QC
              </p>
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                PUPQuestC
              </h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:rgba(255,255,255,0.75);">
                Lost &amp; Found Management System
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#e5c87a;">
                Identity Verification
              </h2>
              <p style="margin:0 0 24px 0;font-size:14px;color:#9ca3af;line-height:1.6;">
                You requested to create a PUPQuestC account. Use the verification code below to complete your registration.
              </p>

              <!-- OTP Box -->
              <div style="background:#0f0f0f;border:2px solid #7f0000;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;">
                  Your Verification Code
                </p>
                <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:0.35em;color:#e5c87a;font-variant-numeric:tabular-nums;">
                  ${otp}
                </p>
              </div>

              <!-- Warning -->
              <div style="background:#1c1007;border:1px solid #7f000040;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#d97706;line-height:1.5;">
                  ⏱ This code will expire in <strong>10 minutes</strong>.<br/>
                  🔒 Do <strong>not</strong> share this code with anyone — PUPQuestC staff will never ask for it.
                </p>
              </div>

              <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                If you did not request this, please disregard this email. Your account will not be created without verification.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111111;border-top:1px solid #2d1a0e;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#4b5563;">
                © ${new Date().getFullYear()} PUPQuestC · Polytechnic University of the Philippines — Quezon City
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"${creds.fromName}" <${creds.fromEmail}>`,
    to,
    subject: "PUPQuestC: Identity Verification",
    html,
  });
};

export const send2FAEmail = async (to: string, otp: string): Promise<void> => {
  const { transporter, creds } = await getTransporter();
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PUPQuestC Two-Factor Authentication</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background-color:#1a1a1a;border-radius:16px;border:1px solid #2d1a0e;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#7f0000 0%,#9a0000 50%,#5c0000 100%);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#d4a017;">
                Polytechnic University of the Philippines — QC
              </p>
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">PUPQuestC</h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:rgba(255,255,255,0.75);">Lost &amp; Found Management System</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#e5c87a;">Two-Factor Authentication</h2>
              <p style="margin:0 0 24px 0;font-size:14px;color:#9ca3af;line-height:1.6;">
                A sign-in attempt was made on your PUPQuestC account. Enter the code below to complete login.
              </p>
              <div style="background:#0f0f0f;border:2px solid #7f0000;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;">Your 2FA Code</p>
                <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:0.35em;color:#e5c87a;font-variant-numeric:tabular-nums;">${otp}</p>
              </div>
              <div style="background:#1c1007;border:1px solid #7f000040;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#d97706;line-height:1.5;">
                  ⏱ This code expires in <strong>10 minutes</strong>.<br/>
                  🔒 If you did not attempt to log in, secure your account immediately.
                </p>
              </div>
              <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">Never share this code with anyone — PUPQuestC staff will never ask for it.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#111111;border-top:1px solid #2d1a0e;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#4b5563;">© ${new Date().getFullYear()} PUPQuestC · Polytechnic University of the Philippines — Quezon City</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"${creds.fromName}" <${creds.fromEmail}>`,
    to,
    subject: "PUPQuestC: Your 2FA Login Code",
    html,
  });
};

export const sendPasswordRecoveryEmail = async (to: string, otp: string): Promise<void> => {
  const { transporter, creds } = await getTransporter();
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PUPQuestC Password Recovery</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background-color:#1a1a1a;border-radius:16px;border:1px solid #2d1a0e;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7f0000 0%,#9a0000 50%,#5c0000 100%);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#d4a017;">
                Polytechnic University of the Philippines — QC
              </p>
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                PUPQuestC
              </h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:rgba(255,255,255,0.75);">
                Lost &amp; Found Management System
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#e5c87a;">
                Password Recovery Request
              </h2>
              <p style="margin:0 0 24px 0;font-size:14px;color:#9ca3af;line-height:1.6;">
                A password reset was requested for your PUPQuestC account. Use the recovery code below to set a new password.
              </p>

              <!-- OTP Box -->
              <div style="background:#0f0f0f;border:2px solid #7f0000;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;">
                  Your Recovery Code
                </p>
                <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:0.35em;color:#e5c87a;font-variant-numeric:tabular-nums;">
                  ${otp}
                </p>
              </div>

              <!-- Warning -->
              <div style="background:#1c1007;border:1px solid #7f000040;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#d97706;line-height:1.5;">
                  ⏱ This code is valid for <strong>10 minutes</strong>.<br/>
                  🔒 If you did not request this, please secure your account immediately — do <strong>not</strong> share this code with anyone.
                </p>
              </div>

              <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111111;border-top:1px solid #2d1a0e;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#4b5563;">
                © ${new Date().getFullYear()} PUPQuestC · Polytechnic University of the Philippines — Quezon City
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"${creds.fromName}" <${creds.fromEmail}>`,
    to,
    subject: "PUPQuestC: Password Recovery Request",
    html,
  });
};
