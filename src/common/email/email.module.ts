import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { BullModule } from '@nestjs/bull';
import { EMAIL_MESSAGE_QUEUE } from './processor/constant/contant';
import { MessageConsumer } from './processor/constant/email.consumer';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          secure: true,
          auth: {
            user: config.get('SMTP_MAIL'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: 'Chatter App',
        },
        template: {
          dir: join(__dirname, '../../../email-templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: EMAIL_MESSAGE_QUEUE,
    }),
  ],
  providers: [EmailService, MessageConsumer],
  exports: [EmailService],
})
export class EmailModule {}
