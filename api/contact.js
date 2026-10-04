import { Resend } from 'resend';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Please send a POST request.',
    });
  }

  // Parse request body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON payload received.',
      });
    }
  }

  const { name, email, message } = body || {};

  // Basic Server-Side Validation
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedName) {
    return res.status(400).json({
      success: false,
      error: 'Name is required.',
    });
  }

  if (!trimmedEmail) {
    return res.status(400).json({
      success: false,
      error: 'Email is required.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.',
    });
  }

  if (!trimmedMessage) {
    return res.status(400).json({
      success: false,
      error: 'Message is required.',
    });
  }

  // Verify RESEND_API_KEY environment variable
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Resend Error]: RESEND_API_KEY environment variable is not defined.');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: RESEND_API_KEY is missing. Please add it to your environment variables.',
    });
  }

  const resend = new Resend(apiKey);

  // Recipient email (defaults to user's portfolio contact email)
  const toEmail = process.env.CONTACT_RECEIVER_EMAIL || 'taharehman419@gmail.com';

  // Sender email (Resend onboarding address for unverified domains, or custom verified domain)
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      reply_to: trimmedEmail,
      subject: `New Portfolio Message from ${trimmedName}`,
      text: `You have received a new contact message from your portfolio:\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}\n\n---\nReply directly to this email to contact ${trimmedName}.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #7c3aed; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; font-size: 20px;">
            📬 New Portfolio Contact Message
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 80px;">From:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(trimmedName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #7c3aed; text-decoration: none;">
                  ${escapeHtml(trimmedEmail)}
                </a>
              </td>
            </tr>
          </table>

          <div style="margin-top: 16px;">
            <p style="color: #64748b; font-weight: 600; margin-bottom: 8px;">Message:</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #7c3aed; border-radius: 6px; padding: 16px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #334155;">${escapeHtml(trimmedMessage)}</div>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px;" />
          
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            💡 You can reply directly to this email to reach <strong>${escapeHtml(trimmedName)}</strong> at <code>${escapeHtml(trimmedEmail)}</code>.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend API Error]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to send message via Resend.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
      id: data?.id,
    });
  } catch (err) {
    console.error('[Unexpected Server Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to send your message. Please try again.',
    });
  }
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
