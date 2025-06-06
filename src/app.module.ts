import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { HealthModule } from '@/health/health.module';
import { MebershipCardsModule } from '@/mebership_cards/mebership_cards.module';
import { PackagesModule } from '@/packages/packages.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/guards/strategies/jwt.strategy';
import { SchedulesModule } from './schedules/schedules.module';
import { CoachCustomersModule } from './coach-customers/coach-customers.module';
import { EquipmentsModule } from './equipments/equipments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PackagesModule,
    MebershipCardsModule,
    HealthModule,
    SchedulesModule,
    CoachCustomersModule,
    EquipmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
