import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { SubscriptionsService } from './subscriptions.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionFrequency } from './enums/subscription-frequency.enum';
import { SubscriptionsModule } from './subscriptions.module';
import { ConfigModule } from '@nestjs/config';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        SubscriptionsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: +process.env.DB_PORT || 5432,
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME_TEST || 'arrimo_challenge_test',
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

  it('should list all subscriptions', async () => {
    const subscriptionDto: CreateSubscriptionDto = {
      email: faker.internet.email(),
      is_email_verified: true,
      subscriber_name: faker.name.fullName(),
      subscriber_country: faker.address.country(),
      frequency: SubscriptionFrequency.DAILY,
    };

    const createdSubscription = await service.create(subscriptionDto);

    const subscriptions = await service.findAll({ skip: 0, take: 10 });

    expect(subscriptions[0]).toEqual(createdSubscription);
  });

  it('should get single subscription by id', async () => {
    const subscriptionDto: CreateSubscriptionDto = {
      email: faker.internet.email(),
      is_email_verified: true,
      subscriber_name: faker.name.fullName(),
      subscriber_country: faker.address.country(),
      frequency: SubscriptionFrequency.DAILY,
    };

    const createdSubscription = await service.create(subscriptionDto);

    const foundSubscription = await service.findOne(createdSubscription.id);

    expect(foundSubscription).toEqual(createdSubscription);
  });

  it('should return subscription not found by wrong id', async () => {
    expect(async () => await service.findOne('1')).rejects.toThrow();
  });

  it('should update subscription by id', async () => {
    const subscriptionDto: CreateSubscriptionDto = {
      email: faker.internet.email(),
      is_email_verified: true,
      subscriber_name: faker.name.fullName(),
      subscriber_country: faker.address.country(),
      frequency: SubscriptionFrequency.DAILY,
    };

    const createdSubscription = await service.create(subscriptionDto);

    const updateSubscriptionDto: UpdateSubscriptionDto = {
      email: faker.internet.email(),
    };
    const updatedSubscription = await service.update(
      createdSubscription.id,
      updateSubscriptionDto,
    );
    delete updatedSubscription.updated_at;
    delete createdSubscription.updated_at;

    expect(updatedSubscription).toEqual({
      ...createdSubscription,
      email: updateSubscriptionDto.email,
    });
  });

  it('should return subscription not found when update subscription by invalid id', async () => {
    const updateSubscriptionDto: UpdateSubscriptionDto = {
      email: faker.internet.email(),
    };

    expect(
      async () => await service.update('fake id', updateSubscriptionDto),
    ).rejects.toThrow();
  });

  it('should delete subscription by id', async () => {
    const subscriptionDto: CreateSubscriptionDto = {
      email: faker.internet.email(),
      is_email_verified: true,
      subscriber_name: faker.name.fullName(),
      subscriber_country: faker.address.country(),
      frequency: SubscriptionFrequency.DAILY,
    };

    const createdSubscription = await service.create(subscriptionDto);

    const removeSubscriptionRes = await service.remove(createdSubscription.id);

    expect(removeSubscriptionRes.affected).toEqual(1);
  });

  it('should not delete subscription by wrong id', async () => {
    expect(async () => await service.remove('fake id')).rejects.toThrow();
  });
});
