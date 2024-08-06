import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EMAIL_MESSAGE_QUEUE } from './processor/constant/contant';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export type ImailOptions = {
  subject: string;
  email: string;
  name: string;
  url: string;
  template: string;
};

@Injectable()
export class EmailService {
  constructor(
    private mailService: MailerService,
    @InjectQueue(EMAIL_MESSAGE_QUEUE) private readonly messageQueue: Queue,
  ) {}
  async sendMailByBull({ subject, email, name, url, template }: ImailOptions) {
    await this.mailService.sendMail({
      to: email,
      subject,
      template,
      context: {
        name,
        url,
      },
    });
  }

  async sendVerificationEmail(data: ImailOptions) {
    await this.messageQueue.add(
      EMAIL_MESSAGE_QUEUE,
      {
        ...data,
      },
      {
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
