import { InputType, Field } from '@nestjs/graphql';
import { Role } from 'src/lib/entities/customer.entity';

@InputType()
export class SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class SignUpInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  role?: Role;
}

@InputType()
export class VerifyEmailInput {
  @Field()
  email: string;

  @Field()
  verificationCode: string;
}
