import { CreateMembershipCardDto } from '@/mebership_cards/dto/create-membership.dto';
import { UpdateMembershipCardDto } from '@/mebership_cards/dto/update-membership.dto';
import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MebershipCardsService {
  constructor(private prisma: PrismaClient) {}

  async getAllMembershipCards() {
    try {
      const membershipCards = await this.prisma.membership_cards.findMany({
        include: {
          customers: {
            select: {
              users: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                  date_of_birth: true,
                  phone_number: true,
                  avatar: true,
                  role: true,
                },
              },
            },
          },
          packages: true,
        },
      });
      if (membershipCards.length === 0) {
        return Response('No membership cards found!', HttpStatus.NOT_FOUND);
      }
      return Response(
        'Get all membership cards successfully!',
        HttpStatus.OK,
        membershipCards,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to get membership cards!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMembershipCardById(membership_card_id: number) {
    try {
      const membershipCard = await this.prisma.membership_cards.findFirst({
        where: { card_id: membership_card_id },
        include: {
          customers: {
            select: {
              users: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                  date_of_birth: true,
                  phone_number: true,
                  avatar: true,
                  role: true,
                },
              },
            },
          },
          packages: true,
        },
      });
      if (!membershipCard) {
        return Response('Membership card not found!', HttpStatus.NOT_FOUND);
      }
      return Response(
        'Get membership card successfully!',
        HttpStatus.OK,
        membershipCard,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to get membership card!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMembershipCardByUserId(user_id: number) {
    try {
      const membershipCard = await this.prisma.membership_cards.findFirst({
        where: { customer_id: user_id },
        include: {
          customers: {
            select: {
              users: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                  date_of_birth: true,
                  phone_number: true,
                  avatar: true,
                  role: true,
                },
              },
            },
          },
        },
      });
      if (!membershipCard) {
        return Response('Membership card not found!', HttpStatus.NOT_FOUND);
      }
      return Response(
        'Get membership card by user ID successfully!',
        HttpStatus.OK,
        membershipCard,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to get membership card by user ID!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMembershipCard(membershipCardData: CreateMembershipCardDto) {
    try {
      const customerExists = await this.prisma.users.findFirst({
        where: {
          customers: {
            user_id: membershipCardData.customer_id,
          },
        },
      });
      if (!customerExists) {
        return Response('Customer not found!', HttpStatus.NOT_FOUND);
      }

      const existingMembershipCard =
        await this.prisma.membership_cards.findFirst({
          where: {
            customer_id: membershipCardData.customer_id,
            package_id: membershipCardData.package_id,
          },
        });
      if (existingMembershipCard) {
        return Response(
          'Membership card already exists for this customer and package!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const packageInfo = await this.prisma.packages.findFirst({
        where: { package_id: membershipCardData.package_id },
        select: { duration_days: true },
      });
      if (!packageInfo) {
        return Response('Package not found!', HttpStatus.NOT_FOUND);
      }
      const startDate = new Date(membershipCardData.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + packageInfo.duration_days);
      membershipCardData.end_date = endDate.toISOString();

      const newMembershipCard = await this.prisma.membership_cards.create({
        data: membershipCardData,
      });
      return Response(
        'Create membership card successfully!',
        HttpStatus.CREATED,
        newMembershipCard,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to create membership card!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMembershipCard(
    cardId,
    membershipCardData: UpdateMembershipCardDto,
  ) {
    try {
      const updatedMembershipCard = await this.prisma.membership_cards.update({
        where: { card_id: cardId },
        data: membershipCardData,
      });
      return Response(
        'Update membership card successfully!',
        HttpStatus.OK,
        updatedMembershipCard,
      );
    } catch (error) {
      console.log(error);
      return Response(
        'Failed to update membership card!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
