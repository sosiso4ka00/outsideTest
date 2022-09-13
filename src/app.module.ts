import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { PostgresModule } from './dataBase';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';


@Module({
  imports: [
    UserModule,
    TagModule,
    PostgresModule.forRoot({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD
    }),
    AuthModule,
    CacheModule.register()
  ],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor
  }],
})
export class AppModule { }
