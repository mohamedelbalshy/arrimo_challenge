import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { SubscriptionsService } from './subscriptions.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionFrequency } from './enums/subscription-frequency.enum';
import { SubscriptionsModule } from './subscriptions.module';
import { ConflictException } from '@nestjs/common';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        SubscriptionsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'arrimo_challenge_test',
          entities: [Subscription],
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
      providers: [
        {
          provide: getRepositoryToken(Subscription),
          useClass: Repository<Subscription>,
        },
        SubscriptionsService,
      ],
    }).compile();

    service = moduleRef.get<SubscriptionsService>(SubscriptionsService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create subscription', async () => {
    const subscriptionDto: CreateSubscriptionDto = {
      email: faker.internet.email(),
      is_email_verified: true,
      subscriber_name: faker.name.fullName(),
      subscriber_country: faker.address.country(),
      frequency: SubscriptionFrequency.DAILY,
    };

    const createdSubscription = await service.create(subscriptionDto);
    expect(createdSubscription.email).toEqual(subscriptionDto.email);
    expect(createdSubscription.frequency).toEqual(subscriptionDto.frequency);
    expect(createdSubscription.is_email_verified).toEqual(
      subscriptionDto.is_email_verified,
    );
    expect(createdSubscription.subscriber_country).toEqual(
      subscriptionDto.subscriber_country,
    );
    expect(createdSubscription.subscriber_name).toEqual(
      subscriptionDto.subscriber_name,
    );
  });

  it('should not create subscription with already used email', async () => {
    const subscriptionDto: CreateSubscriptionDto = {
      email: faker.internet.email(),
      is_email_verified: true,
      subscriber_name: faker.name.fullName(),
      subscriber_country: faker.address.country(),
      frequency: SubscriptionFrequency.DAILY,
    };

    const createdSubscription = await service.create(subscriptionDto);
    expect(createdSubscription.email).toEqual(subscriptionDto.email);
    expect(createdSubscription.frequency).toEqual(subscriptionDto.frequency);
    expect(createdSubscription.is_email_verified).toEqual(
      subscriptionDto.is_email_verified,
    );
    expect(createdSubscription.subscriber_country).toEqual(
      subscriptionDto.subscriber_country,
    );
    expect(createdSubscription.subscriber_name).toEqual(
      subscriptionDto.subscriber_name,
    );

    expect(async () => await service.create(subscriptionDto)).rejects.toThrow(
      'Email must be unique!',
    );
  });
});
