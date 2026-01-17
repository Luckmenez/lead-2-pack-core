import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { BcryptPasswordHasherService } from '../../../infrastructure/services/bcrypt-password-hasher.service';
import { CreateUserDto } from './create-user.dto';
import { ISectorRepository } from '../../../../sectors/domain/repositories/sector-repository.interface';
import { UserRole } from '@shared/types/enums/user-role.enum';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(ISectorRepository)
    private readonly sectorRepository: ISectorRepository,
    private readonly passwordHasher: BcryptPasswordHasherService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    const email = Email.create(dto.email);

    const emailExists = await this.userRepository.existsByEmail(email);

    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    // Validate sectorIds for SUPPLIER and SECTOR_PROFESSIONAL
    if (dto.role === UserRole.SUPPLIER || dto.role === UserRole.SECTOR_PROFESSIONAL) {
      if (!dto.sectorIds || dto.sectorIds.length === 0) {
        throw new BadRequestException(
          `sectorIds is required for ${dto.role === UserRole.SUPPLIER ? 'SUPPLIER' : 'SECTOR_PROFESSIONAL'}`,
        );
      }

      // Verify all sectors exist
      const sectors = await this.sectorRepository.findByIds(dto.sectorIds);

      if (sectors.length !== dto.sectorIds.length) {
        const foundIds = sectors.map((s) => s.id);
        const missingIds = dto.sectorIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(
          `The following sector IDs were not found: ${missingIds.join(', ')}`,
        );
      }
    }

    const plainPassword = Password.create(dto.password);

    const hashedPassword = await this.passwordHasher.hash(plainPassword.value);
    const password = Password.fromHash(hashedPassword);

    const user = UserEntity.create({
      email,
      password,
      role: dto.role,
      profileData: dto.profileData,
      sectorIds: dto.sectorIds,
    });

    return await this.userRepository.save(user);
  }
}
