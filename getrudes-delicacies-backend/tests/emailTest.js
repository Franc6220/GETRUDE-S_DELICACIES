// emailTest.js
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.mail.yahoo.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to: 'getrudegrande14@gmail.com',  // Always use a valid recipient email address
			subject: 'Test Email',
			text: 'This is a test email from Nodemailer',
		};

		await transporter.sendMail(mailOptions);
		console.log('Test email sent successfully');
	} catch (error) {
		console.error('Error sending test email:', error);
	}
}

sendTestEmail();
