import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id/get-user-by-id.use-case';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { ApiResponse } from '@shared/types/responses/api-response.interface';
import { Public } from '@modules/auth/presentation/decorators/public.decorator';
import { ApiCreateUser, ApiGetUserById } from '../docs/users.docs';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Public()
  @Post()
  @ApiCreateUser()
  async create(@Body() dto: CreateUserRequestDto): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.createUserUseCase.execute({
      email: dto.email,
      password: dto.password,
      role: dto.role,
      profileData: dto.profileData,
    });

    return {
      success: true,
      data: UserResponseDto.fromEntity(user),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get(':id')
  @ApiGetUserById()
  async getById(@Param('id') id: string): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.getUserByIdUseCase.execute(id);

    return {
      success: true,
      data: UserResponseDto.fromEntity(user),
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
