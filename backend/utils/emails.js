const { sendEmail } = require("../lib/resend");


async function sendVerificationEmail(user, token) {
  const verificationLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${token}`;

    const html = `
        <div style="font-family: Arial; padding: 20px;">
            <h2>Verify your email</h2>
            <p>Welcome to Snippet 👋</p>
            <p>Click below to verify your email:</p>
            <a 
            href="${verificationLink}" 
            style="
                display:inline-block;
                padding:10px 20px;
                background:#4f46e5;
                color:white;
                text-decoration:none;
                border-radius:6px;
            "
            >
            Verify Email
            </a>
            <p>If you didn't create this account, ignore this email.</p>
        </div>
        `;
    
  await sendEmail({
    to: user.email,
    subject: "Snippet - Verify your email",
    html
  });
}

module.exports = {
  sendVerificationEmail
};