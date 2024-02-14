import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';
import { CustomerResolver } from './customer.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [CustomerService, PrismaService, CustomerResolver, JwtAuthGuard],
})
export class CustomerModule {}
