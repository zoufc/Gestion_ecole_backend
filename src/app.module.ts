/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { PhoneMessageModule } from './api/phone-message/phone-message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { StudentModule } from './api/student/student.module';
import { SchoolModule } from './api/school/school.module';
import { ClassModule } from './api/class/class.module';
import { CourseModule } from './api/course/course.module';
import { NoteModule } from './api/note/note.module';
import { PaymentModule } from './api/payment/payment.module';
import { CycleModule } from './api/cycle/cycle.module';
import { BadgeModule } from './api/badge/badge.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbUrl'),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: Buffer.from(
          configService.get<string>('privateKey').replace(/\\n/g, '\n'), // Remplace \n par une vraie nouvelle ligne
          'utf-8',
        ),
        privateKey: Buffer.from(
          configService.get<string>('privateKey').replace(/\\n/g, '\n'), // Remplace \n par une vraie nouvelle ligne
          'utf-8',
        ),
        publicKey: Buffer.from(
          configService.get<string>('publicKey').replace(/\\n/g, '\n'), // Remplace \n par une vraie nouvelle ligne
          'utf-8',
        ),
        signOptions: {
          algorithm: 'RS256', // Utilisation de l'algorithme RS256 pour la signature avec clé privée
          expiresIn: '1d', // Expiration : 1 jour
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    UserModule,
    PhoneMessageModule,
    StudentModule,
    SchoolModule,
    ClassModule,
    CourseModule,
    NoteModule,
    PaymentModule,
    CycleModule,
    BadgeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST }, // Exclure les routes de connexion
        { path: 'auth/loginByPhoneNumber', method: RequestMethod.POST }, // Exclure les routes de connexion avec numéro de téléphone
        { path: 'auth/register', method: RequestMethod.POST }, // Exclure les routes d'inscription
        { path: 'auth/phoneVerification', method: RequestMethod.POST }, // Exclure les routes de vérification de code
        { path: 'thirdPartyService/create', method: RequestMethod.POST },
        { path: 'schools', method: RequestMethod.ALL }, // Exclure toutes les routes schools
        { path: 'users/create', method: RequestMethod.POST }, // Exclure toutes les routes users
      )
      .forRoutes('*'); // Appliquer à toutes les routes sauf exclusions
  }
}
