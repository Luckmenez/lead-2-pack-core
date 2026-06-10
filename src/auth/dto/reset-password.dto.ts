import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/, {
    message:
      'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial',
  })
  novaSenha: string;
}
