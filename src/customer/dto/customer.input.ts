import { Field, InputType, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Role } from 'src/lib/entities/customer.entity';

@InputType()
export class WhereCustomerInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Boolean, { nullable: true })
  verified?: boolean;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  role?: Role;
}

@InputType()
export class GetCustomerInput {
  @Field(() => String, { nullable: true })
  cursor?: Prisma.CustomerWhereUniqueInput;

  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  take: number;

  @Field(() => WhereCustomerInput, { nullable: true })
  where: WhereCustomerInput;
}

@InputType()
export class CreateCustomerInput {
  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  verificationCode: string;

  @Field(() => String, { nullable: true })
  role?: Role;
}

@InputType()
export class UpdateCustomerInputFields {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;

  @Field(() => Boolean, { nullable: true })
  verified?: boolean;

  @Field(() => String, { nullable: true })
  verificationCode?: string;

  @Field(() => String, { nullable: true })
  role?: Role;
}

@InputType()
export class UpdateCustomerInput {
  @Field(() => WhereCustomerInput)
  where: WhereCustomerInput;

  @Field(() => UpdateCustomerInputFields)
  fields?: UpdateCustomerInputFields;
}

@InputType()
export class DeleteCustomerInput {
  @Field(() => WhereCustomerInput)
  where: WhereCustomerInput;
}
