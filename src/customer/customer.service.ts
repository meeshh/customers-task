import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateCustomerInput,
  DeleteCustomerInput,
  GetCustomerInput,
  UpdateCustomerInput,
} from './dto/customer.input';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  async updateCustomer(data: UpdateCustomerInput): Promise<Customer> {
    const { where, email, password } = data;
    return this.prisma.customer.update({
      where,
      data: {
        email,
        password,
      },
    });
  }

  async deleteCustomer(data: DeleteCustomerInput): Promise<Customer> {
    const { where } = data;
    return this.prisma.customer.delete({
      where,
    });
  }
}
