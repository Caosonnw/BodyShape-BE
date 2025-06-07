import { UserRole } from '@/auth/guards/roles/user.roles';
import { Response } from '@/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CoachCustomersService {
  constructor(private prisma: PrismaClient) {}

  async getAllCoachCustomers() {
    try {
      const coachCustomers = await this.prisma.coach_customers.findMany({
        include: {
          coaches: {
            include: {
              users: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                  phone_number: true,
                  gender: true,
                  date_of_birth: true,
                  avatar: true,
                },
              },
            },
          },
          customers: {
            include: {
              users: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                  phone_number: true,
                  gender: true,
                  date_of_birth: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
      if (!coachCustomers || coachCustomers.length === 0) {
        return Response('No coach customers found!', HttpStatus.NOT_FOUND);
      }

      // Chuyển đổi dữ liệu thành format đơn giản hơn nếu cần
      const formatted = coachCustomers.map((item) => ({
        coach_id: item.coach_id,
        customer_id: item.customer_id,
        coach: item.coaches?.users,
        customer: item.customers?.users,
      }));
      return Response(
        'Get all coach customers successfully!',
        HttpStatus.OK,
        formatted,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'An error occurred while fetching all coach customers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCoachCustomers(user_id: number) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { user_id },
        select: { role: true },
      });

      if (!user) {
        return Response('User not found!', HttpStatus.NOT_FOUND);
      }

      if (user.role === 'COACH') {
        const customers = await this.prisma.coach_customers.findMany({
          where: { coach_id: user_id },
          include: {
            customers: {
              include: {
                users: {
                  select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    phone_number: true,
                    gender: true,
                    date_of_birth: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });

        const result = customers.map((cc) => ({
          user_id: cc.customer_id,
          full_name: cc.customers?.users?.full_name,
          email: cc.customers?.users?.email,
          phone_number: cc.customers?.users?.phone_number,
          gender: cc.customers?.users?.gender,
          date_of_birth: cc.customers?.users?.date_of_birth,
          avatar: cc.customers?.users?.avatar,
        }));

        return Response(
          'Get coach customers successfully!',
          HttpStatus.OK,
          result,
        );
      } else if (user.role === 'CUSTOMER') {
        const coaches = await this.prisma.coach_customers.findMany({
          where: { customer_id: user_id },
          include: {
            coaches: {
              include: {
                users: {
                  select: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    phone_number: true,
                    gender: true,
                    date_of_birth: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });

        const result = coaches.map((cc) => ({
          user_id: cc.coach_id,
          full_name: cc.coaches?.users?.full_name,
          email: cc.coaches?.users?.email,
          phone_number: cc.coaches?.users?.phone_number,
          gender: cc.coaches?.users?.gender,
          date_of_birth: cc.coaches?.users?.date_of_birth,
          avatar: cc.coaches?.users?.avatar,
        }));

        return Response(
          'Get customer coaches successfully!',
          HttpStatus.OK,
          result,
        );
      } else {
        return Response(
          'User role does not support this operation',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(error);
      return Response(
        'An error occurred while fetching related users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCoachCustomersById(coach_id: number, customer_id: number) {
    try {
      const exists = await this.prisma.coach_customers.findFirst({
        where: {
          coach_id,
          customer_id,
        },
      });
      if (!exists) {
        return Response(
          'Coach-Customer relationship not found!',
          HttpStatus.NOT_FOUND,
        );
      }
      const relation = await this.prisma.coach_customers.findFirst({
        where: {
          coach_id,
          customer_id,
        },
        include: {
          coaches: {
            include: {
              users: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                  phone_number: true,
                  gender: true,
                  date_of_birth: true,
                  avatar: true,
                },
              },
            },
          },
          customers: {
            include: {
              users: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                  phone_number: true,
                  gender: true,
                  date_of_birth: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
      if (!relation) {
        return Response(
          'Coach-Customer relationship not found!',
          HttpStatus.NOT_FOUND,
        );
      }
      const formatted = {
        coach_id: relation.coach_id,
        customer_id: relation.customer_id,
        coach: relation.coaches?.users,
        customer: relation.customers?.users,
      };
      return Response(
        'Get coach-customer relationship successfully!',
        HttpStatus.OK,
        formatted,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'An error occurred while fetching coach-customer relationship',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Prevent OWNER and ADMIN from being added as coach or customer
  private isInvalidRole(role: string): boolean {
    return role === UserRole.Owner || role === UserRole.ADMIN;
  }

  async canAddCoachCustomer(coach_id: number, customer_id: number) {
    const coach = await this.prisma.users.findFirst({
      where: { user_id: coach_id },
      select: { role: true },
    });
    const customer = await this.prisma.users.findFirst({
      where: { user_id: customer_id },
      select: { role: true },
    });

    if (!coach || !customer) {
      return {
        allowed: false,
        message: 'Coach or Customer not found!',
        status: HttpStatus.NOT_FOUND,
      };
    }

    if (this.isInvalidRole(coach.role) || this.isInvalidRole(customer.role)) {
      return {
        allowed: false,
        message: 'Cannot add OWNER or ADMIN as coach or customer!',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    // Prevent CUSTOMER from being added as coach and COACH as customer
    if (coach.role !== UserRole.COACH) {
      return {
        allowed: false,
        message: 'coach_id must be a user with COACH role!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
    if (customer.role !== UserRole.CUSTOMER) {
      return {
        allowed: false,
        message: 'customer_id must be a user with CUSTOMER role!',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    return { allowed: true };
  }

  async createCoachCustomer(coach_id: number, customer_id: number) {
    try {
      const check = await this.canAddCoachCustomer(coach_id, customer_id);
      if (!check.allowed) {
        return Response(check.message, check.status);
      }

      const existingRelation = await this.prisma.coach_customers.findFirst({
        where: {
          coach_id,
          customer_id,
        },
      });

      if (existingRelation) {
        return Response(
          'Coach-Customer relationship already exists!',
          HttpStatus.CONFLICT,
        );
      }

      const newRelation = await this.prisma.coach_customers.create({
        data: {
          coach_id,
          customer_id,
        },
      });

      return Response(
        'Create Coach-Customer relationship successfully!',
        HttpStatus.CREATED,
        newRelation,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to create Coach-Customer relationship',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCoachCustomer(
    oldCoachId: number,
    oldCustomerId: number,
    newCoachId: number,
    newCustomerId: number,
  ) {
    try {
      // Kiểm tra quan hệ cũ có tồn tại không
      const existingRelation = await this.prisma.coach_customers.findFirst({
        where: {
          coach_id: oldCoachId,
          customer_id: oldCustomerId,
        },
      });

      if (!existingRelation) {
        return Response(
          'Coach-Customer relationship does not exist!',
          HttpStatus.NOT_FOUND,
        );
      }

      // Kiểm tra quan hệ mới đã tồn tại chưa
      const newRelation = await this.prisma.coach_customers.findFirst({
        where: {
          coach_id: newCoachId,
          customer_id: newCustomerId,
        },
      });

      if (newRelation) {
        return Response(
          'The new Coach-Customer relationship already exists!',
          HttpStatus.CONFLICT,
        );
      }

      // Cập nhật lại coach_id và customer_id mới
      const updatedRelation = await this.prisma.coach_customers.update({
        where: {
          coach_id_customer_id: {
            coach_id: oldCoachId,
            customer_id: oldCustomerId,
          },
        },
        data: {
          coach_id: newCoachId,
          customer_id: newCustomerId,
        },
      });

      return Response(
        'Update Coach-Customer relationship successfully!',
        HttpStatus.OK,
        updatedRelation,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to update Coach-Customer relationship',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCoachCustomer(coach_id: number, customer_id: number) {
    try {
      console.log(coach_id, customer_id);
      const existingRelation = await this.prisma.coach_customers.findFirst({
        where: {
          coach_id,
          customer_id,
        },
      });

      if (!existingRelation) {
        return Response(
          'Coach-Customer relationship not found!',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.coach_customers.delete({
        where: {
          coach_id_customer_id: {
            coach_id,
            customer_id,
          },
        },
      });

      return Response(
        'Delete Coach-Customer relationship successfully!',
        HttpStatus.OK,
      );
    } catch (error) {
      console.error(error);
      return Response(
        'Failed to delete Coach-Customer relationship',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
