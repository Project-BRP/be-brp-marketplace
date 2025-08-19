import fs from 'fs';
import path from 'path';
import {
  IEmailDto,
  IEmailVerificationPayload,
  IGetTransactionResponse,
} from '../dtos';
import { SMPTP_CONSTANTS } from '../constants';
import { SendToKafka } from '../kafka';
import { CLIENT_URL_CURRENT } from './client-url-utils';
import { PDFUtils } from './pdf-utils';
import { appLogger } from '../configs/logger';

export class EmailUtils {
  static async sendVerificationEmail(
    payload: IEmailVerificationPayload,
    token: string,
  ): Promise<void> {
    const verificationLink = `${CLIENT_URL_CURRENT}/sign-up/${token}`;

    const templatePath = path.join(__dirname, 'email-verification.html');
    let emailHtml = fs.readFileSync(templatePath, 'utf-8');
    emailHtml = emailHtml.replace('{{verification_link}}', verificationLink);

    const logoUrl = EmailUtils.getLogoUrl();
    emailHtml = emailHtml.replace('{{logo_url}}', logoUrl);

    const emailData: IEmailDto = {
      from: SMPTP_CONSTANTS.SMTP_EMAIL,
      to: payload.email,
      subject: 'Verifikasi Email',
      html: emailHtml,
    };

    await SendToKafka.sendEmailMessage(emailData);
  }

  static async sendResetPasswordEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const resetLink = `${CLIENT_URL_CURRENT}/forget-password/${token}`;

    const templatePath = path.join(__dirname, 'reset-password-template.html');
    let emailHtml = fs.readFileSync(templatePath, 'utf-8');
    emailHtml = emailHtml.replace('{{reset_link}}', resetLink);

    const logoUrl = EmailUtils.getLogoUrl();
    emailHtml = emailHtml.replace('{{logo_url}}', logoUrl);

    const emailData: IEmailDto = {
      from: SMPTP_CONSTANTS.SMTP_EMAIL,
      to: email,
      subject: 'Reset Password',
      html: emailHtml,
    };

    await SendToKafka.sendEmailMessage(emailData);
  }

  static async sendInvoiceEmail(transaction: IGetTransactionResponse) {
    const pdfPath = await PDFUtils.createInvoice(transaction);
    try {
      const templatePath = path.join(__dirname, 'invoice-email-template.html');
      let emailHtml = fs.readFileSync(templatePath, 'utf-8');

      const logoUrl = EmailUtils.getLogoUrl();
      emailHtml = emailHtml.replace('{{logo_url}}', logoUrl);

      const emailData: IEmailDto = {
        from: SMPTP_CONSTANTS.SMTP_EMAIL,
        to: transaction.userEmail,
        subject: 'Invoice Pembelian Anda',
        html: emailHtml,
        attachments: [
          {
            filename: `invoice_${transaction.id}.pdf`,
            path: pdfPath,
            contentType: 'application/pdf',
          },
        ],
      };

      await SendToKafka.sendEmailMessage(emailData);
    } catch (error) {
      appLogger.error('Error sending invoice email:', error);
      fs.unlink(pdfPath, err => {
        if (err) appLogger.error('Gagal hapus file invoice:', err);
      });
    }
  }

  private static getLogoUrl(): string {
    const serverDomain = process.env.SERVER_DOMAIN;
    const uploadPath = process.env.UPLOADS_PATH;

    const logoDir = path.join(__dirname, '..', '..', uploadPath, 'logo');
    const logoName = fs
      .readdirSync(logoDir)
      .find(file => /\.(png|jpg|jpeg|webp)$/i.test(file));

    if (!logoName) {
      appLogger.error('Logo tidak ditemukan');
      return '';
    }

    return `${serverDomain}/${uploadPath}/logo/${logoName}`;
  }
}
