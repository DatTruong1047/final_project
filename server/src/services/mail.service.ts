import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { emailConfig } from '@config';
import { generateToken } from '@util';

import { EmailTokenPayloadType, TokenOption } from '@app/models';

import UserService from '@services/user.service';

export default class MailService {
  private readonly _userService: UserService;

  constructor() {
    this._userService = new UserService();
  }

  createTransporter(): nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> {
    return nodemailer.createTransport({
      ...emailConfig.options,
    });
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
    try {
      const transporter = this.createTransporter();
      const verificationLink = `${emailConfig.verificationUrl}/${verificationToken}`;

      const mailOptions = {
        from: emailConfig.fromEmail,
        to: email,
        subject: 'Xác thực tài khoản của bạn',
        html: `
              <h1>Xác thực tài khoản</h1>
              <p>Cảm ơn bạn đã đăng ký! Vui lòng nhấp vào liên kết dưới đây để xác thực email của bạn:</p>
              <a href="${verificationLink}">Xác thực tài khoản</a>
              <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
            `,
      };

      await transporter.sendMail(mailOptions);

      return true;
    } catch (error) {
      return false;
    }
  }

  async sendForgotPasswordEmail(email: string, forgotToken: string): Promise<boolean> {
    try {
      const transporter = this.createTransporter();
      const verificationLink = `${emailConfig.resetPasswordUrl}/${forgotToken}`;

      const mailOptions = {
        from: emailConfig.fromEmail,
        to: email,
        subject: 'Quên mật khẩu',
        html: `
              <h1>Quên mật khẩu</h1>
              <p>Nhấp vào đừơng dẫn để thay đôỉ mật khẩu. Không chia sẻ đường dẫn vơí bất cứ ai.</p>
              <a href="${verificationLink}">Quên mật khẩu</a>
              <p>Đường dẫn này sẽ hết hạn sau 5 phút.</p>
            `,
      };

      await transporter.sendMail(mailOptions);

      return true;
    } catch (error) {
      return false;
    }
  }

  generateEmailToken(payload: EmailTokenPayloadType, option: TokenOption): string {
    try {
      return generateToken(payload, option);
    } catch (error) {
      throw error;
    }
  }
}
