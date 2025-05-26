import { LoginUserDto } from '@/auth/auth-dto/login-user.dto';
import { RegisterUserDto } from '@/auth/auth-dto/register-user-dto';
import { generateRandomString } from '@/utils/helper';
import { Role } from '@/utils/type';
import { Response } from '@/utils/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaClient,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createInitialOwner();
  }

  // Tạo tài khoản Owner
  private async createInitialOwner() {
    const email = process.env.INITIAL_EMAIL_OWNER;
    const password = process.env.INITIAL_PASSWORD_OWNER;

    if (!email || !password) {
      console.warn(
        'INITIAL_EMAIL_OWNER or INITIAL_PASSWORD_OWNER is not set in the .env file.',
      );
      return;
    }

    const existingOwner = await this.prisma.users
      .findFirst({
        where: { email, role: 'OWNER' },
      })
      .catch((error) => {
        console.error('Error fetching owner:', error);
        throw error;
      });

    if (!existingOwner) {
      const hashedPassword = bcrypt.hashSync(password, 10);

      await this.prisma.users.create({
        data: {
          full_name: 'Owner',
          email,
          password: hashedPassword,
          gender: true,
          date_of_birth: null,
          phone_number: null,
          role: 'OWNER',
          refresh_token: '',
        },
      });
      console.log(`Owner account created with email: ${email}`);
    } else {
      console.log(`Owner account already exists with email: ${email}`);
    }
  }

  async register(RegisterUserDto: RegisterUserDto) {
    const { full_name, email, password, gender, date_of_birth, phone_number } =
      RegisterUserDto;
    try {
      const user = await this.prisma.users.findFirst({
        where: { email: email },
      });
      if (user) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Format ngày sinh
      const formattedDateOfBirth = date_of_birth
        ? new Date(date_of_birth).toISOString().slice(0, 10)
        : null;

      const newUser = await this.prisma.users.create({
        data: {
          full_name,
          email,
          password: hashedPassword,
          gender:
            typeof gender === 'number' ? Boolean(gender) : (gender ?? null),
          date_of_birth: formattedDateOfBirth,
          phone_number: phone_number ?? null,
          role: Role.CUSTOMER,
          refresh_token: '',
        },
        select: {
          user_id: true,
        },
      });
      console.log(newUser.user_id); // luôn có

      // Tạo record tương ứng trong bảng customers
      await this.prisma.customers.create({
        data: {
          user_id: newUser.user_id,
          health_info: null,
          goals: null,
        },
      });

      return Response('User created successfully!', HttpStatus.CREATED);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred during the sign-up process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginUserDto: LoginUserDto, res) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.prisma.users.findFirst({
        where: { email: email },
      });

      if (!user) {
        throw new HttpException('Email is not found!', HttpStatus.NOT_FOUND);
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new HttpException(
          'Password is incorrect!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const key = generateRandomString(6);
      const payload = { user_id: user.user_id, role: user.role, key };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        algorithm: 'HS256',
        secret: process.env.JWT_SECRET,
      });

      const refreshToken = this.jwtService.sign(
        { user_id: user.user_id, role: user.role, key },
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
          algorithm: 'HS256',
          secret: process.env.JWT_SECRET_REFRESH,
        },
      );

      user.refresh_token = refreshToken;

      await this.prisma.users.update({
        data: user,
        where: { user_id: user.user_id },
      });

      // Set cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10),
        sameSite: 'lax',
        path: '/',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE, 10),
        sameSite: 'lax',
        path: '/',
      });

      return Response('Login successfully!', HttpStatus.OK, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred during the login process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createToken(token: string) {
    let decoded = await this.jwtService.decode(token);

    const getUser = await this.prisma.users.findFirst({
      where: { user_id: decoded.user_id },
    });

    if (!getUser) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const tokenRef = this.jwtService.decode(getUser.refresh_token);

    if (!tokenRef || !tokenRef.key) {
      throw new HttpException('Invalid token data', HttpStatus.UNAUTHORIZED);
    }

    const isValidRefreshToken = await this.jwtService.verifyAsync(
      getUser.refresh_token,
      {
        secret: process.env.JWT_SECRET_REFRESH,
      },
    );

    if (!isValidRefreshToken) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }

    // Create a new token
    const payload = {
      user_id: getUser.user_id,
      key: tokenRef.key,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      algorithm: 'HS256',
      secret: process.env.JWT_SECRET,
    });

    return accessToken;
  }

  async refreshToken(refreshToken, res) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH,
      });

      if (!decoded || !decoded.user_id) {
        throw new HttpException(
          'Invalid token payload',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.prisma.users.findFirst({
        where: { user_id: decoded.user_id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      // Xác minh token
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH,
      });

      // Tạo token mới
      const payload = {
        user_id: user.user_id,
        role: user.role,
        key: decoded.key,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        secret: process.env.JWT_SECRET,
      });

      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        secret: process.env.JWT_SECRET_REFRESH,
      });

      // Lưu token mới vào DB
      await this.prisma.users.update({
        where: { user_id: user.user_id },
        data: { refresh_token: newRefreshToken },
      });

      // Set cookies
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10) * 1000,
        sameSite: 'lax',
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10) * 1000,
        sameSite: 'lax',
      });

      return Response('Token refreshed successfully!', HttpStatus.OK, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.error('Error during token refresh:', error);

      if (error.name === 'TokenExpiredError') {
        throw new HttpException(
          'Refresh token expired',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (error.name === 'JsonWebTokenError') {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        'An error occurred while refreshing the token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
