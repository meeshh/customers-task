import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CustomerService } from 'src/customer/customer.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [],
  providers: [
    AuthService,
    PrismaService,
    AuthResolver,
    CustomerService,
    JwtStrategy,
    JwtService,
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
