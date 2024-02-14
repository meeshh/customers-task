import {
  ConflictException,
  ExecutionContext,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { compare, hash } from 'bcrypt';
import { SignInInput, SignUpInput, VerifyEmailInput } from './dto/auth.input';
import { SignInResponse } from './dto/auth.object';
import { Customer, Role } from '@prisma/client';
import { Context, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly customerService: CustomerService,
  ) {}

  private generateAccessToken(user: Customer): string {
    const { email, id, role } = user;
    return this.jwtService.sign(
      { email, id, role },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' },
    );
  }

  private generateRefreshToken(user: Customer): string {
    const { email, id, role } = user;
    return this.jwtService.sign(
      { email, id, role },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }

  async refreshAccessToken(id: string): Promise<string> {
    const [user] = await this.customerService.findAll({
      where: { id },
      skip: 0,
      take: 1,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accessToken = this.generateAccessToken(user);

    // logging to the console for debugging purposes
    // idealy, store in cookie... can't achieve this from service
    // ! test with another approach
    console.log('accessToken', accessToken);

    return accessToken;
  }

  async validateUserById(id: string) {
    try {
      const user = await this.prisma.customer.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      throw new Error('User not found');
    }
  }

  isTokenExpired(decodedToken: any): boolean {
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  }

  private generateVerificationCode(): string {
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  /**
   * sign up scenario
   * 1. check if the email is already registered
   * 2. hash the password
   * 3. generate verification code
   * 4. create the user
   * 5. return the user
   */
  async signUp(data: SignUpInput): Promise<Customer> {
    const { email, password, role = Role.USER } = data;

    // check if the email is already registered
    const existingUsers = await this.customerService.findAll({
      where: { email },
      skip: 0,
      take: 1,
    });

    // if the email is already registered, throw an error
    if (existingUsers.length) {
      throw new ConflictException('Email is already registered');
    }

    // hash password before creation
    const hashedPassword = await hash(password, 10);

    // generate verification code
    const verificationCode = this.generateVerificationCode();

    // create the user
    const newUser = await this.customerService.createCustomer({
      email: data.email,
      password: hashedPassword,
      verificationCode,
      role,
    });

    return newUser;
  }

  /**
   * verify email scenario
   * 1. find the user by email
   * 2. compare the provided verification code with the stored verification code
   * 3. if the verification code is correct, update the user as verified
   * 4. return the user
   */
  async verifyEmail(data: VerifyEmailInput): Promise<Customer> {
    const { email, verificationCode } = data;
    const user = await this.prisma.customer.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    if (user.verificationCode !== verificationCode) {
      throw new UnauthorizedException('Invalid verification code');
    }
    if (user.verified) {
      throw new ConflictException('Email is already verified');
    }

    const updatedUser = await this.customerService.updateCustomer({
      where: { email },
      fields: {
        verified: true,
        verificationCode: null,
      },
    });

    return updatedUser;
  }

  /**
   * sign in scenario
   * 1. find the user by email
   * 2. compare the provided password with the hashed password
   * 3. generate access token and refresh token
   * 4. update the user with the refresh token
   * 5. return the user and the accessToken
   */
  async signIn(data: SignInInput): Promise<SignInResponse> {
    const { email } = data;
    // find the user by email
    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id } = user;

    // don't allow non verified users to sign in
    if (!user.verified) {
      throw new UnauthorizedException('Email is not yet verified');
    }

    // compare the provided password with the hashed password
    const passwordMatch = await compare(data.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const updatedUser = await this.customerService.updateCustomer({
      where: { id },
      fields: {
        refreshToken,
      },
    });

    return {
      accessToken,
      customer: updatedUser,
    };
  }
}
