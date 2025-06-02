import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { Response } from '@/utils/utils';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { Roles } from '@/auth/guards/decorators/roles.decorator';
import { CreateUserDto } from '@/user/user-dto/create-user.dto';
import { RoleType } from '@/utils/type';
import { ChangeRoleDto } from '@/user/user-dto/change-role.dto';
import { UpdateUserDto } from '@/user/user-dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadOptions } from '@/config/upload.config';
import { UploadAvatarDto } from '@/config/upload-dto/upload-avatar-dto';

@ApiTags('User')
@UseInterceptors(ResponseInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  async getMe(@Req() req) {
    const userId = req.user.user_id;
    if (userId) {
      const userResponse = await this.userService.getUserById(userId);
      return Response('Get me successfully!', HttpStatus.OK, userResponse.data);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Get('get-all-users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('get-user-by-id/:user_id')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  getUserById(@Param('user_id') user_id) {
    return this.userService.getUserById(user_id);
  }

  @ApiBearerAuth()
  @Get('get-coach-customers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN, UserRole.COACH, UserRole.CUSTOMER)
  async getCoachCustomers(@Req() req) {
    const userId = req.user.user_id;
    if (userId) {
      return this.userService.getCoachCustomers(userId);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Post('create-user')
  async createUser(@Req() req, @Body() createUserDto: CreateUserDto) {
    const userId = req.user.user_id;
    if (userId) {
      return this.userService.createUser(userId, createUserDto);
    } else {
      return Response('No user found!', HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Put('update-user/:user_id')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  async updateUser(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = parseInt(user_id, 10);
    return this.userService.updateUser(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Delete('delete-user/:user_id')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  async deleteUser(@Param('user_id') user_id) {
    return this.userService.deleteUser(user_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Patch('change-role/:user_id')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiBody({ type: ChangeRoleDto })
  @UseInterceptors(ResponseInterceptor)
  async changeUserRole(
    @Param('user_id') user_id: string,
    @Body('role') role: RoleType,
  ) {
    const userId = parseInt(user_id, 10);
    return this.userService.changeUserRole(userId, role);
  }

  @Post('upload-avatar/:user_id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', uploadOptions))
  @ApiBody({
    description: 'Upload avatar',
    type: UploadAvatarDto,
  })
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('user_id') user_id: number,
  ) {
    const photo_url = file.filename;
    return this.userService.uploadAvatar(user_id, photo_url);
  }

  @Post('upload-media')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', uploadOptions))
  @ApiBody({
    description: 'Upload media',
    type: UploadAvatarDto,
  })
  async uploadMedia(@UploadedFile() file: Express.Multer.File) {
    const photo_url = file.filename;
    return this.userService.uploadMedia(photo_url);
  }
}
