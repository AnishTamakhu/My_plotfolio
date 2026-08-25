Minimal Node/Express backend for the portfolio contact form

Quick start

1. Install dependencies
   cd backend
   npm install

2. Create a .env file from the example and fill SMTP credentials
   cp .env.example .env
   (On Windows PowerShell: Copy-Item .env.example .env)

3. Start the server
   npm start

4. By default the contact endpoint is:
   POST http://127.0.0.1:3000/api/contact
   Body: JSON { name, email, message }

Notes
- This server uses nodemailer with SMTP. For production use a transactional email provider (SendGrid, Mailgun, Amazon SES) or provider API.
- Keep credentials out of source control. Use environment variables or a secrets manager.
- The server enables CORS for all origins for convenience. Restrict origins in production.
