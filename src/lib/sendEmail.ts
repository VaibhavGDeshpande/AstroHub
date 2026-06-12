export async function notifySubscribers(emails: string[], subject: string, content: string) {
  if (!emails || emails.length === 0) return;

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.log("Mock Email Sent (EmailJS credentials missing)");
    console.log(`To: ${emails.length} subscribers`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    return;
  }

  // Depending on email count, we might want to send individually to avoid revealing addresses
  for (const email of emails) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {
            to_email: email,
            email: email,     // Fallback if template uses {{email}}
            to_name: email,   // Fallback if template uses {{to_name}}
            subject: subject,
            message: content,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`Failed to send email to ${email}:`, errText);
      }
    } catch (err) {
      console.error(`Failed to send email to ${email}`, err);
    }
  }
}
