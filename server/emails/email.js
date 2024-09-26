import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export default class Email {
  constructor(user, data) {
    this.to = user.email;
    this.data = data;
    this.from = `Theophilus <${process.env.SMTP_MAIL}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Send Actual Email
  async send(template, subject) {
    const __dirname = path.resolve();
    //get the path to the email template file
    const emailTemplatePath = path.join(
      __dirname,
      "./emails/mailTemplates",
      template
    );

    //Render the email template with EJS
    const html = await ejs.renderFile(emailTemplatePath, this.data);

    // Define mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
    // , (error, info) => {
    //   if (error) {
    //     console.error("Error:", error.message);
    //   } else {
    //     console.log("Email sent:", info.response);
    //   }
    // });
  }

  async activateRegistration() {
    await this.send("activation-mail.ejs", "Activate Your Account");
  }

  async welcome() {
    await this.send("welcome.ejs", "We're happy to have you!");
  }

  async sendPasswordReset() {
    await this.send(
      "forgot-password.ejs",
      "Your password reset token (valid for only 10 minutes)"
    );
  }

  async accountReactivated() {
    await this.send("re-activation.ejs", "Account Reactivated!");
  }
}
