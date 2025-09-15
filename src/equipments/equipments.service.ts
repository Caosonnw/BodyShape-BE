import { CreateEquipmentDto } from '@/equipments/dto/create-equipment.dto';
import { UpdateEquipmentDto } from '@/equipments/dto/update-equipment.dto';
import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EquipmentsService {
  constructor(private prisma: PrismaClient) {}

  async getAllEquipments() {
    try {
      const equipments = await this.prisma.equipments.findMany();
      if (equipments.length === 0) {
        return Response('No equipments found!', HttpStatus.NOT_FOUND);
      }
      return Response(
        'Get all equipments successfully!',
        HttpStatus.OK,
        equipments,
      );
    } catch (error) {
      console.log(error);
      Response('Failed to get equipments!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEquipmentById(equipment_id: number) {
    try {
      const equipment = await this.prisma.equipments.findFirst({
        where: { equipment_id: equipment_id },
      });
      if (!equipment) {
        return Response('Equipment not found!', HttpStatus.NOT_FOUND);
      }
      return Response('Get equipment successfully!', HttpStatus.OK, equipment);
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to get equipment!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createEquipment(createEquipmentDto: CreateEquipmentDto) {
    try {
      const newDate = new Date();

      const newEquipment = await this.prisma.equipments.create({
        data: {
          equipment_name: createEquipmentDto.equipment_name,
          description: createEquipmentDto.description,
          location: createEquipmentDto.location,
          status: createEquipmentDto.status,
          created_at: newDate,
          last_maintenance_date: newDate,
        },
      });
      return Response(
        'Create equipment successfully!',
        HttpStatus.CREATED,
        newEquipment,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to create equipment!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateEquipment(
    equipment_id: number,
    updateEquipmentDto: UpdateEquipmentDto,
  ) {
    try {
      const updatedEquipment = await this.prisma.equipments.update({
        where: { equipment_id: equipment_id },
        data: {
          equipment_name: updateEquipmentDto.equipment_name,
          description: updateEquipmentDto.description,
          location: updateEquipmentDto.location,
          status: updateEquipmentDto.status,
          last_maintenance_date: new Date(),
        },
      });
      return Response(
        'Update equipment successfully!',
        HttpStatus.OK,
        updatedEquipment,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to update equipment!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteEquipment(equipment_id: number) {
    try {
      const equipment = await this.prisma.equipments.findFirst({
        where: { equipment_id: equipment_id },
      });
      if (!equipment) {
        return Response('Equipment not found!', HttpStatus.NOT_FOUND);
      }
      const deletedEquipment = await this.prisma.equipments.delete({
        where: { equipment_id: equipment_id },
      });
      return Response('Delete equipment successfully!', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to delete equipment!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
