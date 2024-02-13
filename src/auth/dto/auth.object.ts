import { ObjectType, Field } from '@nestjs/graphql';
import { Customer } from 'src/lib/entities/customer.entity';

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string;

  @Field(() => Customer)
  customer: Customer;
}
