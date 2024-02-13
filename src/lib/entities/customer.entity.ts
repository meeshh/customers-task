import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from 'lib/entities/base.entity';

export type Role = 'ADMIN' | 'USER';

@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  verified: boolean;

  @Field(() => String, { nullable: true })
  verificationCode: string;

  @Field(() => String, { nullable: true })
  role: Role;

  //TODO remove the following fields from the entity
  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  refreshToken: string;
}
