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
import { ChatModule } from './chat/chat.module';
import { CheckinsModule } from './checkins/checkins.module';
import { CoachCustomersModule } from './coach-customers/coach-customers.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { PresenceModule } from './presence/presence.module';
import { SchedulesModule } from './schedules/schedules.module';
import { ExercisesModule } from './training/exercises/exercises.module';
import { PlanExercisesModule } from './training/plan-exercises/plan-exercises.module';
import { TrainingPlansModule } from './training/training_plans/training_plans.module';
import { WorkoutLogsModule } from './training/workout-logs/workout-logs.module';
import { VideosModule } from './videos/videos.module';
import { PresenceGateway } from '@/gateway/presence.gateway';
import { ReviewsModule } from './reviews/reviews.module';

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
    PresenceModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
