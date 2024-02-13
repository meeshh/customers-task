import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/lib/entities/customer.entity';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
