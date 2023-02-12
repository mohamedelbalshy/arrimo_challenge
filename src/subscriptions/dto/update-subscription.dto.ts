import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { SubscriptionFrequency } from '../enums/subscription-frequency.enum';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @ApiProperty({ type: 'string', required: false, example: 'email@gmail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ type: 'boolean', example: true })
  @IsBoolean()
  @IsOptional()
  is_email_verified?: boolean;

  @ApiProperty({ type: 'string', example: 'Omar' })
  @IsString()
  @IsOptional()
  subscriber_name?: string;

  @ApiProperty({ type: 'string', example: 'Egypt' })
  @IsString()
  @IsOptional()
  subscriber_country?: string;

  @ApiProperty({ type: 'enum', enum: SubscriptionFrequency })
  @IsEnum(SubscriptionFrequency)
  @IsOptional()
  frequency?: SubscriptionFrequency;
}
