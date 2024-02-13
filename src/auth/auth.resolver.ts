import { Mutation, Resolver, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput, VerifyEmailInput } from './dto/auth.input';
import { SignInResponse } from './dto/auth.object';
import { Response } from 'express';
import { Customer } from 'src/lib/entities/customer.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponse)
  async signIn(
    @Args('data') data: SignInInput,
    @Context() context: { reply: Response; req: Request },
  ) {
    const res = await this.authService.signIn(data);
    const { accessToken } = res;

    // set cookies in the response
    context.reply?.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });

    return res;
  }

  @Mutation(() => Customer)
  async signUp(@Args('data') data: SignUpInput) {
    return this.authService.signUp(data);
  }

  @Mutation(() => Customer)
  async verifyEmail(@Args('data') data: VerifyEmailInput) {
    return this.authService.verifyEmail(data);
  }
}
