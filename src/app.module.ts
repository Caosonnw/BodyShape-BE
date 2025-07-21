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
import { ChatModule } from './chat/chat.module';
import { TrainingPlansModule } from './training/training_plans/training_plans.module';
import { ExercisesModule } from './training/exercises/exercises.module';
import { PlanExercisesModule } from './training/plan-exercises/plan-exercises.module';
import { WorkoutLogsModule } from './training/workout-logs/workout-logs.module';
import { VideosModule } from './videos/videos.module';
import { CheckinsModule } from './checkins/checkins.module';

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
    ChatModule,
    TrainingPlansModule,
    ExercisesModule,
    PlanExercisesModule,
    WorkoutLogsModule,
    VideosModule,
    CheckinsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
