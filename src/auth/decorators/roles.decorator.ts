import { SetMetadata } from '@nestjs/common';
import type { JwtPayload } from '../strategies/jwt.strategy';

export const ROLES_KEY = 'roles';

export type PerfilRole = JwtPayload['tipo']; // inclui 'admin' via JwtPayload

export const Roles = (...roles: PerfilRole[]) => SetMetadata(ROLES_KEY, roles);
