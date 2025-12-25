import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { loginExample, loginSupplierExample } from './examples/login.example';
import { authResponseExample } from './examples/auth-response.example';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Autenticar usuário',
      description: 'Realiza login no sistema e retorna um token JWT',
    }),
    ApiBody({
      description: 'Credenciais de login',
      examples: {
        customer: {
          summary: 'Login Cliente',
          value: loginExample,
        },
        supplier: {
          summary: 'Login Fornecedor',
          value: loginSupplierExample,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Login realizado com sucesso',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            example: authResponseExample,
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
      status: HttpStatus.UNAUTHORIZED,
      description: 'Credenciais inválidas',
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
              code: { type: 'string', example: 'INVALID_CREDENTIALS' },
              message: { type: 'string', example: 'Email ou senha inválidos' },
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
              message: { type: 'string', example: 'Email é obrigatório' },
            },
          },
        },
      },
    }),
  );
}
