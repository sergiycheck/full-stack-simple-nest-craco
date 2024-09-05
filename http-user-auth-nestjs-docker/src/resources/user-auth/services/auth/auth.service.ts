import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../../guards-strategies/types';
import { CreateAuthInfo } from '../../dtos/auth-dtos/create-auth-info.dto';
import { AuthInfoModel } from '../../models/auth/auth-info.model';
import { UserMapper } from '../user/user.mapper';
import { RegisterUserDto } from '../../dtos/user-dtos/register.dto';
import {
  SignInBadRequestException,
  UserBadRequestException,
  UserNotFoundException,
} from '../../exceptions/user-custom-exceptions';
import { LoginUserDto } from '../../dtos/user-dtos/login.dto';
import { hash, verify } from 'argon2';
import {
  UserLoginResponse,
  UserMessageResponse,
} from '../../dtos/user-dtos/responses.dto';
import { User } from 'src/infra/sequelize/user.schema';
import { AuthInfo } from 'src/infra/sequelize/auth-info.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(AuthInfo)
    private authModel: typeof AuthInfo,
    private readonly userMapper: UserMapper,
  ) {}

  getSignedAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload);
  }

  findAuthInfoByUserId(userId: number): Promise<AuthInfoModel | null> {
    return this.authModel.findOne({
      where: {
        userId: userId,
      },
    });
  }

  async createOrUpdateAuthInfo(
    dto: CreateAuthInfo,
  ): Promise<AuthInfoModel | null> {
    const hashedAccessToken = await hash(dto.accessToken);

    const authInfoExists = await this.findAuthInfoByUserId(dto.userId);
    let authInfoModel: AuthInfoModel | null;

    if (!authInfoExists) {
      const result = await AuthInfo.create({
        userId: dto.userId,
        hashedAccessToken,
      });

      authInfoModel = result;
    } else {
      const result = (await AuthInfo.update(
        { hashedAccessToken },
        {
          where: {
            userId: dto.userId,
          },
          returning: true,
        },
      )) as unknown as [number | undefined, number];

      const [, rowCount] = result;

      if (rowCount === 0) {
        throw new Error(
          `Could not update auth info for user with id ${dto.userId}`,
        );
      }

      authInfoModel = await AuthInfo.findOne({
        where: {
          userId: dto.userId,
        },
      });
    }

    return authInfoModel;
  }

  async removeAuthInfo(userId: number): Promise<UserMessageResponse> {
    await this.authModel.destroy({
      where: {
        userId: userId,
      },
    });

    return { message: 'User was signed out!' };
  }

  async registerUser(userInput: RegisterUserDto): Promise<UserLoginResponse> {
    if (userInput.password !== userInput.repeatPassword) {
      throw new UserBadRequestException(`Passwords do not match`);
    }

    const userExists = await this.userModel.findOne({
      where: {
        email: userInput.email,
      },
    });

    if (userExists) {
      throw new UserBadRequestException(
        `User with email ${userInput.email} already exists`,
      );
    }

    const hashedPassword = await hash(userInput.password);

    const user = await this.userModel.create(
      {
        email: userInput.email,
        hashedPassword: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        returning: true,
      },
    );

    const accessToken = this.getSignedAccessToken({
      email: user.email,
    });

    await this.createOrUpdateAuthInfo({
      accessToken,
      userId: user.id,
    });

    return this.userMapper.toUserLoginResponse(user, accessToken);
  }

  async loginUser(userInput: LoginUserDto): Promise<UserLoginResponse> {
    const user = await this.userModel.findOne({
      where: {
        email: userInput.email,
      },
    });

    if (!user) {
      throw new UserNotFoundException(
        `User with email ${userInput.email} not found`,
      );
    }

    const isPasswordValid = await verify(
      user.hashedPassword,
      userInput.password,
    );

    if (!isPasswordValid) {
      throw new SignInBadRequestException(`Password is invalid`);
    }

    const accessToken = this.getSignedAccessToken({
      email: user.email,
    });

    await this.createOrUpdateAuthInfo({
      accessToken,
      userId: user.id,
    });

    return this.userMapper.toUserLoginResponse(user, accessToken);
  }
}
