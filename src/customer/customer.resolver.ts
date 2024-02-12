import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import {
  CreateCustomerInput,
  DeleteCustomerInput,
  GetCustomerInput,
  UpdateCustomerInput,
} from './dto/customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Mutation(() => Customer)
  async createCustomer(@Args('data') { email, password }: CreateCustomerInput) {
    const customerData = {
      email: email,
      password: password,
    };

    return this.customerService.createCustomer(customerData);
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @Args('data') { where, email, password }: UpdateCustomerInput,
  ) {
    const customerData = {
      where,
      email,
      password,
    };

    return this.customerService.updateCustomer(customerData);
  }

  @Mutation(() => Customer)
  async deleteCustomer(@Args('data') { where }: DeleteCustomerInput) {
    return this.customerService.deleteCustomer({ where });
  }
}
