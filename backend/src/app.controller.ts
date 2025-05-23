import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppService } from './app.service';

class UserDto {
  @ApiProperty({ example: 'testuser' })
  username!: string;

  @ApiProperty({ example: 'user@email.com', required: false })
  email?: string;

  @ApiProperty({ example: ['user'], required: false })
  roles?: string[];

  @ApiProperty({ example: 'Test User', required: false })
  fullName?: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  avatarUrl?: string;

  @ApiProperty({ example: '2024-05-23T00:00:00.000Z', required: false })
  createdAt?: Date;

  @ApiProperty({ example: '2024-05-23T00:00:00.000Z', required: false })
  lastLogin?: Date;
}

class UserResponseDto {
  @ApiProperty({ example: 'Welcome testuser' })
  message!: string;

  @ApiProperty({ type: UserDto })
  user!: UserDto;
}

@ApiTags('Usuário')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: 'Usuário autenticado', type: UserResponseDto })
  async getUser(@Req() req: Request): Promise<UserResponseDto> {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.decode(token);
    if (!decoded?.preferred_username) {
      throw new UnauthorizedException();
    }

    // Extra fields from token if available
    const fullName = decoded.name;
    const avatarUrl = decoded.picture;

    // Find or create user in MongoDB, passing extra fields
    const user = await this.appService.findOrCreateUser(
      decoded.preferred_username,
      fullName,
      avatarUrl
    );

    const userDto: UserDto = {
      username: user.username,
      email: decoded.email || 'user@email.com',
      roles: decoded.realm_access?.roles || ['user'],
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    return {
      message: `Welcome ${user.username}`,
      user: userDto,
    };
  }
}