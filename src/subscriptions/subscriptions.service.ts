import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  private readonly logger = new Logger(SubscriptionsService.name);

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    try {
      const subscription = this.subscriptionRepo.create(createSubscriptionDto);
      const createdSubscription = await this.subscriptionRepo.save(
        subscription,
      );
      return createdSubscription;
    } catch (error) {
      this.logger.error(error.message);
      switch (error.code) {
        case '23505':
          throw new ConflictException('Email must be unique!');
      }
    }
  }

  async findAll(pagination: PaginationDto): Promise<Subscription[]> {
    try {
      const { take, skip } = pagination;
      const subscriptions = await this.subscriptionRepo.find({
        where: {},
        take,
        skip,
      });
      return subscriptions;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
