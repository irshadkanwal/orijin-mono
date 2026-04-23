import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Rule } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RuleService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRules(): Promise<Rule[]> {
    return this.prisma.rule.findMany();
  }

  async getOne(id: string): Promise<Rule> {
    const rule = await this.prisma.rule.findUnique({
      where: { id },
    });
    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }
    return rule;
  }

  async createRule(data: Prisma.RuleCreateInput): Promise<Rule> {
    return this.prisma.rule.create({
      data,
    });
  }

  async updateRule(id: string, data: Prisma.RuleUpdateInput): Promise<Rule> {
    const rule = await this.prisma.rule.update({
      where: { id },
      data,
    });
    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }
    return rule;
  }

  async deleteRule(id: string): Promise<boolean> {
    try {
      await this.prisma.rule.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }
  }
}
