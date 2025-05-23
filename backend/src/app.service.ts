import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @ApiOperation({ summary: 'Find or create a user by username' })
  @ApiResponse({ status: 200, description: 'The found or newly created user', type: User })
  async findOrCreateUser(username: string, fullName?: string, avatarUrl?: string): Promise<User> {
    let user = await this.userModel.findOne({ username });
    if (!user) {
      user = new this.userModel({
        username,
        fullName: fullName || username,
        avatarUrl,
        createdAt: new Date(),
        lastLogin: new Date(),
      });
      await user.save();
    } else {
      user.lastLogin = new Date();
      await user.save();
    }
    return user;
  }
}