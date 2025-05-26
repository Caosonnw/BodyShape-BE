import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { JwtAuthGuard } from '@/auth/guards/ jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { UserRole } from '@/auth/guards/roles/user.roles';
import { Roles } from '@/auth/guards/decorators/roles.decorator';

@ApiTags('Packages')
@UseInterceptors(ResponseInterceptor)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('/get-all-packages')
  getAll() {
    return this.packagesService.getAllPackages();
  }

  @Get('/get-package-by-id/:package_id')
  getById(@Param('package_id', ParseIntPipe) package_id: number) {
    return this.packagesService.getPackageById(package_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Post('create-package')
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.createPackage(createPackageDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Put('/update-package/:package_id')
  update(
    @Param('package_id', ParseIntPipe) package_id: number,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packagesService.updatePackage(package_id, updatePackageDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Owner, UserRole.ADMIN)
  @Delete('/delete-package/:package_id')
  delete(@Param('package_id', ParseIntPipe) package_id: number) {
    return this.packagesService.deletePackage(package_id);
  }
}
