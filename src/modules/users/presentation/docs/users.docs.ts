import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { createCustomerExample, createSupplierExample } from './examples/create-user.example';
import { userResponseExample } from './examples/user-response.example';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar novo usuário',
      description: 'Cria um novo usuário no sistema. Pode ser CUSTOMER ou SUPPLIER.',
    }),
    ApiBody({
      description: 'Dados para criação do usuário',
      examples: {
        customer: {
          summary: 'Criar Cliente',
          value: createCustomerExample,
        },
        supplier: {
          summary: 'Criar Fornecedor',
          value: createSupplierExample,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Usuário criado com sucesso',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            example: userResponseExample,
          },
          metadata: {
            type: 'object',
            properties: {
              timestamp: {
                type: 'string',
                example: '2024-01-15T10:30:00Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Dados inválidos',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Email inválido' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Email já cadastrado',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'EMAIL_ALREADY_EXISTS' },
              message: { type: 'string', example: 'Este email já está cadastrado' },
            },
          },
        },
      },
    }),
  );
}

export function ApiGetUserById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar usuário por ID',
      description: 'Retorna os dados de um usuário específico pelo seu ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Usuário encontrado',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            example: userResponseExample,
          },
          metadata: {
            type: 'object',
            properties: {
              timestamp: {
                type: 'string',
                example: '2024-01-15T10:30:00Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuário não encontrado',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'USER_NOT_FOUND' },
              message: { type: 'string', example: 'Usuário não encontrado' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Não autorizado',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: 'Token inválido ou expirado' },
            },
          },
        },
      },
    }),
  );
}
