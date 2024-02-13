import { Injectable, NotFoundException } from '@nestjs/common';
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

    try {
      return await this.prisma.customer.findMany({
        skip,
        take,
        cursor,
        where,
      });
    } catch (error) {
      throw new NotFoundException('Something went wrong');
    }
  }

  async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    const { email, password, verificationCode } = data;

    try {
      return await this.prisma.customer.create({
        data: {
          email,
          password,
          verificationCode,
        },
      });
    } catch (error) {
      throw new NotFoundException('Something went wrong');
    }
  }

  async updateCustomer(data: UpdateCustomerInput): Promise<Customer> {
    const { where, fields } = data;

    try {
      return await this.prisma.customer.update({
        where,
        data: fields,
      });
    } catch (error) {
      throw new NotFoundException('Something went wrong');
    }
  }

  async deleteCustomer(data: DeleteCustomerInput): Promise<Customer> {
    const { where } = data;

    try {
      return await this.prisma.customer.delete({
        where,
      });
    } catch (error) {
      throw new NotFoundException('Something went wrong');
    }
  }
}
