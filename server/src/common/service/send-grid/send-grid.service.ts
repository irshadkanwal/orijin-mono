// sendgrid.service.ts
import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  logger = new Logger(SendGridService.name);

  private apiKey = process.env.SENDGRID_API_KEY;
  constructor() {
    if (!this.apiKey) {
      if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'ci') {
        this.logger.error(
          'SENDGRID_API_KEY not found in environment variables.',
        );
      }
      return;
    }
  }

  async sendMail(
    to: string,
    subject: string,
    text?: string,
    html?: string,
    data?: any,
  ) {
    sgMail.setApiKey(this.apiKey);
    const fromEmail: string | undefined = process.env.SENDGRID_SENDER_EMAIL;
    if (!fromEmail) {
      throw new Error(
        'SENDGRID_SENDER_EMAIL not found in environment variables.',
      );
    }
    const msg: any = {
      to,
      from: fromEmail, // Use the email address or domain you verified with SendGrid
      subject,
    };

    if (text) {
      msg.text = text;
    }

    if (html) {
      msg.html = html;
    }

    if (data) {
      const templateId: string | undefined =
        process.env.SENDGRID_EMAIL_TEMPLATE_ID;
      if (!templateId) {
        throw new Error(
          'SENDGRID_EMAIL_TEMPLATE_ID not found in environment variables.',
        );
      }
      msg.templateId = templateId;
      msg.dynamic_template_data = {
        ...data,
        subject,
      };
    }
    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('Error response body:', error.response.body);
        throw new Error(
          error.response.body.errors[0]?.message || 'Error sending email',
        );
      }
      throw new Error('Unknown error sending email');
    }
  }
}
