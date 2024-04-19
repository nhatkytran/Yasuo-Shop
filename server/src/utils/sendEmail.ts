import path from 'path';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { convert } from 'html-to-text';
import config from 'config';

import env from './env';
import { UserDocument } from '../models/users/schemaDefs';

const emailAuthor = config.get<string>('emailAuthor');
const mailtrapHost = config.get<string>('mailtrapHost');
const mailtrapPort = config.get<number>('mailtrapPort');
const mailtrapUsername = config.get<string>('mailtrapUsername');
const mailtrapPassword = config.get<string>('mailtrapPassword');
const brevoHost = config.get<string>('brevoHost');
const brevoPort = config.get<number>('brevoPort');
const brevoKeyName = config.get<string>('brevoKeyName');
const brevoKeyValue = config.get<string>('brevoKeyValue');

class Email {
  from: string;
  to: string;
  username: string;

  constructor(user: UserDocument) {
    this.from = `Trần Nhật Kỳ - ${emailAuthor}`;
    this.to = user.email;
    this.username = user.name || '';
  }

  newTransport() {
    const [host, port, user, pass] =
      env.dev || env.test
        ? [mailtrapHost, mailtrapPort, mailtrapUsername, mailtrapPassword]
        : [brevoHost, brevoPort, brevoKeyName, brevoKeyValue];

    return nodemailer.createTransport({ host, port, auth: { user, pass } });
  }

  async send(options: {
    template: string;
    subject: string;
    [key: string]: any;
  }) {
    const { template, subject, ...locals } = options;

    const html = await ejs.renderFile(
      path.join(__dirname, `../views/baseEmail.ejs`),
      { subject, template, ...locals }
    );

    await this.newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, { wordwrap: null }),
    });
  }

  async sendWelcome(options: { oAuth: boolean; code?: string }) {
    const { oAuth, code } = options;

    const subject = oAuth
      ? ''
      : ' Your activate code (only valid for only 2 minutes)';

    await this.send({
      template: 'welcomeEmail',
      subject: `Welcome!${subject}`,
      username: this.username,
      code,
    });
  }

  async sendActivate({ code }: { code: string }) {
    await this.send({
      template: 'activateEmail',
      subject: 'Yasuo API - Yasuo Shop! Activate code',
      username: this.username,
      code,
    });
  }

  async sendForgotPassword({ code }: { code: string }) {
    await this.send({
      template: 'forgotPasswordEmail',
      subject: 'Yasuo API - Yasuo Shop! Forgot password code',
      username: this.username,
      code,
    });
  }
}

export default Email;
