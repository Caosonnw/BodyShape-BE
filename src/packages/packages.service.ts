import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaClient } from '@prisma/client';
import { Response } from '@/utils/utils';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaClient) {}

  async getAllPackages() {
    try {
      const result = await this.prisma.packages.findMany();
      if (result) {
        return Response('Get all packages successfully', HttpStatus.OK, result);
      } else {
        return Response('No packages found', HttpStatus.NOT_FOUND, null);
      }
    } catch (error) {
      console.log(error);
      return Response(
        'Error occurred while fetching packages',
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  async getPackageById(package_id: number) {
    try {
      const pkg = await this.prisma.packages.findUnique({
        where: { package_id },
      });
      if (!pkg) {
        return Response('Package not found', HttpStatus.NOT_FOUND, null);
      }
      return Response('Get package successfully', HttpStatus.OK, pkg);
    } catch (error) {
      console.log(error);
      return Response(
        'Error occurred while fetching package',
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  async createPackage(data: CreatePackageDto) {
    try {
      await this.prisma.packages.create({ data });
      return Response('Package created successfully', HttpStatus.CREATED, null);
    } catch (error) {
      console.log(error);
      return Response(
        'Error occurred while creating package',
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  async updatePackage(package_id: number, data: UpdatePackageDto) {
    try {
      const pkg = await this.prisma.packages.findUnique({
        where: { package_id },
      });
      if (!pkg) {
        return Response('Package not found', HttpStatus.NOT_FOUND, null);
      }
      await this.prisma.packages.update({
        where: { package_id },
        data,
      });
      return Response('Package updated successfully', HttpStatus.OK, null);
    } catch (error) {
      console.log(error);
      return Response(
        'Error occurred while updating package',
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  async deletePackage(package_id: number) {
    try {
      const pkg = await this.prisma.packages.findUnique({
        where: { package_id },
      });
      if (!pkg) {
        return Response('Package not found', HttpStatus.NOT_FOUND, null);
      }
      await this.prisma.packages.delete({
        where: { package_id },
      });
      return Response('Package deleted successfully', HttpStatus.OK, null);
    } catch (error) {
      console.log(error);
      return Response(
        'Error occurred while deleting package',
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }
}
