import { UserMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { GetUserQuery } from '../../dtos/user-dtos/get-user.dto';
import { UserNotFoundException } from '../../exceptions/user-custom-exceptions';
import { UserModel } from '../../models/user/user.model';
import { LRUCacheInstance } from 'src/infra/cache/lru.cache';
import {
  UserMessageResponse,
  UserResponse,
} from '../../dtos/user-dtos/responses.dto';
import { User } from 'src/infra/sequelize/user.schema';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(
    private readonly userMapper: UserMapper,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findUserById(id: number): Promise<UserModel | null> {
    return this.userModel.findOne({
      where: {
        id: id,
      },
    });
  }

  findUserByEmail(email: string): Promise<UserModel | null> {
    return this.userModel.findOne({
      where: {
        email: email,
      },
    });
  }

  async findUserAndMap(userInput: GetUserQuery): Promise<UserResponse> {
    let user: UserModel;

    if (userInput?.id) {
      user = await this.findUserById(userInput.id);
    } else if (userInput?.email) {
      user = await this.findUserByEmail(userInput.email);
    }

    if (!user) {
      throw new UserNotFoundException(`User not found`);
    }

    return this.userMapper.toUserResponse(user);
  }

  async deleteUserById(id: number): Promise<UserMessageResponse> {
    const user = await this.findUserById(id);

    await this.userModel.destroy({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new UserNotFoundException(`User not found`);
    } else {
      LRUCacheInstance.delete(`/users?id=${id}`);
      LRUCacheInstance.delete(`/users?email=${user.email}`);
    }

    return { message: 'User deleted' };
  }
}
