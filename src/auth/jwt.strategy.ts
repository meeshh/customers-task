import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service'; // Import your AuthService/ Define your JWT payload interface
import { Role } from 'src/lib/entities/customer.entity';

export interface JwtPayload {
  id: string; // Unique identifier for the user
  email: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT token from Authorization header
      secretOrKey: process.env.JWT_SECRET, // Secret key used to sign tokens (must match the one in JwtModule)
    });
  }

  async validate(payload: JwtPayload) {
    // Validate JWT payload (you might want to implement this method in your AuthService)
    const user = await this.authService.validateUserById(payload.id);
    if (!user) {
      throw new Error('Unauthorized');
    }
    return user;
  }
}
