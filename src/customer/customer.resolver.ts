import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import {
  CreateCustomerInput,
  DeleteCustomerInput,
  GetCustomerInput,
  UpdateCustomerInput,
} from './dto/customer.input';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from './roles.decorator';

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Mutation(() => Customer)
  async createCustomer(
    @Args('data')
    { email, password, verificationCode, role }: CreateCustomerInput,
  ) {
    const customerData = {
      email,
      password,
      verificationCode,
      role,
    };

    return this.customerService.createCustomer(customerData);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Customer)
  async updateCustomer(
    @Args('data')
    { where, fields }: UpdateCustomerInput,
  ) {
    return this.customerService.updateCustomer({ where, fields });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Customer)
  async deleteCustomer(@Args('data') { where }: DeleteCustomerInput) {
    return this.customerService.deleteCustomer({ where });
  }
}
