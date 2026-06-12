import { config } from 'dotenv';
config({ path: '.env.local' });
const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.EMAILJS_TEMPLATE_ID;
const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const privateKey = process.env.EMAILJS_PRIVATE_KEY;

console.log('Credentials:', { serviceId, templateId, publicKey, privateKey });

fetch('https://api.emailjs.com/api/v1.0/email/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    service_id: serviceId?.trim(),
    template_id: templateId?.trim(),
    user_id: publicKey?.trim(),
    accessToken: privateKey?.trim(),
    template_params: {
      to_email: 'test@example.com',
      email: 'test@example.com',
      to_name: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
    },
  }),
}).then(async res => {
  if (res.ok) console.log('Success!');
  else console.error(await res.text());
}).catch(console.error);
