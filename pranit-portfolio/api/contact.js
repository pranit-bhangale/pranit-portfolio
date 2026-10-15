export default async function handler(req, res) {
    // Only allow POST requests for secure form submission
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, message } = req.body;

        // Basic spam protection: Reject empty fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are all required.' });
        }

        // Basic payload validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format provided.' });
        }

        // Native zero-dependency REST request to Resend
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Portfolio Contact <onboarding@resend.dev>', // Resend's free testing domain
                to: process.env.CONTACT_EMAIL || 'pranitbhangale14@gmail.com', // The secure email to receive messages at
                subject: `New Portfolio Message from ${name}`,
                reply_to: email, // This allows you to click "Reply" in Gmail and send it directly back to the user
                html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

<table align="center" width="100%" cellpadding="0" cellspacing="0" 
style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;
overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.05);">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);
    padding:30px;text-align:center;color:#ffffff;">
      <h1 style="margin:0;font-size:22px;">📩 New Portfolio Message</h1>
      <p style="margin:6px 0 0 0;font-size:14px;opacity:0.9;">
        Someone contacted you through your website
      </p>
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:25px 30px 10px 30px;color:#333;">
      <p style="font-size:16px;margin:0 0 10px 0;">
        Hello Pranit 👋,
      </p>
      <p style="font-size:14px;margin:0;">
        You have received a new message from your portfolio contact form.
      </p>
    </td>
  </tr>

  <!-- Details -->
  <tr>
    <td style="padding:10px 30px;">
      <table width="100%" cellpadding="8" cellspacing="0" 
      style="border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="font-weight:bold;width:130px;">Name:</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td style="font-weight:bold;">Email:</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td style="font-weight:bold;">Received At:</td>
          <td>${new Date().toISOString()}</td>
        </tr>
        <tr>
          <td style="font-weight:bold;">IP Address:</td>
          <td>${req.headers['x-forwarded-for'] || req.socket.remoteAddress}</td>
        </tr>
        <tr>
          <td style="font-weight:bold;">User Agent:</td>
          <td style="word-break:break-all;">
            ${req.headers['user-agent']}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Message Box -->
  <tr>
    <td style="padding:20px 30px;">
      <p style="font-weight:bold;margin-bottom:10px;">Message:</p>
      <div style="background:#f9fafb;padding:18px;border-radius:8px;
      border:1px solid #e5e7eb;">
        <p style="white-space:pre-wrap;margin:0;font-size:14px;">
          ${message}
        </p>
      </div>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#f9fafb;padding:20px;text-align:center;
    font-size:12px;color:#6b7280;">
      This email was automatically generated from your portfolio website.<br/>
      © ${new Date().getFullYear()} Pranit Portfolio
    </td>
  </tr>

</table>

</body>
</html>
`
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Resend API Error:', errorData);
            return res.status(500).json({ error: 'Failed to send message.' });
        }

        // Successfully dispatched
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Serverless Function Initialization Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
