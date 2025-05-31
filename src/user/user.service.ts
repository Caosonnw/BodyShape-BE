import { CreateUserDto } from '@/user/user-dto/create-user.dto';
import { UpdateUserDto } from '@/user/user-dto/update-user.dto';
import { parseStringToNumber } from '@/utils/helper';
import { Role, RoleType } from '@/utils/type';
import { Response } from '@/utils/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getAllUsers() {
    try {
      const users = await this.prisma.users.findMany({
        include: {
          coaches: {
            include: {
              coach_customers: {
                include: {
                  customers: {
                    include: {
                      users: true,
                    },
                  },
                },
              },
            },
          },
          customers: {
            include: {
              coach_customers: {
                include: {
                  coaches: {
                    include: {
                      users: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (users && users.length > 0) {
        const result = users.map((user) => {
          if (user.role === Role.COACH) {
            return {
              user_id: user.user_id,
              full_name: user.full_name,
              email: user.email,
              phone_number: user.phone_number,
              gender: user.gender,
              date_of_birth: user.date_of_birth,
              avatar: user.avatar,
              role: user.role,
              specialization: user.coaches?.specialization,
              bio: user.coaches?.bio,
              rating_avg: user.coaches?.rating_avg,
              coach_customers: user.coaches?.coach_customers.map((cc) => ({
                customer_id: cc.customer_id,
                customer_full_name: cc.customers?.users?.full_name,
                customer_email: cc.customers?.users?.email,
                customer_phone_number: cc.customers?.users?.phone_number,
                customer_gender: cc.customers?.users?.gender,
                customer_date_of_birth: cc.customers?.users?.date_of_birth,
                customer_avatar: cc.customers?.users?.avatar,
              })),
            };
          } else if (user.role === Role.CUSTOMER) {
            return {
              user_id: user.user_id,
              full_name: user.full_name,
              email: user.email,
              phone_number: user.phone_number,
              gender: user.gender,
              date_of_birth: user.date_of_birth,
              avatar: user.avatar,
              role: user.role,
              health_info: user.customers?.health_info,
              goals: user.customers?.goals,
              coach_customers: user.customers?.coach_customers.map((cc) => ({
                coach_id: cc.coach_id,
                coach_full_name: cc.coaches?.users?.full_name,
                coach_email: cc.coaches?.users?.email,
                coach_phone_number: cc.coaches?.users?.phone_number,
                coach_gender: cc.coaches?.users?.gender,
                coach_date_of_birth: cc.coaches?.users?.date_of_birth,
                coach_avatar: cc.coaches?.users?.avatar,
              })),
            };
          } else {
            // Trường hợp role khác (ADMIN, OWNER...)
            return {
              user_id: user.user_id,
              full_name: user.full_name,
              email: user.email,
              phone_number: user.phone_number,
              gender: user.gender,
              date_of_birth: user.date_of_birth,
              avatar: user.avatar,
              role: user.role,
            };
          }
        });
        return Response('Get all users successfully!', HttpStatus.OK, result);
      } else {
        return Response('No user found!', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      return Response(
        'An error occurred during the process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(user_id) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { user_id: parseStringToNumber(user_id) },
        include: {
          coaches: {
            include: {
              coach_customers: {
                include: {
                  customers: {
                    include: {
                      users: true,
                    },
                  },
                },
              },
            },
          },
          customers: {
            include: {
              coach_customers: {
                include: {
                  coaches: {
                    include: {
                      users: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (user) {
        if (user.role === Role.COACH) {
          const result = {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            avatar: user.avatar,
            role: user.role,
            specialization: user.coaches?.specialization,
            bio: user.coaches?.bio,
            rating_avg: user.coaches?.rating_avg,
            coach_customers: user.coaches?.coach_customers.map((cc) => ({
              customer_id: cc.customer_id,
              customer_full_name: cc.customers?.users?.full_name,
              customer_email: cc.customers?.users?.email,
              customer_phone_number: cc.customers?.users?.phone_number,
              customer_gender: cc.customers?.users?.gender,
              customer_date_of_birth: cc.customers?.users?.date_of_birth,
              customer_avatar: cc.customers?.users?.avatar,
            })),
          };
          return Response(
            'Get user by id successfully!',
            HttpStatus.OK,
            result,
          );
        } else if (user.role === Role.CUSTOMER) {
          const result = {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            avatar: user.avatar,
            role: user.role,
            health_info: user.customers?.health_info,
            goals: user.customers?.goals,
            coach_customers: user.customers?.coach_customers.map((cc) => ({
              coach_id: cc.coach_id,
              coach_full_name: cc.coaches?.users?.full_name,
              coach_email: cc.coaches?.users?.email,
              coach_phone_number: cc.coaches?.users?.phone_number,
              coach_gender: cc.coaches?.users?.gender,
              coach_date_of_birth: cc.coaches?.users?.date_of_birth,
              coach_avatar: cc.coaches?.users?.avatar,
            })),
          };
          return Response(
            'Get user by id successfully!',
            HttpStatus.OK,
            result,
          );
        } else {
          // role khác
          const result = {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            avatar: user.avatar,
            role: user.role,
          };
          return Response(
            'Get user by id successfully!',
            HttpStatus.OK,
            result,
          );
        }
      } else {
        return Response('User not found!', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      return Response(
        'An error occurred during the process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCoachCustomers(user_id: number) {
    try {
      const user = await this.prisma.users.findUnique({
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

  async createUser(userId, createUserDto: CreateUserDto) {
    try {
      // Kiểm tra email đã tồn tại chưa (nếu có truyền email)
      if (createUserDto.email) {
        const existedUser = await this.prisma.users.findFirst({
          where: { email: createUserDto.email },
        });
        if (existedUser) {
          return Response('Email already exists!', HttpStatus.CONFLICT);
        }
      }
      // Xử lý hash password
      let hashedPassword;
      if (createUserDto.password) {
        hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      }
      // Tạo user mới
      const newUser = await this.prisma.users.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          full_name: createUserDto.full_name,
          gender: createUserDto.gender,
          date_of_birth: createUserDto.date_of_birth,
          phone_number: createUserDto.phone_number,
          avatar: createUserDto.avatar,
          role: createUserDto.role,
          created_by: userId,
        },
      });
      // Tạo bảng mở rộng tương ứng theo role
      if (createUserDto.role === Role.CUSTOMER) {
        await this.prisma.customers.create({
          data: {
            user_id: newUser.user_id,
            health_info: null,
            goals: null,
          },
        });
      } else if (createUserDto.role === Role.COACH) {
        await this.prisma.coaches.create({
          data: {
            user_id: newUser.user_id,
            specialization: null,
            bio: null,
            rating_avg: null,
          },
        });
      }
      // Trả về thông tin user vừa tạo (ẩn password)
      const result = {
        user_id: newUser.user_id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        date_of_birth: newUser.date_of_birth,
        gender: newUser.gender,
        avatar: newUser.avatar,
        role: newUser.role,
      };
      return Response('Create user successfully!', HttpStatus.CREATED, result);
    } catch (error) {
      console.log(error);
      return Response(
        'An error occurred during the process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(user_id: number, updateUserDto: UpdateUserDto) {
    try {
      // Kiểm tra user tồn tại
      const user = await this.prisma.users.findUnique({
        where: { user_id: user_id },
      });
      if (!user) {
        return Response('User not found!', HttpStatus.NOT_FOUND);
      }

      // Nếu có email mới, kiểm tra trùng email với user khác
      if (updateUserDto.email) {
        const existedUser = await this.prisma.users.findFirst({
          where: {
            email: updateUserDto.email,
            NOT: { user_id: user_id },
          },
        });
        if (existedUser) {
          return Response('Email already exists!', HttpStatus.CONFLICT);
        }
      }

      // Xử lý hash password
      let hashedPassword;

      if (updateUserDto.password) {
        hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      }

      // Nếu đổi role, xử lý bảng mở rộng tương ứng
      if (updateUserDto.role && updateUserDto.role !== user.role) {
        if (updateUserDto.role === Role.CUSTOMER) {
          // Xóa coach nếu có
          await this.prisma.coaches.deleteMany({ where: { user_id } });
          // Tạo customers nếu chưa có
          const existingCustomer = await this.prisma.customers.findUnique({
            where: { user_id },
          });
          if (!existingCustomer) {
            await this.prisma.customers.create({
              data: { user_id, health_info: null, goals: null },
            });
          }
        } else if (updateUserDto.role === Role.COACH) {
          // Xóa customer nếu có
          await this.prisma.customers.deleteMany({ where: { user_id } });
          // Tạo coaches nếu chưa có
          const existingCoach = await this.prisma.coaches.findUnique({
            where: { user_id },
          });
          if (!existingCoach) {
            await this.prisma.coaches.create({
              data: {
                user_id,
                specialization: null,
                bio: null,
                rating_avg: null,
              },
            });
          }
        } else {
          // Nếu role khác COACH hoặc CUSTOMER thì xóa hết bảng mở rộng
          await this.prisma.customers.deleteMany({ where: { user_id } });
          await this.prisma.coaches.deleteMany({ where: { user_id } });
        }
      }

      // Cập nhật user
      const updatedUser = await this.prisma.users.update({
        where: { user_id: user_id },
        data: {
          email: updateUserDto.email,
          password: hashedPassword,
          full_name: updateUserDto.full_name,
          gender: updateUserDto.gender,
          date_of_birth: updateUserDto.date_of_birth,
          phone_number: updateUserDto.phone_number,
          avatar: updateUserDto.avatar,
          role: updateUserDto.role,
        },
      });

      // Trả về thông tin user đã cập nhật (ẩn password)
      const result = {
        user_id: updatedUser.user_id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number,
        date_of_birth: updatedUser.date_of_birth,
        role: updatedUser.role,
      };

      return Response('Update user successfully!', HttpStatus.OK, result);
    } catch (error) {
      return Response(
        'An error occurred during the process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(user_id) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { user_id: parseStringToNumber(user_id) },
      });
      if (!user) {
        return Response('User not found!', HttpStatus.NOT_FOUND);
      }

      await this.prisma.users.delete({
        where: { user_id: parseStringToNumber(user_id) },
      });

      return Response('Delete user successfully!', HttpStatus.OK);
    } catch (error) {
      return Response(
        'An error occurred during the process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeUserRole(userId: number, newRole: RoleType) {
    try {
      if (newRole === Role.COACH) {
        // 1. Xóa record trong customers (nếu có)
        await this.prisma.customers.deleteMany({ where: { user_id: userId } });

        // 2. Tạo record mới trong coaches nếu chưa có
        const existingCoach = await this.prisma.coaches.findUnique({
          where: { user_id: userId },
        });

        if (!existingCoach) {
          await this.prisma.coaches.create({
            data: {
              user_id: userId,
              specialization: null,
              bio: null,
              rating_avg: null,
            },
          });
        }
      } else if (newRole === Role.CUSTOMER) {
        // 1. Xóa record trong coaches (nếu có)
        await this.prisma.coaches.deleteMany({ where: { user_id: userId } });

        // 2. Tạo record mới trong customers nếu chưa có
        const existingCustomer = await this.prisma.customers.findUnique({
          where: { user_id: userId },
        });

        if (!existingCustomer) {
          await this.prisma.customers.create({
            data: {
              user_id: userId,
              health_info: null,
              goals: null,
            },
          });
        }
      } else if (![Role.ADMIN, Role.OWNER].includes(newRole)) {
        throw new Error('Invalid role');
      }

      // Cập nhật role trong bảng users
      await this.prisma.users.update({
        where: { user_id: userId },
        data: { role: newRole },
      });

      return Response('Change user role successfully!', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      if (error.message === 'Invalid role') {
        return Response('Invalid role!', HttpStatus.BAD_REQUEST);
      }
      return Response(
        'An error occurred during the process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadAvatar(user_id: number, photo_url: string) {
    const userId = parseInt(user_id.toString());
    const user = await this.prisma.users.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (user) {
      const result = await this.prisma.users.update({
        where: {
          user_id: userId,
        },
        data: {
          avatar: photo_url,
        },
      });

      return Response('Upload avatar successfully!', HttpStatus.OK);
    } else {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
  }

  async uploadMedia(photo_url: string) {
    try {
      if (!photo_url) {
        throw new HttpException(
          'No photo URL provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      return Response(
        'Upload media successfully!',
        HttpStatus.CREATED,
        photo_url,
      );
    } catch (error) {
      console.error('Error uploading media:', error);
      throw new HttpException(
        'An error occurred during the upload process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
