import { Module } from '@nestjs/common';
import { UsersAuthModule } from './resources/user-auth/user-auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { SequelizeModule } from '@nestjs/sequelize';
import { parseConnectionString } from './utils/parse-connection-string';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>(
          'DB_CONNECTION_STRING',
        );
        const dbConfig = parseConnectionString(connectionString);
        return {
          ...dbConfig,
          autoLoadModels: true,
          synchronize: true,
        } as any;
      },
      inject: [ConfigService],
    }),
    UsersAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
