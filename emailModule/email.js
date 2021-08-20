const nodemailer = require('nodemailer');
const EMAIL = 'azeemhaider817@gmail.com';
const PASSWORD = 'azeem0322.,';

module.exports = class Email {
	constructor(user, token) {
		this.to = user.email;
		this.firstName = user.firstName;
		this.token = token;
		this.from = `tezdealz <${EMAIL}>`;
	}

	newTransport() {
		return nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: EMAIL,
				pass: PASSWORD,
			},
		});
	}

	async send(subject) {
		// mail options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			text: `token ${this.token}`,
		};
		//create transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendEmailVerificationToken() {
		await this.send('Your email Verification token');
	}

	async sendPasswordResetToken() {
		await this.send('Your Password Reset Link(only valid for 10 minutes)');
	}
};
