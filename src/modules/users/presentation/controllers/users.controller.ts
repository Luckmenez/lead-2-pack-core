import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id/get-user-by-id.use-case';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { ApiResponse } from '@shared/types/responses/api-response.interface';
import { Public } from '@modules/auth/presentation/decorators/public.decorator';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @SwaggerResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @SwaggerResponse({ status: HttpStatus.CONFLICT, description: 'Email already registered' })
  async create(@Body() dto: CreateUserRequestDto): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.createUserUseCase.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      companyName: dto.companyName,
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
  @ApiOperation({ summary: 'Get user by ID' })
  @SwaggerResponse({ status: HttpStatus.OK, description: 'User found', type: UserResponseDto })
  @SwaggerResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
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
