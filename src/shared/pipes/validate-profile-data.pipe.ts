import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserRole } from '@shared/types';
import { CustomerProfileDataDto } from '@shared/validators/profile-data/customer-profile.dto';
import { SectorProfessionalProfileDataDto } from '@shared/validators/profile-data/sector-professional-profile';
import { SupplierProfileDataDto } from '@shared/validators/profile-data/supplier-profile.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidateProfileDataPipe implements PipeTransform {
  private readonly profileDataDtoMap: Record<UserRole, any> = {
    [UserRole.CUSTOMER]: CustomerProfileDataDto,
    [UserRole.SUPPLIER]: SupplierProfileDataDto,
    [UserRole.SECTOR_PROFESSIONAL]: SectorProfessionalProfileDataDto,
    [UserRole.ADMIN]: null,
  };

  async transform(value: any) {
    const { role, profileData }: { role: UserRole; profileData: any } = value;

    if (!role) {
      throw new BadRequestException('User role is required for profile data validation.');
    }

    if (!profileData) {
      throw new BadRequestException('Profile data is required.');
    }

    const dtoClass = this.profileDataDtoMap[role];

    const dtoInstance = plainToInstance(dtoClass, profileData);

    const errors = await validate(dtoInstance, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
      }));

      throw new BadRequestException({
        message: 'Profile data validation failed',
        errors: messages,
      });
    }

    return {
      ...value,
      profileData: dtoInstance,
    };
  }
}
