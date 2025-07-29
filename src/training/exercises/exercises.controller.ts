import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { UploadVideoDto } from '@/config/upload-dto/upload-video.dto';
import { uploadVideoOptions } from '@/config/upload.config';
import { CreateExerciseDto } from '@/training/exercises/dto/create-exercises.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';

@ApiTags('Exercises')
@UseInterceptors(ResponseInterceptor)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-all-exercises')
  async getAllExercises() {
    return await this.exercisesService.getAllExercises();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  @Get('get-exercise-by-id/:exercise_id')
  async getExerciseById(
    @Param('exercise_id', ParseIntPipe) exercise_id: number,
  ) {
    return await this.exercisesService.getExerciseById(exercise_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Post('create-exercise')
  async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    return await this.exercisesService.createExercise(createExerciseDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Put('update-exercise/:exercise_id')
  async updateExercise(
    @Body() createExerciseDto: CreateExerciseDto,
    @Param('exercise_id', ParseIntPipe) exercise_id: number,
  ) {
    return await this.exercisesService.updateExercise(
      createExerciseDto,
      exercise_id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @Delete('delete-exercise/:exercise_id')
  async deleteExercise(
    @Param('exercise_id', ParseIntPipe) exercise_id: number,
  ) {
    return await this.exercisesService.deleteExercise(exercise_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video', uploadVideoOptions))
  @ApiBody({
    description: 'Upload media',
    type: UploadVideoDto,
  })
  @Post('upload-exercise-video')
  async uploadVideoExercise(@UploadedFile() file: Express.Multer.File) {
    const photo_url = file.filename;
    return this.exercisesService.uploadVideo(photo_url);
  }
}
