import { ApiProperty } from '@nestjs/swagger';

class UserDataDoc {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    example: 'CUSTOMER',
    enum: ['CUSTOMER', 'SUPPLIER', 'ADMIN'],
  })
  role: string;
}

export class AuthResponseDoc {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: UserDataDoc,
  })
  user: UserDataDoc;
}
