import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards-strategies/jwt-auth.guard';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './guards-strategies/jwt.strategy';
import { UsersController } from './controllers/users.controller';
import { UserMapper } from './services/user/user.mapper';
import { UsersService } from './services/user/users.service';
import { User } from 'src/infra/sequelize/user.schema';
import { AuthInfo } from 'src/infra/sequelize/auth-info.schema';
import { SequelizeModule } from '@nestjs/sequelize';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([User, AuthInfo]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRES_IN')}`,
        },
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    UserMapper,
    UsersService,
    AuthService,
    JwtStrategy,
    // provide JWT guard globally
    { provide: APP_GUARD, useExisting: JwtAuthGuard },
    JwtAuthGuard,
  ],

  exports: [AuthService, JwtModule],
  controllers: [UsersController],
})
export class UsersAuthModule {}
