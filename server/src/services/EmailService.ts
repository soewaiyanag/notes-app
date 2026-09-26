export default class EmailService {
  // No SMTP provider is configured for this project — log the email to the
  // server console instead so the reset flow is testable end-to-end locally.
  static async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    console.info(
      `\n[EmailService] Password reset requested for ${email}\n` +
        `Reset link: ${resetUrl}\n`,
    );
  }
}
