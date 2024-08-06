import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { CustomLoggerModule } from './common/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import * as Joi from 'joi';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          port: configService.get('REDIS_PORT'),
          host: configService.get('REDIS_HOST'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required(),
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_MAIL: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
        ACTIVATION_SECRET: Joi.string().required(),
        EMAIL_VERIFICATION_EXPIRATION_MINUTE: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        CLIENT_URL: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    CustomLoggerModule,
    UsersModule,
    AuthModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
