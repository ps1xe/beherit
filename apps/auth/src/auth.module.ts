import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { config } from '@beherit/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter.js';

@Module({
  imports: [
    JwtModule.register({
      secret: config.JWT_SECRET_KEY,
      signOptions: { expiresIn: '12d' },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: config.MAILER_TRANSPORT,
        defaults: {
          from: `"beherit" <${
            config.MAILER_TRANSPORT.split(':')[1].split('//')[1]
          }>`,
        },
        template: {
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
