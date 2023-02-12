import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
        order: {
          created_at: 'DESC',
        },
      });
      return subscriptions;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepo.findOne({ where: { id } });

    if (!subscription)
      throw new NotFoundException(`Subscription with id: ${id} not found!`);
    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);

    return this.subscriptionRepo.save({
      ...subscription,
      ...updateSubscriptionDto,
    });
  }

  async remove(id: string) {
    return this.subscriptionRepo.delete({ id });
  }
}
