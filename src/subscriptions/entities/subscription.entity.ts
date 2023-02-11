import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionFrequency } from '../enums/subscription-frequency.enum';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({ type: 'varchar', nullable: false })
  subscriber_name: string;

  @Column({ type: 'varchar', nullable: true })
  subscriber_country: string;

  @Column({ type: 'enum', enum: SubscriptionFrequency, nullable: false })
  frequency: SubscriptionFrequency;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
